import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const getCachedCategories = unstable_cache(
  async (type?: string | null) => {
    const where: { isActive: boolean; type?: string } = {
      isActive: true,
    };
    if (type) where.type = type;

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.emoji,
      color: c.color,
      bgColor: c.bgColor,
      type: c.type,
    }));
  },
  ["categories"],
  { revalidate: 300, tags: ["categories"] }
);

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const mapped = await getCachedCategories(type);
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/keuangan/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
