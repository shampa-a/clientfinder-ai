import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { LeadStatus } from "@/types/business";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Interested",
  "Converted",
];

const editableFields = [
  "businessName",
  "contactName",
  "email",
  "phone",
  "website",
  "country",
  "city",
  "category",
  "notes",
] as const;

// GET: Get single lead
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID." },
        { status: 400 }
      );
    }

    const db = await getDb();

    const lead = await db.collection("leads").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: {
        ...lead,
        id: lead._id.toString(),
        _id: undefined,
      },
    });
  } catch (error) {
    console.error("GET Lead Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch lead." },
      { status: 500 }
    );
  }
}

// PATCH: Update lead
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID." },
        { status: 400 }
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
    const updates: Record<string, string | Date> = {};

    for (const field of editableFields) {
      const value = data[field];

      if (value !== undefined) {
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

        updates[field] = value.trim();
      }
    }

    if (
      typeof updates.businessName === "string" &&
      !updates.businessName
    ) {
      return NextResponse.json(
        { success: false, error: "Business name cannot be empty." },
        { status: 400 }
      );
    }

    if (typeof updates.email === "string" && updates.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        return NextResponse.json(
          { success: false, error: "Invalid email address." },
          { status: 400 }
        );
      }
    }

    if (typeof updates.website === "string" && updates.website) {
      try {
        const url = new URL(
          /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(updates.website)
            ? updates.website
            : `https://${updates.website}`
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

    if (data.status !== undefined) {
      if (
        typeof data.status !== "string" ||
        !allowedStatuses.includes(data.status as LeadStatus)
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid lead status." },
          { status: 400 }
        );
      }

      updates.status = data.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields provided." },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();

    const db = await getDb();

    const result = await db.collection("leads").updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.id,
      },
      {
        $set: updates,
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    const updatedLead = await db.collection("leads").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Lead updated successfully.",
      lead: updatedLead
        ? {
            ...updatedLead,
            id: updatedLead._id.toString(),
            _id: undefined,
          }
        : null,
    });
  } catch (error) {
    console.error("PATCH Lead Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update lead." },
      { status: 500 }
    );
  }
}

// DELETE: Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID." },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db.collection("leads").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE Lead Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete lead." },
      { status: 500 }
    );
  }
}