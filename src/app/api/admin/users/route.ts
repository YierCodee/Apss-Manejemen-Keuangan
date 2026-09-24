import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertAdmin, AccessError } from "@/lib/permissions";

const getCachedUsers = unstable_cache(
  async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
  ["admin-users"],
  { revalidate: 60, tags: ["admin-users"] }
);

export async function GET() {
  try {
    const session = await getSession();
    assertAdmin(session);

    const users = await getCachedUsers();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
