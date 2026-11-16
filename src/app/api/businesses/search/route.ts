import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      country,
      city,
      category,
      keyword,
    } = body;

    if (!country || !city || !category) {
      return NextResponse.json(
        { error: "Country, city and category are required." },
        { status: 400 }
      );
    }

    const searchQuery = [
      keyword,
      category,
      city,
      country,
    ]
      .filter(Boolean)
      .join(" ");

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": [
            "places.id",
            "places.displayName",
            "places.formattedAddress",
            "places.nationalPhoneNumber",
            "places.websiteUri",
            "places.rating",
            "places.userRatingCount",
            "places.googleMapsUri",
          ].join(","),
        },

        body: JSON.stringify({
          textQuery: searchQuery,
          pageSize: 20,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places API error:", data);

      return NextResponse.json(
        {
          error:
            data.error?.message ||
            "Google Places search failed.",
        },
        { status: response.status }
      );
    }

    const businesses = (data.places || []).map(
      (place: {
        id?: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        nationalPhoneNumber?: string;
        websiteUri?: string;
        rating?: number;
        userRatingCount?: number;
        googleMapsUri?: string;
      }) => ({
        placeId: place.id || "",
        name: place.displayName?.text || "Unknown Business",
        address: place.formattedAddress || "Not available",
        phone: place.nationalPhoneNumber || "Not available",
        website: place.websiteUri || "",
        rating: place.rating || null,
        totalReviews: place.userRatingCount || 0,
        googleMapsUrl: place.googleMapsUri || "",
      })
    );

    return NextResponse.json({
      success: true,
      total: businesses.length,
      businesses,
    });

  } catch (error) {
    console.error("Business search error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}