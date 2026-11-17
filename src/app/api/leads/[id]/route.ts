import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses = [
  "New",
  "Contacted",
  "Interested",
  "Converted",
] as const;

type LeadStatus = (typeof allowedStatuses)[number];

// GET: Get a single lead
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // 1. Check user authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get lead ID from URL
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid lead ID" },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB
    const db = await getDb();

    // 4. Find lead belonging to logged-in user
    const lead = await db.collection("leads").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("GET Lead Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

// PATCH: Update lead status
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // 1. Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get lead ID
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid lead ID" },
        { status: 400 }
      );
    }

    // 3. Get new status from request body
    const body = await request.json();

    const status = body.status as LeadStatus;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid lead status" },
        { status: 400 }
      );
    }

    // 4. Connect to MongoDB
    const db = await getDb();

    // 5. Update lead
    const result = await db.collection("leads").updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.id,
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead status updated successfully",
      status,
    });
  } catch (error) {
    console.error("PATCH Lead Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a lead
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // 1. Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get lead ID
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid lead ID" },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB
    const db = await getDb();

    // 4. Delete lead belonging to logged-in user
    const result = await db.collection("leads").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Lead Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete lead" },
      { status: 500 }
    );
  }
}