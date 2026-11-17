import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    placeId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    // 1. Check API key
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Google Maps API key is not configured.",
        },
        { status: 500 }
      );
    }

    // 2. Get Place ID from URL
    const { placeId } = await params;

    if (!placeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Place ID is required.",
        },
        { status: 400 }
      );
    }

    // 3. Call Google Places Details API
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "nationalPhoneNumber,internationalPhoneNumber,websiteUri,rating",
        },
        cache: "no-store",
      }
    );

    // 4. Handle Google API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      console.error("Google Places Details Error:", errorData);

      return NextResponse.json(
        {
          success: false,
          error:
            errorData?.error?.message ||
            "Failed to fetch business details.",
        },
        { status: response.status }
      );
    }

    // 5. Get business details
    const data = await response.json();

    // 6. Format details
    const business = {
      phone:
        data.internationalPhoneNumber ||
        data.nationalPhoneNumber ||
        "",
      website: data.websiteUri || "",
      rating: data.rating ?? null,
    };

    // 7. Return business details
    return NextResponse.json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Business Details Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while fetching business details.",
      },
      { status: 500 }
    );
  }
}