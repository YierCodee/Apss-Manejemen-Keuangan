import { prisma } from "@/lib/db";

// ============================================
// RAB Sync Service
// Sinkronisasi otomatis antara modul Keuangan ↔ RAB
//
// Matching sekarang pakai UUID langsung:
//   Transaction.category (UUID FK ke categories.id)
//   ↔ RabItem.category   (UUID FK ke categories.id)
//
// Tidak perlu lagi string comparison case-insensitive.
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
 * Sync a single pengeluaran transaction to RAB realization.
 * Matches by comparing Transaction.category UUID ↔ RabItem.category UUID directly.
 */
export async function syncTransactionToRab(
  transactionId: string,
  categoryId: string | null,
  amount: number,
  userId: string,
): Promise<SyncResult> {
  if (!categoryId || amount <= 0) {
    return {
      matched: false,
      rabItemId: null,
      rabItemName: null,
      amountAdded: 0,
      newRealization: 0,
      newProjectTotal: 0,
    };
  }

  // Direct UUID match — both Transaction.category and RabItem.category
  // reference the same categories.id
  const matchingItems = await prisma.rabItem.findMany({
    where: {
      deletedAt: null,
      category: categoryId,
      project: {
        createdBy: userId,
        deletedAt: null,
      },
    },
    include: {
      project: true,
    },
  });

  if (matchingItems.length === 0) {
    return {
      matched: false,
      rabItemId: null,
      rabItemName: null,
      amountAdded: 0,
      newRealization: 0,
      newProjectTotal: 0,
    };
  }

  // Update realization for ALL matching items across all active projects
  const updatedProjectIds = new Set<string>();

  for (const item of matchingItems) {
    const newRealization = Number(item.realization) + amount;

    await prisma.rabItem.update({
      where: { id: item.id },
      data: { realization: newRealization },
    });

    updatedProjectIds.add(item.rabProjectId);
  }

  // Recalculate totalRealization for each affected project
  for (const projectId of updatedProjectIds) {
    const aggregated = await prisma.rabItem.aggregate({
      where: {
        rabProjectId: projectId,
        deletedAt: null,
      },
      _sum: { realization: true },
    });

    await prisma.rabProject.update({
      where: { id: projectId },
      data: { totalRealization: Number(aggregated._sum.realization || 0) },
    });
  }

  // Return info about the first matched item
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

/**
 * Reverse (subtract) a previously-synced realization when a transaction
 * is deleted or its category/amount changes.
 */
export async function reverseSyncFromRab(
  categoryId: string | null,
  amount: number,
  userId: string,
): Promise<void> {
  if (!categoryId || amount <= 0) return;

  const matchingItems = await prisma.rabItem.findMany({
    where: {
      deletedAt: null,
      category: categoryId,
      project: {
        createdBy: userId,
        deletedAt: null,
      },
    },
  });

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

  // Recalculate project totals
  for (const projectId of updatedProjectIds) {
    const aggregated = await prisma.rabItem.aggregate({
      where: {
        rabProjectId: projectId,
        deletedAt: null,
      },
      _sum: { realization: true },
    });

    await prisma.rabProject.update({
      where: { id: projectId },
      data: { totalRealization: Number(aggregated._sum.realization || 0) },
    });
  }
}

/**
 * Full reconciliation: recalculate ALL RAB realization values
 * from scratch by summing matching keuangan transactions.
 */
export async function reconcileAllRabRealization(userId: string): Promise<{
  reconciledItems: number;
  reconciledProjects: number;
  totalAmount: number;
}> {
  // Get all active RAB items for this user
  const items = await prisma.rabItem.findMany({
    where: {
      deletedAt: null,
      project: {
        createdBy: userId,
        deletedAt: null,
      },
    },
  });

  if (items.length === 0) {
    return { reconciledItems: 0, reconciledProjects: 0, totalAmount: 0 };
  }

  // Get all pengeluaran transactions grouped by category
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "pengeluaran",
      category: { not: null },
    },
  });

  // Build a map: categoryId (UUID) → total pengeluaran amount
  const categoryTotals = new Map<string, number>();
  for (const tx of transactions) {
    if (!tx.category) continue;
    const current = categoryTotals.get(tx.category) || 0;
    categoryTotals.set(tx.category, current + Number(tx.totalAmount));
  }

  // Update each RAB item by direct UUID match
  const updatedProjectIds = new Set<string>();
  let totalAmount = 0;

  for (const item of items) {
    if (!item.category) continue;

    const realization = categoryTotals.get(item.category) || 0;

    await prisma.rabItem.update({
      where: { id: item.id },
      data: { realization },
    });

    totalAmount += realization;
    updatedProjectIds.add(item.rabProjectId);
  }

  // Recalculate all affected project totals
  for (const projectId of updatedProjectIds) {
    const aggregated = await prisma.rabItem.aggregate({
      where: {
        rabProjectId: projectId,
        deletedAt: null,
      },
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
