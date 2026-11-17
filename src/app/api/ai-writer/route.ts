import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

// ========================================
// 1. OpenAI Configuration
// ========================================

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

// ========================================
// 2. Allowed Writing Types
// ========================================

const allowedWritingTypes = [
  "cold-email",
  "follow-up",
  "linkedin",
] as const;

type WritingType = (typeof allowedWritingTypes)[number];

// ========================================
// 3. Request Type
// ========================================

type AIWriterRequest = {
  writingType: WritingType;
  businessName: string;
  businessType?: string;
  service: string;
  tone?: string;
  details?: string;
};

// ========================================
// 4. POST Request
// ========================================

export async function POST(request: NextRequest) {
  try {
    // Check API Key
    if (!openai) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 503 }
      );
    }

    // ========================================
    // 5. Read Request Body
    // ========================================

    let body: AIWriterRequest;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const {
      writingType,
      businessName,
      businessType = "",
      service,
      tone = "Professional",
      details = "",
    } = body;

    // ========================================
    // 6. Validate Input
    // ========================================

    if (!writingType || !allowedWritingTypes.includes(writingType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid writing type.",
        },
        { status: 400 }
      );
    }

    if (
      typeof businessName !== "string" ||
      !businessName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Business name is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof service !== "string" ||
      !service.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please describe your service.",
        },
        { status: 400 }
      );
    }

    if (
      typeof businessType !== "string" ||
      typeof tone !== "string" ||
      typeof details !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input fields.",
        },
        { status: 400 }
      );
    }

    // Limit input lengths
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
          message: "One or more fields exceed the allowed length.",
        },
        { status: 400 }
      );
    }

    // ========================================
    // 7. Writing Instructions
    // ========================================

    let writingInstructions = "";

    switch (writingType) {
      case "cold-email":
        writingInstructions = `
          Write a professional cold outreach email.

          Requirements:
          - Create an attention-grabbing subject line.
          - Start with a natural and personalized opening.
          - Explain the value of the offered service.
          - Keep the email concise and persuasive.
          - Include a simple call to action.
          - Avoid aggressive sales language.
          - Do not make unrealistic promises.
        `;
        break;

      case "follow-up":
        writingInstructions = `
          Write a polite and professional follow-up email.

          Requirements:
          - Use a friendly and respectful tone.
          - Briefly refer to the previous conversation or email.
          - Remind the recipient of the service's value.
          - Avoid sounding pushy or desperate.
          - Include a simple call to action.
          - Keep the email short and natural.
        `;
        break;

      case "linkedin":
        writingInstructions = `
          Write a professional LinkedIn outreach message.

          Requirements:
          - Start with a friendly introduction.
          - Keep the message short and engaging.
          - Explain the potential value of the service.
          - Use natural conversational language.
          - Avoid sounding like spam.
          - End with a friendly question or call to action.
        `;
        break;
    }

    // ========================================
    // 8. Build AI Prompt
    // ========================================

    const prompt = `
Business Information:

Business Name: ${businessName.trim()}
Business Type: ${businessType.trim() || "Not specified"}

Service Offered:

${service.trim()}

Preferred Writing Tone:

${tone.trim() || "Professional"}

Additional Information:

${details.trim() || "No additional information provided."}


Writing Task:

${writingInstructions}


Important Rules:

1. Write in clear, natural and professional English.
2. Personalize the message using the provided information.
3. Never invent facts about the business.
4. Never claim that research or communication has happened when it has not.
5. Never invent previous relationships or conversations.
6. Do not make false guarantees or unrealistic promises.
7. Avoid generic AI-sounding language.
8. Make the message easy to read.
9. Return only the finished message.
10. Do not include explanations or comments about the generated message.
`;

    // ========================================
    // 9. Generate Content with OpenAI
    // ========================================

    const response = await openai.responses.create({
      model: "gpt-5.5",

      instructions: `
        You are an expert B2B sales copywriter.

        Your job is to create professional, ethical,
        personalized business outreach messages
        for freelancers and digital agencies.

        Focus on clarity, relevance, personalization
        and natural human communication.

        Never fabricate information.
      `,

      input: prompt,

      max_output_tokens: 800,

      store: false,
    });

    // ========================================
    // 10. Extract Generated Content
    // ========================================

    const content = response.output_text?.trim();

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "AI could not generate content. Please try again.",
        },
        { status: 500 }
      );
    }

    // ========================================
    // 11. Return Success Response
    // ========================================

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("AI Writer API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "";

    // Handle insufficient API credits
    if (
      errorMessage.includes("insufficient_quota") ||
      errorMessage.includes("exceeded your current quota") ||
      errorMessage.includes("credit balance")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your OpenAI API account has insufficient credits. Please add API credits to use AI Writer.",
        },
        { status: 402 }
      );
    }

    // Handle rate limits
    if (
      errorMessage.includes("rate_limit") ||
      errorMessage.includes("429")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OpenAI API rate limit reached. Please try again later.",
        },
        { status: 429 }
      );
    }

    // General Error
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to generate content. Please try again later.",
      },
      { status: 500 }
    );
  }
}