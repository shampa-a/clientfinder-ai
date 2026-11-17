import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // 1. Check user authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign in to search businesses.",
        },
        { status: 401 }
      );
    }

    // 2. Check Google Maps API key
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

    // 3. Get search data
    const body = await request.json();

    const { country, city, category, keyword } = body;

    // 4. Validate required fields
    if (!country || !city?.trim() || !category) {
      return NextResponse.json(
        {
          success: false,
          error: "Country, city and category are required.",
        },
        { status: 400 }
      );
    }

    // 5. Create Google Places search query
    const cleanCity = city.trim();
    const cleanKeyword = keyword?.trim() || "";

    const textQuery = [
      category,
      cleanCity,
      country,
      cleanKeyword,
    ]
      .filter(Boolean)
      .join(" ");

    // 6. Call Google Places API
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

    // 7. Handle Google API errors
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

    // 8. Get search results
    const data = await response.json();

    const places = data.places || [];

    // 9. Format business results
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

    // 10. Save search history in MongoDB
    const db = await getDb();

    const historyResult = await db
      .collection("search_history")
      .insertOne({
        userId: session.user.id,
        country,
        city: cleanCity,
        category,
        keyword: cleanKeyword,
        resultCount: businesses.length,
        createdAt: new Date(),
      });

    // 11. Return results
    return NextResponse.json({
      success: true,
      total: businesses.length,
      businesses,
      historyId: historyResult.insertedId.toString(),
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