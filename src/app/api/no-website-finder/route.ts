import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const USER_AGENT = "ClientFinderAI/1.0 (business discovery application)";

const CATEGORY_TAGS: Record<string, string[]> = {
  restaurant: [
    '["amenity"="restaurant"]',
    '["amenity"="fast_food"]',
  ],

  hotel: [
    '["tourism"="hotel"]',
    '["tourism"="motel"]',
    '["tourism"="guest_house"]',
  ],

  cafe: [
    '["amenity"="cafe"]',
  ],

  bakery: [
    '["shop"="bakery"]',
  ],

  all: [
    '["amenity"="restaurant"]',
    '["amenity"="fast_food"]',
    '["amenity"="cafe"]',
    '["tourism"="hotel"]',
    '["tourism"="motel"]',
    '["tourism"="guest_house"]',
    '["shop"="bakery"]',
  ],
};

type OSMElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to search businesses.",
        },
        { status: 401 }
      );
    }

    // 2. Read request body
    const body = await request.json();

    const city = String(body.city || "").trim();
    const country = String(body.country || "").trim();
    const category = String(body.category || "all").toLowerCase();

    if (!city || !country) {
      return NextResponse.json(
        {
          success: false,
          message: "City and country are required.",
        },
        { status: 400 }
      );
    }

    if (city.length > 100 || country.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "City or country name is too long.",
        },
        { status: 400 }
      );
    }

    if (!CATEGORY_TAGS[category]) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid business category.",
        },
        { status: 400 }
      );
    }

    // 3. Find city coordinates using Nominatim
    const locationQuery = new URLSearchParams({
      city,
      country,
      format: "jsonv2",
      limit: "1",
    });

    const locationResponse = await fetch(
      `${NOMINATIM_URL}?${locationQuery.toString()}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      }
    );

    if (!locationResponse.ok) {
      throw new Error("Unable to find the requested city.");
    }

    const locations = await locationResponse.json();

    if (!Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "City not found. Please check the city and country.",
        },
        { status: 404 }
      );
    }

    const latitude = Number(locations[0].lat);
    const longitude = Number(locations[0].lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error("Invalid location coordinates.");
    }

    // 4. Build Overpass query
    const tags = CATEGORY_TAGS[category];

    const searchRadius = 5000;

    const queries = tags
      .map(
        (tag) =>
          `nwr${tag}[!"website"][!"contact:website"][!"url"](around:${searchRadius},${latitude},${longitude});`
      )
      .join("\n");

    const overpassQuery = `
      [out:json][timeout:25];

      (
        ${queries}
      );

      out center tags 80;
    `;

    // 5. Search businesses
    const overpassResponse = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
      },
      body: new URLSearchParams({
        data: overpassQuery,
      }).toString(),
      signal: AbortSignal.timeout(30000),
      cache: "no-store",
    });

    if (!overpassResponse.ok) {
      if (overpassResponse.status === 429) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The OpenStreetMap search service is busy. Please try again later.",
          },
          { status: 503 }
        );
      }

      throw new Error("Business search service is temporarily unavailable.");
    }

    const osmData = await overpassResponse.json();

    const elements: OSMElement[] = Array.isArray(osmData.elements)
      ? osmData.elements
      : [];

    // 6. Format business results
    const businesses = elements
      .map((element) => {
        const tags = element.tags || {};

        const lat = element.lat ?? element.center?.lat;
        const lon = element.lon ?? element.center?.lon;

        const businessName = tags.name || tags["name:en"];

        if (!businessName || lat === undefined || lon === undefined) {
          return null;
        }

        const businessCategory =
          tags.amenity ||
          tags.tourism ||
          tags.shop ||
          "business";

        return {
          osmId: element.id,
          osmType: element.type,

          businessName,

          category: businessCategory,

          address: [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:suburb"],
            tags["addr:city"] || city,
          ]
            .filter(Boolean)
            .join(", "),

          phone:
            tags.phone ||
            tags["contact:phone"] ||
            "",

          email:
            tags.email ||
            tags["contact:email"] ||
            "",

          website: "",

          hasWebsite: false,

          latitude: lat,
          longitude: lon,

          city,
          country,

          source: "OpenStreetMap",
        };
      })
      .filter(
        (business): business is NonNullable<typeof business> =>
          business !== null
      );

    // 7. Remove duplicate businesses
    const uniqueBusinesses = Array.from(
      new Map(
        businesses.map((business) => [
          `${business.osmType}-${business.osmId}`,
          business,
        ])
      ).values()
    );

    // 8. Return results
    return NextResponse.json({
      success: true,
      message: "Business search completed successfully.",

      total: uniqueBusinesses.length,

      location: {
        city,
        country,
        latitude,
        longitude,
        radius: searchRadius,
      },

      businesses: uniqueBusinesses,

      attribution: "© OpenStreetMap contributors",
    });
  } catch (error) {
    console.error("No Website Finder Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}