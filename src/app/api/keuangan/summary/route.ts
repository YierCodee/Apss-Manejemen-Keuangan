import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const getCachedSummary = unstable_cache(
  async (userId: string, _yearMonth: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthStart = new Date(prevMonthYear, prevMonth, 1);
    const prevMonthEnd = new Date(prevMonthYear, prevMonth + 1, 0, 23, 59, 59, 999);

    const [currentMonthData, prevMonthData, allTimeData] = await Promise.all([
      prisma.transaction.groupBy({
        by: ["type"],
        where: { userId, date: { gte: currentMonthStart, lte: currentMonthEnd } },
        _sum: { totalAmount: true },
      }),
      prisma.transaction.groupBy({
        by: ["type"],
        where: { userId, date: { gte: prevMonthStart, lte: prevMonthEnd } },
        _sum: { totalAmount: true },
      }),
      prisma.transaction.groupBy({
        by: ["type"],
        where: { userId },
        _sum: { totalAmount: true },
      }),
    ]);

    function getSum(data: { type: string; _sum: { totalAmount: unknown } }[], type: string): number {
      const row = data.find((r) => r.type === type);
      return row ? Number(row._sum.totalAmount) : 0;
    }

    const currentPemasukan = getSum(currentMonthData, "pemasukan");
    const currentPengeluaran = getSum(currentMonthData, "pengeluaran");
    const currentNet = currentPemasukan - currentPengeluaran;

    const prevPemasukan = getSum(prevMonthData, "pemasukan");
    const prevPengeluaran = getSum(prevMonthData, "pengeluaran");
    const prevNet = prevPemasukan - prevPengeluaran;

    const totalSaldo = getSum(allTimeData, "pemasukan") - getSum(allTimeData, "pengeluaran");

    const percentageChange =
      prevNet !== 0
        ? Math.round(((currentNet - prevNet) / Math.abs(prevNet)) * 1000) / 10
        : null;

    return {
      totalSaldo,
      currentMonth: { pemasukan: currentPemasukan, pengeluaran: currentPengeluaran, net: currentNet },
      previousMonth: { pemasukan: prevPemasukan, pengeluaran: prevPengeluaran, net: prevNet },
      percentageChange,
    };
  },
  ["summary"],
  { revalidate: 60, tags: ["summary"] }
);

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // yearMonth ensures cache rotates monthly
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const data = await getCachedSummary(session.userId, yearMonth);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/keuangan/summary error:", error);
    return NextResponse.json(
      {
        totalSaldo: 0,
        currentMonth: { pemasukan: 0, pengeluaran: 0, net: 0 },
        previousMonth: { pemasukan: 0, pengeluaran: 0, net: 0 },
        percentageChange: null,
      },
      { status: 500 },
    );
  }
}
