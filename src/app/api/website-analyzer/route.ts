import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_HTML_SIZE = 1024 * 1024; // 1 MB
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_REDIRECTS = 5;

type AnalysisResult = {
  url: string;
  finalUrl: string;
  statusCode: number;
  isHttps: boolean;
  title: {
    value: string | null;
    exists: boolean;
    length: number;
  };
  metaDescription: {
    value: string | null;
    exists: boolean;
    length: number;
  };
  h1: {
    count: number;
    headings: string[];
    exists: boolean;
  };
  viewport: {
    exists: boolean;
    value: string | null;
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  seoScore: number;
  issues: string[];
  recommendations: string[];
};

// Check whether an IPv4 address is private or reserved.
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

// Check whether an IPv6 address is private or reserved.
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase().split("%")[0];

  if (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    /^fe[89ab]/.test(normalized) ||
    normalized.startsWith("ff")
  ) {
    return true;
  }

  // Handle IPv4-mapped IPv6 addresses.
  const mapped = normalized.match(
    /::ffff:(\d+\.\d+\.\d+\.\d+)$/,
  );

  if (mapped) {
    return isPrivateIPv4(mapped[1]);
  }

  return false;
}

// Validate hostname and resolve DNS records.
async function validatePublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase().replace(/\.$/, "");

  if (
    !host ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".test") ||
    host.endsWith(".invalid") ||
    host.endsWith(".example")
  ) {
    throw new Error("Local or private URLs are not allowed.");
  }

  const ipVersion = isIP(host);

  // Do not allow direct IP addresses.
  if (ipVersion !== 0) {
    throw new Error("Direct IP addresses are not allowed.");
  }

  let addresses;

  try {
    addresses = await lookup(host, {
      all: true,
      verbatim: true,
    });
  } catch {
    throw new Error("Unable to resolve website hostname.");
  }

  if (addresses.length === 0) {
    throw new Error("Website hostname could not be resolved.");
  }

  // Block the entire hostname if any resolved address is private.
  for (const address of addresses) {
    const privateAddress =
      address.family === 4
        ? isPrivateIPv4(address.address)
        : isPrivateIPv6(address.address);

    if (privateAddress) {
      throw new Error("Private or restricted network addresses are not allowed.");
    }
  }
}

// Validate URL.
function validateUrl(value: string): URL {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Please enter a valid website URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS websites are supported.");
  }

  if (url.username || url.password) {
    throw new Error("URLs containing credentials are not allowed.");
  }

  if (!url.hostname) {
    throw new Error("Website hostname is required.");
  }

  return url;
}

// Fetch HTML with redirect and response-size protection.
async function fetchWebsite(initialUrl: string) {
  let currentUrl = validateUrl(initialUrl);

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
    await validatePublicHost(currentUrl.hostname);

    let response: Response;

    try {
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        headers: {
          "User-Agent": "ClientFinderAI-WebsiteAnalyzer/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } catch {
      throw new Error(
        "Unable to access website. It may be unavailable or blocking automated requests.",
      );
    }

    // Handle redirects manually.
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("Website returned an invalid redirect.");
      }

      if (redirect === MAX_REDIRECTS) {
        throw new Error("Too many website redirects.");
      }

      const nextUrl = new URL(location, currentUrl);
      currentUrl = validateUrl(nextUrl.toString());

      continue;
    }

    if (!response.ok) {
      throw new Error(
        `Website returned HTTP status ${response.status}.`,
      );
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("text/html")) {
      throw new Error("The requested URL does not return an HTML page.");
    }

    const contentLength = Number(
      response.headers.get("content-length") || 0,
    );

    if (contentLength > MAX_HTML_SIZE) {
      throw new Error("Website HTML is too large to analyze.");
    }

    if (!response.body) {
      throw new Error("Website returned an empty response.");
    }

    const reader = response.body.getReader();

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        totalSize += value.length;

        if (totalSize > MAX_HTML_SIZE) {
          await reader.cancel();
          throw new Error("Website HTML exceeds the 1 MB limit.");
        }

        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    const htmlBytes = new Uint8Array(totalSize);

    let offset = 0;

    for (const chunk of chunks) {
      htmlBytes.set(chunk, offset);
      offset += chunk.length;
    }

    const html = new TextDecoder("utf-8").decode(htmlBytes);

    return {
      html,
      statusCode: response.status,
      finalUrl: currentUrl.toString(),
    };
  }

  throw new Error("Unable to fetch website.");
}

// Decode common HTML entities.
function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16)),
    );
}

