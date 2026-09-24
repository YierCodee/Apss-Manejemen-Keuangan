import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Current month range
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Previous month range
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthStart = new Date(prevMonthYear, prevMonth, 1);
    const prevMonthEnd = new Date(prevMonthYear, prevMonth + 1, 0, 23, 59, 59, 999);

    const where = { userId: session.userId };

    // Fetch current month transactions
    const currentTransactions = await prisma.transaction.findMany({
      where: {
        ...where,
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      select: { type: true, totalAmount: true },
    });

    // Fetch previous month transactions
    const prevTransactions = await prisma.transaction.findMany({
      where: {
        ...where,
        date: { gte: prevMonthStart, lte: prevMonthEnd },
      },
      select: { type: true, totalAmount: true },
    });

    // Fetch all transactions for total saldo
    const allTransactions = await prisma.transaction.findMany({
      where,
      select: { type: true, totalAmount: true },
    });

    // Calculate current month totals
    const currentPemasukan = currentTransactions
      .filter((t) => t.type === "pemasukan")
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const currentPengeluaran = currentTransactions
      .filter((t) => t.type === "pengeluaran")
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const currentNet = currentPemasukan - currentPengeluaran;

    // Calculate previous month totals
    const prevPemasukan = prevTransactions
      .filter((t) => t.type === "pemasukan")
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const prevPengeluaran = prevTransactions
      .filter((t) => t.type === "pengeluaran")
      .reduce((sum, t) => sum + Number(t.totalAmount), 0);
    const prevNet = prevPemasukan - prevPengeluaran;

    // Calculate total saldo (all-time)
    const totalSaldo = allTransactions.reduce((sum, t) => {
      if (t.type === "pemasukan") return sum + Number(t.totalAmount);
      if (t.type === "pengeluaran") return sum - Number(t.totalAmount);
      return sum;
    }, 0);

    // Percentage change: net flow comparison
    const percentageChange =
      prevNet !== 0
        ? Math.round(((currentNet - prevNet) / Math.abs(prevNet)) * 1000) / 10
        : null;

    return NextResponse.json({
      totalSaldo,
      currentMonth: {
        pemasukan: currentPemasukan,
        pengeluaran: currentPengeluaran,
        net: currentNet,
      },
      previousMonth: {
        pemasukan: prevPemasukan,
        pengeluaran: prevPengeluaran,
        net: prevNet,
      },
      percentageChange,
    });
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
