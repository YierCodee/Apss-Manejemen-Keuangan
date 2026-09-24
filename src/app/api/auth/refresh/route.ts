import { NextResponse } from "next/server";
import { refreshSession, getSession } from "@/lib/auth";

/**
 * POST /api/auth/refresh
 * Refresh the current session by updating lastActivity timestamp.
 * Called periodically by the client to keep the session alive.
 */
export async function POST() {
  try {
    // Check if session exists first
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Tidak ada sesi aktif" },
        { status: 401 },
      );
    }

    // Refresh the session (update lastActivity)
    const success = await refreshSession();
    if (!success) {
      return NextResponse.json(
        { error: "Gagal memperbarui sesi" },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/refresh error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}
