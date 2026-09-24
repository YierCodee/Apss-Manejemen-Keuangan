import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { syncTransactionToRab } from "@/features/rab/services/rabSyncService";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId: session.userId };
    if (type) where.type = type;
    if (categoryId) where.category = categoryId;
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        categoryRef: true,
        rabItem: { select: { id: true, name: true } },
      },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });

    const serialized = transactions.map((t) => {
      const cat = t.categoryRef;
      return {
        id: t.id,
        userId: t.userId,
        name: t.name,
        type: t.type,
        amount: Number(t.totalAmount),
        quantity: t.quantity,
        pricePerUnit: Number(t.price),
        paymentMethod: t.paymentMethod,
        date: t.date,
        notes: null,
        receiptUrl: null,
        categoryId: t.category,
        accountName: t.accountName || null,
        rabItemId: t.rabItemId || null,
        rabItemName: t.rabItem?.name ?? null,
        rabSyncMode: t.rabSyncMode,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        category: cat
          ? { id: cat.id, name: cat.name, icon: cat.emoji, color: cat.color, bgColor: cat.bgColor }
          : null,
      };
    });

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/keuangan error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { name, type, amount, quantity, pricePerUnit, accountName, categoryId, rabItemId, rabSyncMode, paymentMethod, date, notes } = body;

    if (!name || !type || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, amount, paymentMethod" },
        { status: 400 }
      );
    }

    const round2 = (n: number) => Math.round(n * 100) / 100;
    const parsedAmount = parseFloat(String(amount));
    const parsedQty =
      quantity !== undefined && quantity !== null && String(quantity).trim() !== ""
        ? parseInt(String(quantity), 10)
        : 1;
    const hasUnitPrice =
      pricePerUnit !== undefined && pricePerUnit !== null && String(pricePerUnit).trim() !== "";

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }
    if (!Number.isInteger(parsedQty) || parsedQty < 1) {
      return NextResponse.json({ error: "quantity must be a positive integer" }, { status: 400 });
    }

    // price = harga satuan; totalAmount WAJIB = quantity * price
    // (CHECK constraint "total_amount_check" di DB)
    const unitPrice = hasUnitPrice
      ? parseFloat(String(pricePerUnit))
      : parsedQty === 1
        ? parsedAmount
        : parsedAmount / parsedQty;
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return NextResponse.json({ error: "pricePerUnit must be a positive number" }, { status: 400 });
    }
    const parsedPrice = round2(unitPrice);
    const totalAmount = round2(parsedQty * parsedPrice);

    // Normalize type to lowercase to match Prisma TransactionType enum
    const normalizedType = String(type).toLowerCase();

    // Normalize rabSyncMode: default to 'none' if not provided or invalid
    const validSyncModes = ["auto", "manual", "none"];
    const normalizedSyncMode = validSyncModes.includes(rabSyncMode) ? rabSyncMode : "none";

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.userId,
        name,
        type: normalizedType as "pemasukan" | "pengeluaran",
        quantity: parsedQty,
        price: parsedPrice,
        totalAmount,
        paymentMethod,
        category: categoryId || null,
        rabItemId: rabItemId || null,
        rabSyncMode: normalizedSyncMode as "auto" | "manual" | "none",
        accountName: accountName || null,
        date: date ? new Date(date) : new Date(),
        time: date ? new Date(date) : new Date(),
      },
      include: {
        categoryRef: true,
        rabItem: { select: { id: true, name: true } },
      },
    });

    const cat = transaction.categoryRef;
    const category = cat
      ? { id: cat.id, name: cat.name, icon: cat.emoji, color: cat.color, bgColor: cat.bgColor }
      : null;

    const serialized = {
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
      category,
    };

    // ============================================
    // RAB SYNC: Controlled by rabSyncMode
    // ============================================
    let rabSync = null;
    if (normalizedType === "pengeluaran" && normalizedSyncMode !== "none") {
      try {
        rabSync = await syncTransactionToRab(
          transaction.id,
          transaction.category,
          Number(transaction.totalAmount),
          session.userId,
          transaction.rabSyncMode,
          transaction.rabItemId,
          transaction.name,
        );
      } catch (syncError) {
        // Log sync error but don't fail the transaction
        console.error("RAB sync error (non-fatal):", syncError);
      }
    }

    // Invalidate cached data after mutation
    revalidateTag("summary", { expire: 0 });
    if (normalizedType === "pengeluaran") {
      revalidateTag("rab-summary", { expire: 0 });
    }

    return NextResponse.json(
      { ...serialized, rabSync },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/keuangan error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
