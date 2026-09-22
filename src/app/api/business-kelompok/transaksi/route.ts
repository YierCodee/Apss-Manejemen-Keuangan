import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { assertCan, AccessError } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await getSession();
    assertCan(session, "penjualan", "read");

    return NextResponse.json({ message: "Transaksi API" });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("GET /api/business-kelompok/transaksi error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getSession();
    assertCan(session, "penjualan", "create");

    // TODO: implement create transaksi penjualan logic
    return NextResponse.json({ message: "Transaksi created" }, { status: 201 });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/business-kelompok/transaksi error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