// Remove HTML tags and clean text.
function cleanText(value: string): string {
  return decodeHtml(value.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

// Get HTML attribute.
function getAttribute(
  tag: string,
  attribute: string,
): string | null {
  const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `\\b${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );

  const match = tag.match(regex);

  return match
    ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? "")
    : null;
}

// Extract meta description.
function getMetaDescription(html: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];

  for (const tag of tags) {
    const name = getAttribute(tag, "name");

    if (name?.toLowerCase() === "description") {
      return getAttribute(tag, "content");
    }
  }

  return null;
}

// Extract viewport.
function getViewport(html: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];

  for (const tag of tags) {
    const name = getAttribute(tag, "name");

    if (name?.toLowerCase() === "viewport") {
      return getAttribute(tag, "content");
    }
  }

  return null;
}

// Perform website SEO analysis.
function analyzeWebsite(
  html: string,
  url: string,
  finalUrl: string,
  statusCode: number,
): AnalysisResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  let score = 0;

  // 1. Page Title
  const titleMatch = html.match(
    /<title\b[^>]*>([\s\S]*?)<\/title>/i,
  );

  const title = titleMatch
    ? cleanText(titleMatch[1])
    : null;

  if (title) {
    score += 20;

    if (title.length < 30 || title.length > 60) {
      issues.push("Page title length is not within the recommended range.");

      recommendations.push(
        "Keep your page title around 30 to 60 characters.",
      );
    }
  } else {
    issues.push("Page title is missing.");

    recommendations.push(
      "Add a descriptive and unique page title.",
    );
  }

  // 2. Meta Description
  const description = getMetaDescription(html);

  if (description) {
    score += 20;

    if (
      description.length < 70 ||
      description.length > 160
    ) {
      issues.push(
        "Meta description length is outside the recommended range.",
      );

      recommendations.push(
        "Write a useful meta description of approximately 70 to 160 characters.",
      );
    }
  } else {
    issues.push("Meta description is missing.");

    recommendations.push(
      "Add a unique meta description to describe the page.",
    );
  }

  // 3. H1 Heading
  const h1Matches = html.match(
    /<h1\b[^>]*>[\s\S]*?<\/h1>/gi,
  ) || [];

  const h1Headings = h1Matches
    .map(cleanText)
    .filter(Boolean);

  if (h1Headings.length === 1) {
    score += 20;
  } else if (h1Headings.length === 0) {
    issues.push("Main H1 heading is missing.");

    recommendations.push(
      "Add one clear H1 heading describing the page.",
    );
  } else {
    score += 10;

    issues.push("Multiple H1 headings were found.");

    recommendations.push(
      "Use a clear primary H1 heading and organize other headings properly.",
    );
  }

  // 4. Mobile Viewport
  const viewport = getViewport(html);

  if (viewport) {
    score += 15;
  } else {
    issues.push("Mobile viewport meta tag is missing.");

    recommendations.push(
      "Add a viewport meta tag to improve mobile responsiveness.",
    );
  }

  // 5. Image Alt Attributes
  const imageTags = html.match(/<img\b[^>]*>/gi) || [];

  let imagesWithAlt = 0;
  let imagesWithoutAlt = 0;

  for (const imageTag of imageTags) {
    const alt = getAttribute(imageTag, "alt");

    if (alt !== null) {
      imagesWithAlt++;
    } else {
      imagesWithoutAlt++;
    }
  }

  if (imageTags.length === 0) {
    score += 15;
  } else if (imagesWithoutAlt === 0) {
    score += 15;
  } else {
    const ratio = imagesWithAlt / imageTags.length;

    score += Math.round(ratio * 15);

    issues.push(
      `${imagesWithoutAlt} image(s) are missing alt attributes.`,
    );

    recommendations.push(
      "Add meaningful alt attributes to images where appropriate.",
    );
  }

  // 6. HTTPS
  const isHttps = new URL(finalUrl).protocol === "https:";

  if (isHttps) {
    score += 10;
  } else {
    issues.push("Website is not using HTTPS.");

    recommendations.push(
      "Secure your website with HTTPS and a valid SSL certificate.",
    );
  }

  if (issues.length === 0) {
    recommendations.push(
      "Good job! No major issues were detected by this basic analyzer.",
    );
  }

  return {
    url,
    finalUrl,
    statusCode,
    isHttps,

    title: {
      value: title,
      exists: Boolean(title),
      length: title?.length || 0,
    },

    metaDescription: {
      value: description,
      exists: Boolean(description),
      length: description?.length || 0,
    },

    h1: {
      count: h1Headings.length,
      headings: h1Headings,
      exists: h1Headings.length > 0,
    },

    viewport: {
      exists: Boolean(viewport),
      value: viewport,
    },

    images: {
      total: imageTags.length,
      withAlt: imagesWithAlt,
      withoutAlt: imagesWithoutAlt,
    },

    seoScore: Math.min(score, 100),

    issues,
    recommendations,
  };
}

// POST API
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("url" in body) ||
      typeof body.url !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid website URL.",
        },
        { status: 400 },
      );
    }

    const inputUrl = body.url.trim();

    if (!inputUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Website URL is required.",
        },
        { status: 400 },
      );
    }

    const normalizedUrl = /^https?:\/\//i.test(inputUrl)
      ? inputUrl
      : `https://${inputUrl}`;

    validateUrl(normalizedUrl);

    const { html, statusCode, finalUrl } =
      await fetchWebsite(normalizedUrl);

    const analysis = analyzeWebsite(
      html,
      normalizedUrl,
      finalUrl,
      statusCode,
    );

    return NextResponse.json({
      success: true,
      message: "Website analysis completed successfully.",
      data: analysis,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

    const status = message.includes("valid website URL") ||
      message.includes("required") ||
      message.includes("Only HTTP") ||
      message.includes("not allowed")
        ? 400
        : 422;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}