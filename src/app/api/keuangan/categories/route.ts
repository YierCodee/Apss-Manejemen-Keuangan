import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: { isActive: boolean; type?: string } = { isActive: true };
    if (type) where.type = type;

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
    });

    // Map ke format frontend: emoji → icon, bg_color → bgColor
    const mapped = categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.emoji,
      color: c.color,
      bgColor: c.bgColor,
      type: c.type,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/keuangan/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
