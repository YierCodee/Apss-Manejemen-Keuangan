import { NextResponse } from "next/server";
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
  });

  if (!transaction) return null;

  let category = null;
  if (transaction.category) {
    const cat = await prisma.category.findUnique({ where: { id: transaction.category } });
    if (cat) {
      category = { id: cat.id, name: cat.name, icon: cat.emoji, color: cat.color, bgColor: cat.bgColor };
    }
  }

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
    rabItemId: null,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    category,
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

    const { name, type, amount, quantity, pricePerUnit, accountName, categoryId, paymentMethod, date, notes } = body;

    const newAmount = amount ? parseFloat(String(amount)) : Number(existing.totalAmount);
    // Normalize type to lowercase to match Prisma TransactionType enum
    const newType = type ? String(type).toLowerCase() : existing.type;
    const newQty = quantity ? parseInt(String(quantity), 10) : existing.quantity;
    const newPrice = pricePerUnit ? parseFloat(String(pricePerUnit)) : Number(existing.price);

    // ============================================
    // RAB SYNC: Reverse old realization before update
    // ============================================
    if (existing.type === "pengeluaran" && existing.category) {
      try {
        await reverseSyncFromRab(
          existing.category,
          Number(existing.totalAmount),
          session.userId,
        );
      } catch (syncError) {
        console.error("RAB reverse sync error (pre-update, non-fatal):", syncError);
      }
    }

    await prisma.transaction.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type: newType as "pemasukan" | "pengeluaran" }),
        ...(amount !== undefined && { totalAmount: newAmount, price: newPrice }),
        ...(quantity !== undefined && { quantity: newQty }),
        ...(accountName !== undefined && { accountName: accountName || null }),
        ...(categoryId !== undefined && { category: categoryId || null }),
        ...(paymentMethod !== undefined && { paymentMethod }),
        ...(date !== undefined && { date: new Date(date), time: new Date(date) }),
      },
    });

    // ============================================
    // RAB SYNC: Re-sync with updated values
    // ============================================
    if (newType === "pengeluaran") {
      try {
        const effectiveCategoryId = categoryId !== undefined ? categoryId : existing.category;
        if (effectiveCategoryId) {
          await syncTransactionToRab(
            id,
            effectiveCategoryId,
            newAmount,
            session.userId,
          );
        }
      } catch (syncError) {
        console.error("RAB sync error (post-update, non-fatal):", syncError);
      }
    }

    const result = await getTransactionWithRelations(id, session.userId);
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
    if (existing.type === "pengeluaran" && existing.category) {
      try {
        await reverseSyncFromRab(
          existing.category,
          Number(existing.totalAmount),
          session.userId,
        );
      } catch (syncError) {
        console.error("RAB reverse sync error (non-fatal):", syncError);
      }
    }

    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/keuangan/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
