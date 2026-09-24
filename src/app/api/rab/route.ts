import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createRabItem, getRabItems, getRabSummary } from "@/features/rab/services/rabService";

// ============================================
// GET /api/rab
// Fetch all RAB projects with items, or summary stats
// ============================================
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const summaryOnly = searchParams.get("summary") === "true";
    const categoryId = searchParams.get("categoryId");

    if (summaryOnly) {
      const summary = await getRabSummary(session.userId);
      return NextResponse.json(summary);
    }

    const projects = await getRabItems(session.userId);

    // If categoryId filter is provided, flatten and filter items
    if (categoryId) {
      const filteredItems = projects.flatMap((p) =>
        p.items
          .filter((item) => item.category === categoryId)
          .map((item) => ({ ...item, projectName: p.projectName, projectId: p.id }))
      );
      return NextResponse.json(filteredItems);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/rab error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RAB data" },
      { status: 500 },
    );
  }
}

// ============================================
// POST /api/rab
// Create a new RAB item (and auto-create project if needed)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "posName",
      "priority",
      "quantity",
      "pricePerUnit",
    ];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `Field "${field}" is required` },
          { status: 400 },
        );
      }
    }

    // Category: either categoryId (existing) or customCategory (new) is required
    if (!body.categoryId && !body.customCategory) {
      return NextResponse.json(
        { error: "Field \"category\" is required" },
        { status: 400 },
      );
    }

    // Auto-derive current quarter if not provided
    const now = new Date();
    const quarterNum = Math.ceil((now.getMonth() + 1) / 3);
    const quarter = body.quarter || `Kuartal ${quarterNum} (Q${quarterNum}) ${now.getFullYear()}`;

    const result = await createRabItem(
      {
        posName: body.posName,
        categoryId: body.categoryId,
        customCategory: body.customCategory,
        specs: body.specs,
        priority: body.priority,
        quantity: Number(body.quantity),
        targetProgress: body.targetProgress ? Number(body.targetProgress) : 0,
        quarter: quarter,
        pricePerUnit: Number(body.pricePerUnit),
        notes: body.notes,
      },
      session.userId,
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/rab error:", error);
    return NextResponse.json(
      { error: "Failed to create RAB item" },
      { status: 500 },
    );
  }
}
