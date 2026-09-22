import { NextResponse } from "next/server";
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
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });

    // Fetch category info untuk setiap transaksi
    const categoryIds = [...new Set(transactions.map((t) => t.category).filter(Boolean))] as string[];
    const categories = categoryIds.length
      ? await prisma.category.findMany({ where: { id: { in: categoryIds } } })
      : [];
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const serialized = transactions.map((t) => {
      const cat = t.category ? categoryMap.get(t.category) : null;
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
        rabItemId: null,
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

    const { name, type, amount, quantity, pricePerUnit, accountName, categoryId, paymentMethod, date, notes } = body;

    if (!name || !type || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, amount, paymentMethod" },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(String(amount));
    const parsedQty = quantity ? parseInt(String(quantity), 10) : 1;
    const parsedPrice = pricePerUnit ? parseFloat(String(pricePerUnit)) : parsedAmount;

    // Normalize type to lowercase to match Prisma TransactionType enum
    const normalizedType = String(type).toLowerCase();

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.userId,
        name,
        type: normalizedType as "pemasukan" | "pengeluaran",
        quantity: parsedQty,
        price: parsedPrice,
        totalAmount: parsedAmount,
        paymentMethod,
        category: categoryId || null,
        accountName: accountName || null,
        date: date ? new Date(date) : new Date(),
        time: date ? new Date(date) : new Date(),
      },
    });

    // Fetch category info
    let category = null;
    if (transaction.category) {
      const cat = await prisma.category.findUnique({ where: { id: transaction.category } });
      if (cat) {
        category = { id: cat.id, name: cat.name, icon: cat.emoji, color: cat.color, bgColor: cat.bgColor };
      }
    }

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
      rabItemId: null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      category,
    };

    // ============================================
    // RAB SYNC: Auto-sync pengeluaran → RAB realization
    // ============================================
    let rabSync = null;
    if (normalizedType === "pengeluaran" && transaction.category) {
      try {
        rabSync = await syncTransactionToRab(
          transaction.id,
          transaction.category,
          parsedAmount,
          session.userId,
        );
      } catch (syncError) {
        // Log sync error but don't fail the transaction
        console.error("RAB sync error (non-fatal):", syncError);
      }
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
