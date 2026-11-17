import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

type LeadStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Converted";

type LeadInput = {
  placeId: string;
  name: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number | null;
};

const allowedStatuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Interested",
  "Converted",
];

// GET: Fetch user's saved leads
export async function GET(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Connect to database
    const db = await getDb();

    // 3. Read query parameters
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // 4. Build query
    const query: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    if (status && allowedStatuses.includes(status as LeadStatus)) {
      query.status = status;
    }

    // 5. Fetch leads
    const leads = await db
      .collection("leads")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // 6. Return leads
    return NextResponse.json({
      success: true,
      total: leads.length,
      leads: leads.map((lead) => ({
        ...lead,
        id: lead._id.toString(),
        _id: undefined,
      })),
    });
  } catch (error) {
    console.error("GET Leads Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch leads." },
      { status: 500 }
    );
  }
}

// POST: Save a new lead
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Read request body
    const body = (await request.json()) as LeadInput;

    const {
      placeId,
      name,
      category = "",
      address = "",
      phone = "",
      website = "",
      rating = null,
    } = body;

    // 3. Validate required fields
    if (
      typeof placeId !== "string" ||
      !placeId.trim() ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Place ID and business name are required.",
        },
        { status: 400 }
      );
    }

    // 4. Connect to database
    const db = await getDb();

    const now = new Date();

    // 5. Prepare lead document
    const lead = {
      userId: session.user.id,
      placeId: placeId.trim(),
      name: name.trim(),
      category,
      address,
      phone,
      website,
      rating:
        typeof rating === "number" && Number.isFinite(rating)
          ? rating
          : null,
      status: "New" as LeadStatus,
      createdAt: now,
      updatedAt: now,
    };

    // 6. Prevent duplicate leads
    const result = await db.collection("leads").updateOne(
      {
        userId: session.user.id,
        placeId: lead.placeId,
      },
      {
        $setOnInsert: lead,
      },
      {
        upsert: true,
      }
    );

    // 7. Find saved lead
    const savedLead = await db.collection("leads").findOne({
      userId: session.user.id,
      placeId: lead.placeId,
    });

    return NextResponse.json(
      {
        success: true,
        message: result.upsertedCount
          ? "Lead saved successfully."
          : "This lead is already saved.",
        alreadySaved: result.upsertedCount === 0,
        lead: savedLead
          ? {
              ...savedLead,
              id: savedLead._id.toString(),
              _id: undefined,
            }
          : null,
      },
      { status: result.upsertedCount ? 201 : 200 }
    );
  } catch (error) {
    console.error("POST Leads Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to save lead." },
      { status: 500 }
    );
  }
}