import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const allowedWritingTypes = [
  "cold-email",
  "follow-up",
  "linkedin",
] as const;

type WritingType = (typeof allowedWritingTypes)[number];

type AIWriterRequest = {
  writingType: WritingType;
  businessName: string;
  businessType?: string;
  service: string;
  tone?: string;
  details?: string;
};

export async function POST(request: NextRequest) {
  try {
    // 1. Check API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key is missing. Please configure OPENAI_API_KEY.",
        },
        { status: 500 }
      );
    }

    // 2. Read request body
    const body = (await request.json()) as AIWriterRequest;

    const {
      writingType,
      businessName,
      businessType = "",
      service,
      tone = "Professional",
      details = "",
    } = body;

    // 3. Validate required fields
    if (!writingType || !businessName?.trim() || !service?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Business name, service and writing type are required.",
        },
        { status: 400 }
      );
    }

    if (!allowedWritingTypes.includes(writingType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid writing type.",
        },
        { status: 400 }
      );
    }

    // 4. Validate input length
    if (
      businessName.length > 150 ||
      businessType.length > 150 ||
      service.length > 200 ||
      tone.length > 50 ||
      details.length > 2000
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "One or more fields are too long.",
        },
        { status: 400 }
      );
    }

    // 5. Select content type
    const contentInstructions: Record<WritingType, string> = {
      "cold-email": `
        Write a personalized cold outreach email.

        Requirements:
        - Create an attractive subject line.
        - Start with a natural greeting.
        - Introduce the sender's service.
        - Explain how the service could help the business.
        - Include a clear but friendly call to action.
        - Keep the email concise and engaging.
        - Avoid sounding like spam.
      `,

      "follow-up": `
        Write a professional follow-up email.

        Requirements:
        - Include a suitable subject line.
        - Politely refer to the previous outreach.
        - Briefly remind the recipient about the service.
        - Provide a reason to respond.
        - End with a simple call to action.
        - Do not sound pushy or demanding.
      `,

      linkedin: `
        Write a personalized LinkedIn connection or outreach message.

        Requirements:
        - Keep it short and conversational.
        - Introduce the sender naturally.
        - Mention the potential value of the service.
        - Avoid overly promotional language.
        - End with a friendly invitation to connect.
      `,
    };

    // 6. Create AI prompt
    const prompt = `
      Create a business outreach message using the following information.

      BUSINESS INFORMATION:
      Business Name: ${businessName}
      Business Type: ${businessType || "Not specified"}

      SENDER INFORMATION:
      Service Offered: ${service}

      WRITING PREFERENCES:
      Tone: ${tone}

      ADDITIONAL INFORMATION:
      ${details || "No additional information provided."}

      CONTENT TYPE:
      ${contentInstructions[writingType]}

      IMPORTANT RULES:
      - Do not invent facts about the business.
      - Do not claim to have researched the business.
      - Do not invent previous conversations or relationships.
      - Do not make unrealistic promises.
      - Use natural, professional English.
      - Make the message personalized using only the information provided.
      - Return only the finished message.
    `;

    // 7. Generate content using OpenAI
    const response = await openai.responses.create({
      model: "gpt-5.5",
      instructions:
        "You are an expert B2B sales copywriter specializing in ethical, personalized client outreach.",
      input: prompt,
      max_output_tokens: 800,
      store: false,
    });

    const generatedContent = response.output_text?.trim();

    if (!generatedContent) {
      return NextResponse.json(
        {
          success: false,
          error: "AI could not generate content. Please try again.",
        },
        { status: 502 }
      );
    }

    // 8. Return generated content
    return NextResponse.json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error("AI Writer API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate content. Please try again.",
      },
      { status: 500 }
    );
  }
}