"use client";

import { useState } from "react";

type AnalysisData = {
  url: string;
  finalUrl: string;
  statusCode: number;
  isHttps: boolean;

  title: {
    value: string;
    exists: boolean;
    length: number;
  };

  metaDescription: {
    value: string;
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
    value: string;
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

type ApiResponse = {
  success: boolean;
  message: string;
  data?: AnalysisData;
};

export default function WebsiteAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisData | null>(null);

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/website-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.message || "Website analysis failed.");
      }

      setResult(data.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  
  const getStatus = (condition: boolean) => {
    return condition
      ? {
          label: "Passed",
          className: "bg-green-100 text-green-700",
        }
      : {
          label: "Needs Attention",
          className: "bg-red-100 text-red-700",
        };
  };

  const openWebsite = (websiteUrl: string) => {
    try {
      const parsedUrl = new URL(websiteUrl);

      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        return;
      }

      window.open(parsedUrl.href, "_blank", "noopener,noreferrer");
    } catch {
      // Ignore invalid URLs.
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Website Analyzer
          </h1>

          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Analyze business websites, discover SEO problems and identify
            potential freelance service opportunities.
          </p>
        </div>

        {/* URL Input */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Analyze a Website
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter a public business website URL to check its basic SEO and
              technical health.
            </p>
          </div>

          <form
            onSubmit={handleAnalyze}
            className="flex flex-col gap-3 md:flex-row"
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
              className="min-h-12 flex-1 rounded-lg border border-gray-300 px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 rounded-lg bg-blue-600 px-7 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Analyzing..." : "Analyze Website"}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-5 flex items-center gap-3 text-sm text-blue-600">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

              Analyzing website. Please wait...
            </div>
          )}
        </div>

        {/* Initial State */}
        {!result && !loading && !error && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              🔍
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Ready to Analyze
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Enter a business website URL above. ClientFinder AI will check
              its basic SEO elements and find areas that may need improvement.
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {result && (
          <div className="space-y-6">
            {/* Website Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Analyzed Website
                  </p>

                  <h2 className="mt-2 break-all text-lg font-bold text-gray-900">
                    {result.finalUrl}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    HTTP Status Code:{" "}
                    <span className="font-semibold text-gray-800">
                      {result.statusCode}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openWebsite(result.finalUrl)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Visit Website ↗
                </button>
              </div>
            </div>

            {/* SEO Score */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-1">
                <p className="text-sm font-medium text-gray-500">
                  Website SEO Score
                </p>

                <div className="mt-5 flex items-center justify-center">
                  <div
                    className="flex h-40 w-40 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#2563eb ${
                        Math.min(100, Math.max(0, result.seoScore)) * 3.6
                      }deg, #e5e7eb 0deg)`,
                    }}
                  >
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                      <span
                        className={`text-4xl font-bold ${getScoreColor(
                          result.seoScore
                        )}`}
                      >
                        {result.seoScore}
                      </span>

                      <span className="text-xs text-gray-500">out of 100</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span
                    className={`text-sm font-semibold ${getScoreColor(
                      result.seoScore
                    )}`}
                  >
                    {getScoreLabel(result.seoScore)}
                  </span>
                </div>
              </div>

              {/* Quick Statistics */}
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <StatCard
                  title="Total Images"
                  value={result.images.total}
                  description="Images found"
                />

                <StatCard
                  title="Missing Alt Text"
                  value={result.images.withoutAlt}
                  description="Images needing attention"
                />

                <StatCard
                  title="H1 Headings"
                  value={result.h1.count}
                  description="Main headings found"
                />

                <StatCard
                  title="SEO Issues"
                  value={result.issues.length}
                  description="Potential improvements"
                />
              </div>
            </div>

            {/* SEO Checks */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Website Health Checks
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic technical and on-page SEO checks.
              </p>

              <div className="mt-5 divide-y divide-gray-100">
                <CheckItem
                  title="HTTPS Security"
                  description="Website connection security"
                  status={getStatus(result.isHttps)}
                  detail={result.isHttps ? "HTTPS enabled" : "HTTPS not detected"}
                />

                <CheckItem
                  title="Page Title"
                  description="Search engine page title"
                  status={getStatus(result.title.exists)}
                  detail={
                    result.title.value ||
                    "No page title found"
                  }
                />

                <CheckItem
                  title="Meta Description"
                  description="Search result description"
                  status={getStatus(result.metaDescription.exists)}
                  detail={
                    result.metaDescription.value ||
                    "No meta description found"
                  }
                />

                <CheckItem
                  title="H1 Heading"
                  description="Main page heading"
                  status={getStatus(result.h1.exists)}
                  detail={
                    result.h1.headings.length > 0
                      ? result.h1.headings.join(", ")
                      : "No H1 heading found"
                  }
                />

                <CheckItem
                  title="Mobile Viewport"
                  description="Mobile responsive viewport configuration"
                  status={getStatus(result.viewport.exists)}
                  detail={
                    result.viewport.value ||
                    "No viewport meta tag found"
                  }
                />

                <CheckItem
                  title="Image Alt Text"
                  description="Alternative text for images"
                  status={getStatus(result.images.withoutAlt === 0)}
                  detail={`${result.images.withAlt} of ${result.images.total} images have alt text`}
                />
              </div>
            </div>

            {/* Issues */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Website Issues
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Potential problems identified during analysis.
                  </p>
                </div>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  {result.issues.length} Issues
                </span>
              </div>

              {result.issues.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {result.issues.map((issue, index) => (
                    <div
                      key={`${index}-${issue}`}
                      className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4"
                    >
                      <span className="mt-0.5 text-red-600">●</span>

                      <p className="text-sm text-gray-700">{issue}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-lg bg-green-50 p-5 text-sm text-green-700">
                  No issues were detected by these basic checks.
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Freelance Service Opportunities
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Use these recommendations to identify services you could offer
                to this business.
              </p>

              {result.recommendations.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {result.recommendations.map((recommendation, index) => (
                    <div
                      key={`${index}-${recommendation}`}
                      className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>

                      <p className="text-sm leading-6 text-gray-700">
                        {recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  No recommendations available.
                </p>
              )}
            </div>

            {/* Page Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Technical Details
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <DetailItem
                  label="Page Title Length"
                  value={`${result.title.length} characters`}
                />

                <DetailItem
                  label="Meta Description Length"
                  value={`${result.metaDescription.length} characters`}
                />

                <DetailItem
                  label="Images with Alt Text"
                  value={`${result.images.withAlt} / ${result.images.total}`}
                />

                <DetailItem
                  label="Images without Alt Text"
                  value={String(result.images.withoutAlt)}
                />

                <DetailItem
                  label="H1 Heading Count"
                  value={String(result.h1.count)}
                />

                <DetailItem
                  label="HTTPS"
                  value={result.isHttps ? "Enabled" : "Not Enabled"}
                />
              </div>
            </div>

            {/* Analyze Another Website */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-blue-600 p-6 text-center text-white md:flex-row md:text-left">
              <div>
                <h3 className="text-lg font-bold">
                  Analyze Another Business Website
                </h3>

                <p className="mt-1 text-sm text-blue-100">
                  Discover more website improvement opportunities for your
                  freelance business.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setUrl("");
                  setError("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Analyze New Website
              </button>
            </div>

            <p className="text-center text-xs text-gray-400">
              Analysis is based on basic HTML and SEO checks. It is not a
              complete SEO audit or a guarantee of search engine performance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable Components */

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}

function CheckItem({
  title,
  description,
  status,
  detail,
}: {
  title: string;
  description: string;
  status: {
    label: string;
    className: string;
  };
  detail: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 py-4 md:flex-row md:items-center">
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-xs text-gray-500">{description}</p>

        <p className="mt-2 break-words text-sm text-gray-700">{detail}</p>
      </div>

      <span
        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
      >
        {status.label}
      </span>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}