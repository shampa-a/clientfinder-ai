import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Check Google Maps API key
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

    // 2. Get search data from frontend
    const body = await request.json();

    const { country, city, category, keyword } = body;

    // 3. Validate required fields
    if (!country || !city || !category) {
      return NextResponse.json(
        {
          success: false,
          error: "Country, city and category are required.",
        },
        { status: 400 }
      );
    }

    // 4. Create Google Places search query
    const textQuery = [
      category,
      city,
      country,
      keyword?.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    // 5. Call Google Places API
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress",
        },
        body: JSON.stringify({
          textQuery,
          pageSize: 20,
          languageCode: "en",
        }),
        cache: "no-store",
      }
    );

    // 6. Handle Google API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      console.error("Google Places Search Error:", errorData);

      return NextResponse.json(
        {
          success: false,
          error:
            errorData?.error?.message ||
            "Failed to search businesses using Google Places API.",
        },
        { status: response.status }
      );
    }

    // 7. Get search results
    const data = await response.json();

    const places = data.places || [];

    // 8. Format business results
    const businesses = places.map(
      (place: {
        id?: string;
        displayName?: {
          text?: string;
        };
        formattedAddress?: string;
      }) => ({
        placeId: place.id || "",
        name: place.displayName?.text || "Unknown Business",
        address: place.formattedAddress || "",
      })
    );

    // 9. Return results
    return NextResponse.json({
      success: true,
      total: businesses.length,
      businesses,
    });
  } catch (error) {
    console.error("Business Search Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while searching businesses.",
      },
      { status: 500 }
    );
  }
}