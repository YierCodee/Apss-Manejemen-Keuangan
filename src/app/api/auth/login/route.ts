import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { validateLoginInput, sanitize } from "@/lib/validation";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Server-side validation
    const validation = validateLoginInput({ email, password });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 },
      );
    }

    const cleanEmail = sanitize(email).toLowerCase();

    // Find user by email — include password for verification
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
      },
    });

    // Generic error message to prevent user enumeration
    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah" },
        { status: 400 },
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json(
        { error: "Akun ini belum memiliki kata sandi. Silakan daftar ulang." },
        { status: 400 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah" },
        { status: 400 },
      );
    }

    // Check account status
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Akun tidak aktif. Hubungi administrator." },
        { status: 403 },
      );
    }

    // Create session cookie
    await createSession(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastActivity: Date.now(),
      },
      rememberMe,
    );

    // Return user (never expose password)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan, silakan coba lagi" },
      { status: 500 },
    );
  }
}
