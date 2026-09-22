import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { assertCan, AccessError } from "@/lib/permissions";

export async function GET() {
  try {
    const session = await getSession();
    assertCan(session, "keuangan", "read");

    return NextResponse.json({ message: "Arus Kas API" });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("GET /api/business-kelompok/arus-kas error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getSession();
    assertCan(session, "keuangan", "create");

    // TODO: implement create arus kas logic
    return NextResponse.json({ message: "Arus kas created" }, { status: 201 });
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/business-kelompok/arus-kas error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
