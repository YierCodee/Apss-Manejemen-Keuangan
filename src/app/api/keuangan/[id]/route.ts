import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  syncTransactionToRab,
  reverseSyncFromRab,
} from "@/features/rab/services/rabSyncService";

type RouteParams = { params: Promise<{ id: string }> };

async function getTransactionWithRelations(id: string, userId: string) {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
    include: {
      categoryRef: true,
      rabItem: { select: { id: true, name: true } },
    },
  });

  if (!transaction) return null;

  const cat = transaction.categoryRef;

  return {
    id: transaction.id,
    userId: transaction.userId,
    name: transaction.name,
    type: transaction.type,
    amount: Number(transaction.totalAmount),
    quantity: transaction.quantity,
    pricePerUnit: Number(transaction.price),
    paymentMethod: transaction.paymentMethod,
    date: transaction.date,
    notes: null,
    receiptUrl: null,
    categoryId: transaction.category,
    accountName: transaction.accountName || null,
    rabItemId: transaction.rabItemId || null,
    rabItemName: transaction.rabItem?.name ?? null,
    rabSyncMode: transaction.rabSyncMode,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    category: cat
      ? { id: cat.id, name: cat.name, icon: cat.emoji, color: cat.color, bgColor: cat.bgColor }
      : null,
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await getTransactionWithRelations(id, session.userId);

    if (!result) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/keuangan/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const { name, type, amount, quantity, pricePerUnit, accountName, categoryId, rabItemId, rabSyncMode, paymentMethod, date, notes } = body;

    const round2 = (n: number) => Math.round(n * 100) / 100;
    // Normalize type to lowercase to match Prisma TransactionType enum
    const newType = type ? String(type).toLowerCase() : existing.type;

    // Normalize rabSyncMode
    const validSyncModes = ["auto", "manual", "none"];
    const newSyncMode = rabSyncMode && validSyncModes.includes(rabSyncMode)
      ? rabSyncMode
      : existing.rabSyncMode;

    // ============================================
    // Money fields: quantity/price/totalAmount harus selalu konsisten
    // dengan CHECK constraint "total_amount_check": total = quantity * price
    // ============================================
    const moneyTouched =
      amount !== undefined || quantity !== undefined || pricePerUnit !== undefined;

    let newQty = existing.quantity;
    let newPrice = Number(existing.price);
    let newTotal = Number(existing.totalAmount);

    if (moneyTouched) {
      if (quantity !== undefined && quantity !== null && String(quantity).trim() !== "") {
        const parsedQty = parseInt(String(quantity), 10);
        if (!Number.isInteger(parsedQty) || parsedQty < 1) {
          return NextResponse.json({ error: "quantity must be a positive integer" }, { status: 400 });
        }
        newQty = parsedQty;
      }

      if (pricePerUnit !== undefined && pricePerUnit !== null && String(pricePerUnit).trim() !== "") {
        const parsedUnit = parseFloat(String(pricePerUnit));
        if (!Number.isFinite(parsedUnit) || parsedUnit <= 0) {
          return NextResponse.json({ error: "pricePerUnit must be a positive number" }, { status: 400 });
        }
        newPrice = parsedUnit;
      } else if (amount !== undefined && amount !== null) {
        const parsedAmount = parseFloat(String(amount));
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
          return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
        }
        newPrice = newQty === 1 ? parsedAmount : parsedAmount / newQty;
      }

      newPrice = round2(newPrice);
      newTotal = round2(newQty * newPrice);
    }

    // ============================================
    // RAB SYNC: Reverse old realization before update
    // ============================================
    if (existing.type === "pengeluaran" && existing.rabSyncMode !== "none") {
      try {
        await reverseSyncFromRab(
          existing.category,
          Number(existing.totalAmount),
          session.userId,
          existing.rabSyncMode,
          existing.rabItemId,
          existing.name,
        );
      } catch (syncError) {
        console.error("RAB reverse sync error (pre-update, non-fatal):", syncError);
      }
    }

    const newName = name !== undefined ? name : existing.name;

    await prisma.transaction.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type: newType as "pemasukan" | "pengeluaran" }),
        ...(moneyTouched && { quantity: newQty, price: newPrice, totalAmount: newTotal }),
        ...(accountName !== undefined && { accountName: accountName || null }),
        ...(categoryId !== undefined && { category: categoryId || null }),
        ...(rabItemId !== undefined && { rabItemId: rabItemId || null }),
        ...(rabSyncMode !== undefined && { rabSyncMode: newSyncMode as "auto" | "manual" | "none" }),
        ...(paymentMethod !== undefined && { paymentMethod }),
        ...(date !== undefined && { date: new Date(date), time: new Date(date) }),
      },
    });

    // ============================================
    // RAB SYNC: Re-sync with updated values
    // ============================================
    if (newType === "pengeluaran" && newSyncMode !== "none") {
      try {
        const effectiveCategoryId = categoryId !== undefined ? categoryId : existing.category;
        const effectiveRabItemId = rabItemId !== undefined ? rabItemId : existing.rabItemId;
        await syncTransactionToRab(
          id,
          effectiveCategoryId,
          newTotal,
          session.userId,
          newSyncMode as "auto" | "manual" | "none",
          effectiveRabItemId,
          newName,
        );
      } catch (syncError) {
        console.error("RAB sync error (post-update, non-fatal):", syncError);
      }
    }

    const result = await getTransactionWithRelations(id, session.userId);

    // Invalidate cached data after mutation
    revalidateTag("summary", { expire: 0 });
    if (newType === "pengeluaran" || existing.type === "pengeluaran") {
      revalidateTag("rab-summary", { expire: 0 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/keuangan/[id] error:", error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // ============================================
    // RAB SYNC: Reverse realization on pengeluaran delete
    // ============================================
    if (existing.type === "pengeluaran" && existing.rabSyncMode !== "none") {
      try {
        await reverseSyncFromRab(
          existing.category,
          Number(existing.totalAmount),
          session.userId,
          existing.rabSyncMode,
          existing.rabItemId,
          existing.name,
        );
      } catch (syncError) {
        console.error("RAB reverse sync error (non-fatal):", syncError);
      }
    }

    await prisma.transaction.delete({ where: { id } });

    // Invalidate cached data after mutation
    revalidateTag("summary", { expire: 0 });
    if (existing.type === "pengeluaran") {
      revalidateTag("rab-summary", { expire: 0 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/keuangan/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
