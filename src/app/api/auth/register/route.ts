import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { validateRegisterInput, sanitize } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, accountType } = body;

    // Server-side validation
    const validation = validateRegisterInput({ name, email, password });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 },
      );
    }

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email).toLowerCase();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // Hash password with bcrypt (salt rounds = 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Map account type to role (sesuai enum Role di DB: bendahara, operasional)
    const role = accountType === "business" ? "bendahara" : "operasional";

    // Create user — Prisma uses parameterized queries (prepared statements)
    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: role as "bendahara" | "operasional",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan, silakan coba lagi" },
      { status: 500 },
    );
  }
}
