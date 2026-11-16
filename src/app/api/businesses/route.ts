import { NextResponse } from "next/server";

type SearchRequest = {
  country?: string;
  city?: string;
  category?: string;
  keyword?: string;
};

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
};

type GoogleSearchResponse = {
  places?: GooglePlace[];
};

const GOOGLE_PLACES_URL =
  "https://places.googleapis.com/v1/places:searchText";

const COUNTRY_CODES: Record<string, string> = {
  Bangladesh: "BD",
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
};

export async function POST(request: Request) {
  try {
    // 1. Read search information from frontend
    let body: SearchRequest;

    try {
      body = (await request.json()) as SearchRequest;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request.",
        },
        { status: 400 }
      );
    }

    const country = body.country?.trim() || "";
    const city = body.city?.trim() || "";
    const category = body.category?.trim() || "";
    const keyword = body.keyword?.trim() || "";

    // 2. Validate required fields
    if (!country || !city || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Country, city and category are required.",
        },
        { status: 400 }
      );
    }

    if (
      country.length > 100 ||
      city.length > 100 ||
      category.length > 100 ||
      keyword.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Search fields must not exceed 100 characters.",
        },
        { status: 400 }
      );
    }

    // 3. Get API key from server environment
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_PLACES_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Business search service is not configured.",
        },
        { status: 500 }
      );
    }

    // 4. Build Google search query
    const searchTerms = [
      category,
      keyword,
      city,
      country,
    ].filter(Boolean);

    const textQuery = searchTerms.join(" ");

    // 5. Prepare Google Places request
    const googleResponse = await fetch(GOOGLE_PLACES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery,
        pageSize: 10,
        regionCode: COUNTRY_CODES[country],
      }),
      cache: "no-store",
    });

    // 6. Handle Google API errors
    if (!googleResponse.ok) {
      const googleError = await googleResponse.json().catch(() => null);

      console.error("Google Places Search Error:", {
        status: googleResponse.status,
        message: googleError?.error?.message,
      });

      if (googleResponse.status === 429) {
        return NextResponse.json(
          {
            success: false,
            message: "Too many searches. Please try again later.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Google Places search failed.",
        },
        { status: 502 }
      );
    }

    // 7. Read Google response
    const googleData =
      (await googleResponse.json()) as GoogleSearchResponse;

    const places = googleData.places || [];

    // 8. Convert Google results into our business format
    const seenPlaceIds = new Set<string>();

    const businesses = places
      .filter((place) => {
        if (!place.id || seenPlaceIds.has(place.id)) {
          return false;
        }

        seenPlaceIds.add(place.id);
        return true;
      })
      .map((place) => ({
        placeId: place.id!,
        name: place.displayName?.text || "Name not available",
        address: place.formattedAddress || "",
      }));

    // 9. Return results to frontend
    return NextResponse.json(
      {
        success: true,
        total: businesses.length,
        businesses,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Business search route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
