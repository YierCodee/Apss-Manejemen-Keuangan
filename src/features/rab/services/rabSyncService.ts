import { prisma } from "@/lib/db";

// ============================================
// RAB Sync Service
// Sinkronisasi antara modul Keuangan ↔ RAB
//
// Sync di-control oleh rabSyncMode:
//   'none'   — skip, tidak sync (default)
//   'auto'   — match category UUID + nama contains
//   'manual' — link langsung ke RabItem via rabItemId
// ============================================

interface SyncResult {
  matched: boolean;
  rabItemId: string | null;
  rabItemName: string | null;
  amountAdded: number;
  newRealization: number;
  newProjectTotal: number;
}

/**
 * Sync a pengeluaran transaction to RAB realization.
 * Controlled by rabSyncMode:
 *   none   → skip
 *   manual → use rabItemId directly
 *   auto   → match category + name contains
 */
export async function syncTransactionToRab(
  transactionId: string,
  categoryId: string | null,
  amount: number,
  userId: string,
  rabSyncMode: "auto" | "manual" | "none",
  rabItemId?: string | null,
  transactionName?: string,
): Promise<SyncResult> {
  if (amount <= 0 || rabSyncMode === "none") {
    return {
      matched: false,
      rabItemId: null,
      rabItemName: null,
      amountAdded: 0,
      newRealization: 0,
      newProjectTotal: 0,
    };
  }

  // ============================================
  // Manual: link langsung ke RabItem
  // ============================================
  if (rabSyncMode === "manual" && rabItemId) {
    const item = await prisma.rabItem.findFirst({
      where: {
        id: rabItemId,
        deletedAt: null,
        project: { createdBy: userId, deletedAt: null },
      },
      include: { project: true },
    });

    if (item) {
      const newRealization = Number(item.realization) + amount;

      await prisma.rabItem.update({
        where: { id: item.id },
        data: { realization: newRealization },
      });

      const aggregated = await prisma.rabItem.aggregate({
        where: { rabProjectId: item.rabProjectId, deletedAt: null },
        _sum: { realization: true },
      });

      const projectTotal = Number(aggregated._sum.realization || 0);
      await prisma.rabProject.update({
        where: { id: item.rabProjectId },
        data: { totalRealization: projectTotal },
      });

      return {
        matched: true,
        rabItemId: item.id,
        rabItemName: item.name,
        amountAdded: amount,
        newRealization,
        newProjectTotal: projectTotal,
      };
    }
  }

  // ============================================
  // Auto: match category UUID + nama contains
  // ============================================
  if (rabSyncMode === "auto" && categoryId && transactionName) {
    // Cari semua RAB item se-kategori
    const candidateItems = await prisma.rabItem.findMany({
      where: {
        deletedAt: null,
        category: categoryId,
        project: { createdBy: userId, deletedAt: null },
      },
      include: { project: true },
    });

    // Filter: nama RAB item contained dalam nama transaksi (case-insensitive)
    const normalizedName = transactionName.toLowerCase();
    const matchingItems = candidateItems.filter((item) =>
      normalizedName.includes(item.name.toLowerCase()),
    );

    if (matchingItems.length > 0) {
      const updatedProjectIds = new Set<string>();

      for (const item of matchingItems) {
        const newRealization = Number(item.realization) + amount;

        await prisma.rabItem.update({
          where: { id: item.id },
          data: { realization: newRealization },
        });

        updatedProjectIds.add(item.rabProjectId);
      }

      for (const projectId of updatedProjectIds) {
        const aggregated = await prisma.rabItem.aggregate({
          where: { rabProjectId: projectId, deletedAt: null },
          _sum: { realization: true },
        });

        await prisma.rabProject.update({
          where: { id: projectId },
          data: { totalRealization: Number(aggregated._sum.realization || 0) },
        });
      }

      const firstItem = matchingItems[0];
      const project = await prisma.rabProject.findUnique({
        where: { id: firstItem.rabProjectId },
      });

      return {
        matched: true,
        rabItemId: firstItem.id,
        rabItemName: firstItem.name,
        amountAdded: amount,
        newRealization: Number(firstItem.realization) + amount,
        newProjectTotal: Number(project?.totalRealization || 0),
      };
    }
  }

  return {
    matched: false,
    rabItemId: null,
    rabItemName: null,
    amountAdded: 0,
    newRealization: 0,
    newProjectTotal: 0,
  };
}

/**
 * Reverse (subtract) a previously-synced realization when a transaction
 * is deleted or its rabSyncMode/rabItemId changes.
 */
