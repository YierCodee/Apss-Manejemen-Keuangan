import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { reconcileAllRabRealization } from "@/features/rab/services/rabSyncService";

// ============================================
// POST /api/rab/sync
// Manual reconciliation: recalculate ALL RAB realization
// values from keuangan transactions.
//
// Use case: fix drift, initial data migration, or
// after bulk-importing transactions.
// ============================================

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await reconcileAllRabRealization(session.userId);

    return NextResponse.json({
      success: true,
      message: `Reconciliasi selesai. ${result.reconciledItems} item RAB di ${result.reconciledProjects} proyek diperbarui. Total realisasi: Rp ${result.totalAmount.toLocaleString("id-ID")}`,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/rab/sync error:", error);
    return NextResponse.json(
      { error: "Gagal melakukan reconciliasi RAB" },
      { status: 500 },
    );
  }
}
