import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { LeadStatus } from "@/types/business";

const allowedStatuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Interested",
  "Converted",
];

const optionalFields = [
  "contactName",
  "email",
  "phone",
  "website",
  "country",
  "city",
  "category",
  "notes",
] as const;

// GET: Fetch user's leads
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = await getDb();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "";

    const query: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { contactName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (status && allowedStatuses.includes(status as LeadStatus)) {
      query.status = status;
    }

    const leads = await db
      .collection("leads")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

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

// POST: Create a manual lead
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    if (
      typeof data.businessName !== "string" ||
      !data.businessName.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Business name is required." },
        { status: 400 }
      );
    }

    const businessName = data.businessName.trim();

    if (businessName.length > 150) {
      return NextResponse.json(
        { success: false, error: "Business name is too long." },
        { status: 400 }
      );
    }

    const leadFields: Record<string, string> = {};

    for (const field of optionalFields) {
      const value = data[field];

      if (value !== undefined && value !== null) {
        if (typeof value !== "string") {
          return NextResponse.json(
            { success: false, error: `Invalid ${field}.` },
            { status: 400 }
          );
        }

        if (value.length > 2000) {
          return NextResponse.json(
            { success: false, error: `${field} is too long.` },
            { status: 400 }
          );
        }

        leadFields[field] = value.trim();
      }
    }

    const email = leadFields.email;

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const website = leadFields.website;

    if (website) {
      try {
        const url = new URL(
          /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(website)
            ? website
            : `https://${website}`
        );

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid website URL." },
          { status: 400 }
        );
      }
    }

    const status = data.status ?? "New";

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status as LeadStatus)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid lead status." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const lead = {
      userId: session.user.id,
      businessName,
      ...leadFields,
      status: status as LeadStatus,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("leads").insertOne(lead);

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully.",
        lead: {
          ...lead,
          id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Leads Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create lead." },
      { status: 500 }
    );
  }
}