export async function reverseSyncFromRab(
  categoryId: string | null,
  amount: number,
  userId: string,
  rabSyncMode?: "auto" | "manual" | "none",
  rabItemId?: string | null,
  transactionName?: string,
): Promise<void> {
  if (amount <= 0) return;

  // ============================================
  // Manual: reverse from specific RabItem
  // ============================================
  if (rabSyncMode === "manual" && rabItemId) {
    const item = await prisma.rabItem.findFirst({
      where: {
        id: rabItemId,
        deletedAt: null,
        project: { createdBy: userId, deletedAt: null },
      },
    });

    if (item) {
      const newRealization = Math.max(0, Number(item.realization) - amount);

      await prisma.rabItem.update({
        where: { id: item.id },
        data: { realization: newRealization },
      });

      const aggregated = await prisma.rabItem.aggregate({
        where: { rabProjectId: item.rabProjectId, deletedAt: null },
        _sum: { realization: true },
      });

      await prisma.rabProject.update({
        where: { id: item.rabProjectId },
        data: { totalRealization: Number(aggregated._sum.realization || 0) },
      });

      return;
    }
  }

  // ============================================
  // Auto: reverse from category + name match
  // ============================================
  if (rabSyncMode === "auto" && categoryId && transactionName) {
    const candidateItems = await prisma.rabItem.findMany({
      where: {
        deletedAt: null,
        category: categoryId,
        project: { createdBy: userId, deletedAt: null },
      },
    });

    const normalizedName = transactionName.toLowerCase();
    const matchingItems = candidateItems.filter((item) =>
      normalizedName.includes(item.name.toLowerCase()),
    );

    if (matchingItems.length === 0) return;

    const updatedProjectIds = new Set<string>();

    for (const item of matchingItems) {
      const newRealization = Math.max(0, Number(item.realization) - amount);

      await prisma.rabItem.update({
        where: { id: item.id },
        data: { realization: newRealization },
      });

      updatedProjectIds.add(item.rabProjectId);
    }

    for (const projectId of updatedProjectIds) {
      const aggregated = await prisma.rabItem.aggregate({
        where: { rabProjectId: projectId, deletedAt: null },
        _sum: { realization: true },
      });

      await prisma.rabProject.update({
        where: { id: projectId },
        data: { totalRealization: Number(aggregated._sum.realization || 0) },
      });
    }
  }
}

/**
 * Full reconciliation: recalculate ALL RAB realization values
 * from scratch. Only processes transactions with rabSyncMode != 'none'.
 */
export async function reconcileAllRabRealization(userId: string): Promise<{
  reconciledItems: number;
  reconciledProjects: number;
  totalAmount: number;
}> {
  const items = await prisma.rabItem.findMany({
    where: {
      deletedAt: null,
      project: { createdBy: userId, deletedAt: null },
    },
  });

  if (items.length === 0) {
    return { reconciledItems: 0, reconciledProjects: 0, totalAmount: 0 };
  }

  // Only get transactions that should be synced (not 'none')
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "pengeluaran",
      rabSyncMode: { not: "none" },
    },
  });

  // Three maps:
  // 1. rabItemId → total (manual)
  // 2. "categoryId|normalizedName" → { amount, rabItemIds } (auto)
  const rabItemTotals = new Map<string, number>();
  const autoMatches = new Map<string, { amount: number; rabItemIds: string[] }>();

  for (const tx of transactions) {
    const amount = Number(tx.totalAmount);

    if (tx.rabSyncMode === "manual" && tx.rabItemId) {
      const current = rabItemTotals.get(tx.rabItemId) || 0;
      rabItemTotals.set(tx.rabItemId, current + amount);
    } else if (tx.rabSyncMode === "auto" && tx.category && tx.name) {
      // We'll resolve name matching after building candidate list
      const key = tx.category;
      const current = autoMatches.get(key);
      if (current) {
        current.amount += amount;
      } else {
        autoMatches.set(key, { amount, rabItemIds: [] });
      }
    }
  }

  // For auto mode: resolve name matching per category
  const categoryIds = Array.from(autoMatches.keys());
  const allCandidates = await prisma.rabItem.findMany({
    where: {
      deletedAt: null,
      category: { in: categoryIds },
      project: { createdBy: userId, deletedAt: null },
    },
  });

  // Build category → items map
  const catItemsMap = new Map<string, typeof allCandidates>();
  for (const item of allCandidates) {
    if (!item.category) continue;
    const list = catItemsMap.get(item.category) || [];
    list.push(item);
    catItemsMap.set(item.category, list);
  }

  // For each auto transaction, find matching items by name
  const autoItemTotals = new Map<string, number>(); // rabItemId → total
  for (const tx of transactions) {
    if (tx.rabSyncMode !== "auto" || !tx.category || !tx.name) continue;
    const amount = Number(tx.totalAmount);
    const candidates = catItemsMap.get(tx.category) || [];
    const normalizedName = tx.name.toLowerCase();

    for (const item of candidates) {
      if (normalizedName.includes(item.name.toLowerCase())) {
        const current = autoItemTotals.get(item.id) || 0;
        autoItemTotals.set(item.id, current + amount);
      }
    }
  }

  // Merge manual + auto totals
  const finalTotals = new Map<string, number>();
  for (const [id, amount] of rabItemTotals) {
    finalTotals.set(id, amount);
  }
  for (const [id, amount] of autoItemTotals) {
    const current = finalTotals.get(id) || 0;
    finalTotals.set(id, current + amount);
  }

  // Update each RAB item
  const updatedProjectIds = new Set<string>();
  let totalAmount = 0;

  for (const item of items) {
    const realization = finalTotals.get(item.id) || 0;

    await prisma.rabItem.update({
      where: { id: item.id },
      data: { realization },
    });

    totalAmount += realization;
    updatedProjectIds.add(item.rabProjectId);
  }

  for (const projectId of updatedProjectIds) {
    const aggregated = await prisma.rabItem.aggregate({
      where: { rabProjectId: projectId, deletedAt: null },
      _sum: { realization: true },
    });

    await prisma.rabProject.update({
      where: { id: projectId },
      data: { totalRealization: Number(aggregated._sum.realization || 0) },
    });
  }

  return {
    reconciledItems: items.length,
    reconciledProjects: updatedProjectIds.size,
    totalAmount,
  };
}
