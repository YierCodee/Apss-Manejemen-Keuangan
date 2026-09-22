import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { assertAdmin, AccessError, type Role } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

const VALID_ROLES: Role[] = ["super_admin", "bendahara", "operasional", "pemasaran"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    assertAdmin(session);

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("GET /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    assertAdmin(session);

    const { id } = await params;
    const body = await request.json();
    const { role, isActive } = body;

    // Validate role if provided
    if (role !== undefined && !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Role tidak valid" },
        { status: 400 },
      );
    }

    // Prevent deactivating yourself
    if (isActive === false && id === session.userId) {
      return NextResponse.json(
        { error: "Tidak dapat menonaktifkan akun sendiri" },
        { status: 400 },
      );
    }

    // Prevent removing own super_admin role
    if (role !== undefined && role !== "super_admin" && id === session.userId) {
      return NextResponse.json(
        { error: "Tidak dapat mengubah role sendiri dari super_admin" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log audit
    await logAudit({
      actorId: session.userId,
      action: "update",
      tableName: "users",
      recordId: user.id,
      newData: {
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof AccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
