import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const getCachedAccounts = unstable_cache(
  async (userId: string) => {
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return accounts.map((a) => ({
      id: a.id,
      userId: a.userId,
      name: a.name,
      type: a.type,
      bank: a.bank,
      accountNumber: a.accountNumber,
      balance: Number(a.balance),
      currency: a.currency,
      isActive: a.isActive,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));
  },
  ["accounts"],
  { revalidate: 300, tags: ["accounts"] }
);

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serialized = await getCachedAccounts(session.userId);
    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/keuangan/accounts error:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
