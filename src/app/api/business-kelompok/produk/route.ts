import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { assertCan, AccessError } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await getSession();
    assertCan(session, "produk_stok", "read");

    return NextResponse.json({ message: "Produk API" });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("GET /api/business-kelompok/produk error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getSession();
    assertCan(session, "produk_stok", "create");

    // TODO: implement create produk logic
    return NextResponse.json({ message: "Produk created" }, { status: 201 });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/business-kelompok/produk error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
