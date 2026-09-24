import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Priority color mapping
const priorityColors: Record<string, { color: string; bg: string }> = {
  on_track: { color: "#064e3b", bg: "#d1fae5" },
  high: { color: "#dc2626", bg: "#fee2e2" },
  medium: { color: "#d97706", bg: "#fef3c7" },
  low: { color: "#6b7280", bg: "#f3f4f6" },
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all active/draft RAB projects with their items + category in one query
    const projects = await prisma.rabProject.findMany({
      where: {
        createdBy: session.userId,
        deletedAt: null,
      },
      include: {
        items: {
          where: { deletedAt: null },
          include: { categoryRef: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Build category map from the included relations (no separate query needed)
    const categoryMap = new Map(
      projects
        .flatMap((p) => p.items)
        .filter((item) => item.categoryRef)
        .map((item) => [item.category!, item.categoryRef!])
    );

    // Calculate metrics across all projects
    let totalBudget = 0;
    let totalRealization = 0;

    projects.forEach((project) => {
      totalBudget += Number(project.totalBudget);
      totalRealization += Number(project.totalRealization);
    });

    const remaining = totalBudget - totalRealization;
    const efficiency = totalBudget > 0 ? (totalRealization / totalBudget) * 100 : 0;
    const activeProjectCount = projects.filter(
      (p) => p.status === "active" || p.status === "draft"
    ).length;
    const activeItemCount = projects.flatMap((p) => p.items).length;

    // Build chart data - group items by category
    const categoryAggMap = new Map<
      string,
      { name: string; paguAnggaran: number; realisasiTerpakai: number }
    >();

    projects.flatMap((p) => p.items).forEach((item) => {
      const catId = item.category;
      const cat = catId ? categoryMap.get(catId) : null;
      const catName = cat ? cat.name : "Lainnya";

      if (!categoryAggMap.has(catName)) {
        categoryAggMap.set(catName, { name: catName, paguAnggaran: 0, realisasiTerpakai: 0 });
      }
      const agg = categoryAggMap.get(catName)!;
      agg.paguAnggaran += Number(item.totalBudget);
      agg.realisasiTerpakai += Number(item.realization);
    });

    const chartData = Array.from(categoryAggMap.values()).map((cat) => ({
      ...cat,
      efisiensi:
        cat.paguAnggaran > 0
          ? `${Math.round((cat.realisasiTerpakai / cat.paguAnggaran) * 100)}%`
          : "0%",
    }));

    // Build rincian items
    const allItems = projects.flatMap((p) =>
      p.items.map((item) => {
        const cat = item.category ? categoryMap.get(item.category) : null;
        const pri = priorityColors[item.priority] || priorityColors.low;
        const progress =
          Number(item.totalBudget) > 0
            ? Math.round((Number(item.realization) / Number(item.totalBudget)) * 100)
            : 0;

        return {
          id: item.id,
          name: item.name,
          description: cat ? cat.name : "Tanpa Kategori",
          kategori: cat ? cat.name : "Lainnya",
          kategoriColor: cat?.color || "#94a3b8",
          kategoriBg: cat?.bgColor || "#f1f5f9",
          prioritas: item.priority.replace("_", "-"),
          prioritasColor: pri.color,
          prioritasBg: pri.bg,
          progress,
          jumlah: item.quantity,
          realisasi: `Rp ${Number(item.realization).toLocaleString("id-ID")}`,
        };
      })
    );

    return NextResponse.json({
      metrics: {
        totalBudget,
        totalRealization,
        remaining,
        efficiency: Math.round(efficiency * 10) / 10,
        activeProjectCount,
        activeItemCount,
      },
      chartData,
      items: allItems,
    });
  } catch (error) {
    console.error("GET /api/keuangan/laporan error:", error);
    // Return empty data on error so UI doesn't break
    return NextResponse.json({
      metrics: {
        totalBudget: 0,
        totalRealization: 0,
        remaining: 0,
        efficiency: 0,
        activeProjectCount: 0,
        activeItemCount: 0,
      },
      chartData: [],
      items: [],
    });
  }
}
