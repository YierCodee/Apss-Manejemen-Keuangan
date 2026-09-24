import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

// ============================================
// Types
// ============================================

export type RabPriority = "on-track" | "high" | "medium" | "low";

/** Map frontend priority values to Prisma enum values. */
function toPrismaPriority(value: string): "on_track" | "high" | "medium" | "low" {
  if (value === "on-track") return "on_track";
  if (value === "high" || value === "medium" || value === "low") return value;
  return "medium"; // fallback
}

export interface CreateRabItemInput {
  categoryId?: string | null;
  customCategory?: string;
  posName: string;
  specs?: string;
  priority: RabPriority;
  quantity: number;
  targetProgress?: number;
  quarter: string;
  pricePerUnit: number;
  notes?: string;
}

// ============================================
// Helpers
// ============================================

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(value: string): boolean {
  return UUID_RE.test(value);
}

/**
 * Safely convert a Prisma Decimal (or number/string) to a plain number.
 * Prisma serializes Decimal fields as strings in JSON responses,
 * which breaks arithmetic on the frontend.
 */
function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;
  // Prisma Decimal objects have a toString() method
  if (typeof value === "object" && "toString" in value)
    return parseFloat(String(value)) || 0;
  return 0;
}

function parseQuarter(quarterStr: string): { quarter: string; year: number } {
  // "Kuartal 4 (Q4) 2024" → { quarter: "Q4", year: 2024 }
  const match = quarterStr.match(/Q(\d)\).*?(\d{4})/);
  if (!match) {
    return { quarter: "Q4", year: new Date().getFullYear() };
  }
  return { quarter: `Q${match[1]}`, year: parseInt(match[2]) };
}

/**
 * Resolve category: if customCategory provided, create-or-find in categories table,
 * then return the UUID. Otherwise return the provided categoryId directly.
 */
async function resolveCategoryId(
  categoryId: string | null | undefined,
  customCategory: string | null | undefined,
): Promise<string | null> {
  // If a valid categoryId UUID is provided, use it directly
  if (categoryId && isValidUUID(categoryId)) {
    return categoryId;
  }

  // If custom category name provided, create-or-find in categories table
  const name = customCategory?.trim();
  if (!name) return null;

  // Try to find existing category by name (case-insensitive)
  const existing = await prisma.category.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      isActive: true,
    },
  });

  if (existing) return existing.id;

  // Create new category
  const created = await prisma.category.create({
    data: {
      name,
      type: "PENGELUARAN",
    },
  });

  return created.id;
}

// ============================================
// Service Functions
// ============================================

/**
 * Create a new RAB item. If a project for the given quarter/year doesn't exist, create it.
 */
export async function createRabItem(
  input: CreateRabItemInput,
  userId: string,
) {
  if (!isValidUUID(userId)) {
    throw new Error(
      `userId "${userId}" bukan UUID yang valid. ` +
        "Pastikan user dibuat melalui jalur yang menghasilkan UUID, " +
        "atau buat ulang akun.",
    );
  }

  const { quarter: quarterLabel, year } = parseQuarter(input.quarter);
  const totalBudget = input.quantity * input.pricePerUnit;

  // Find or create the RabProject for this quarter (scoped to current user)
  let project = await prisma.rabProject.findFirst({
    where: {
      quarter: quarterLabel,
      year,
      createdBy: userId,
      deletedAt: null,
    },
  });

  if (!project) {
    project = await prisma.rabProject.create({
      data: {
        projectName: `RAB ${quarterLabel} ${year}`,
        quarter: quarterLabel,
        year,
        totalBudget: 0,
        status: "draft",
        createdBy: userId,
      },
    });
  }

  // Resolve category — either existing UUID or create new from customCategory
  const resolvedCategoryId = await resolveCategoryId(
    input.categoryId,
    input.customCategory,
  );

  // Create the RabItem
  const item = await prisma.rabItem.create({
    data: {
      rabProjectId: project.id,
      name: input.posName,
      specs: input.specs || null,
      category: resolvedCategoryId,
      priority: toPrismaPriority(input.priority),
      quantity: input.quantity,
      pricePerUnit: input.pricePerUnit,
      totalBudget,
      targetProgress: input.targetProgress ?? 0,
      notes: input.notes || null,
    },
    include: {
      project: true,
      categoryRef: true,
    },
  });

  // Update the project's totalBudget
  await prisma.rabProject.update({
    where: { id: project.id },
    data: {
      totalBudget: {
        increment: totalBudget,
      },
    },
  });

  return {
    ...item,
    categoryName: item.categoryRef?.name ?? null,
    pricePerUnit: toNumber(item.pricePerUnit),
    totalBudget: toNumber(item.totalBudget),
    realization: toNumber(item.realization),
  };
}

/**
 * Get all RAB items grouped by project.
 */
export async function getRabItems(userId?: string) {
  const projects = await prisma.rabProject.findMany({
    where: {
      deletedAt: null,
      ...(userId ? { createdBy: userId } : {}),
    },
    include: {
      items: {
        where: { deletedAt: null },
        include: { categoryRef: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Prisma Decimal fields to plain numbers for JSON serialization
  return projects.map((project) => ({
    ...project,
    totalBudget: toNumber(project.totalBudget),
    totalRealization: toNumber(project.totalRealization),
    items: project.items.map((item) => ({
      ...item,
      categoryName: item.categoryRef?.name ?? null,
      categoryRef: undefined, // don't leak full object
      pricePerUnit: toNumber(item.pricePerUnit),
      totalBudget: toNumber(item.totalBudget),
      realization: toNumber(item.realization),
    })),
  }));
}

/**
 * Get a single RAB project with all its items.
 */
export async function getRabProjectById(projectId: string) {
  const project = await prisma.rabProject.findUnique({
    where: { id: projectId },
    include: {
      items: {
        where: { deletedAt: null },
        include: { categoryRef: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) return null;

  return {
    ...project,
    totalBudget: toNumber(project.totalBudget),
    totalRealization: toNumber(project.totalRealization),
    items: project.items.map((item) => ({
      ...item,
      categoryName: item.categoryRef?.name ?? null,
      categoryRef: undefined,
      pricePerUnit: toNumber(item.pricePerUnit),
      totalBudget: toNumber(item.totalBudget),
      realization: toNumber(item.realization),
    })),
  };
}

const getRabSummaryData = unstable_cache(
  async (userId?: string) => {
    const where = {
      deletedAt: null,
      ...(userId ? { createdBy: userId } : {}),
    };

    const [totalProjects, totalItems, aggregated] = await Promise.all([
      prisma.rabProject.count({ where }),
      prisma.rabItem.count({
        where: { project: where, deletedAt: null },
      }),
      prisma.rabProject.aggregate({
        where,
        _sum: {
          totalBudget: true,
          totalRealization: true,
        },
      }),
    ]);

    return {
      totalProjects,
      totalItems,
      totalBudget: toNumber(aggregated._sum.totalBudget),
      totalRealization: toNumber(aggregated._sum.totalRealization),
    };
  },
  ["rab-summary"],
  { revalidate: 60, tags: ["rab-summary"] }
);

/**
 * Get summary stats for the RAB dashboard.
 */
export async function getRabSummary(userId?: string) {
  return getRabSummaryData(userId);
}
