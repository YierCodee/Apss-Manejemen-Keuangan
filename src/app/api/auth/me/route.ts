import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile from session + DB.
 * Used by client components to get session data.
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Belum login" },
        { status: 401 },
      );
    }

    // Fetch fresh user data from DB (role/status may have changed)
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Akun tidak ditemukan" },
        { status: 404 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Akun tidak aktif" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}
