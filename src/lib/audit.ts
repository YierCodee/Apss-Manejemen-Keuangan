// src/lib/audit.ts
//
// Fungsi untuk mencatat audit log setiap perubahan data.
// Dipanggil di SETIAP POST/PUT/DELETE handler setelah operasi berhasil.

import { prisma } from "./db";
import type { AuditAction, Prisma } from "@/generated/prisma/client";

type LogAuditInput = {
  actorId: string;
  action: AuditAction;
  tableName: string;
  recordId: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
};

/**
 * Catat audit log untuk setiap perubahan data.
 * Panggil setelah operasi CRUD berhasil.
 *
 * Contoh:
 *   await logAudit({
 *     actorId: session.userId,
 *     action: "create",
 *     tableName: "products",
 *     recordId: product.id,
 *     newData: { name: product.name, price: product.price },
 *   });
 */
export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        tableName: input.tableName,
        recordId: input.recordId,
        oldData: input.oldData as Prisma.InputJsonValue | undefined,
        newData: input.newData as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    // Audit log failure should NOT break the main operation.
    // Log to console for debugging but don't throw.
    console.error("Failed to write audit log:", error);
  }
}
