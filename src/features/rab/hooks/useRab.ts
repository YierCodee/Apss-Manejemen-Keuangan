"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// ============================================
// Types matching the API response shape
// ============================================

export interface RabItemData {
  id: string;
  rabProjectId: string;
  name: string;
  specs: string | null;
  category: string | null;
  categoryName: string | null;
  priority: string;
  quantity: number;
  pricePerUnit: number;
  totalBudget: number;
  realization: number;
  targetProgress: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RabProjectData {
  id: string;
  projectName: string;
  quarter: string;
  year: number;
  totalBudget: number;
  totalRealization: number;
  status: string;
  createdBy: string;
  items: RabItemData[];
}

export interface RabSummaryData {
  totalProjects: number;
  totalItems: number;
  totalBudget: number;
  totalRealization: number;
}

// ============================================
// Hook
// ============================================

export function useRab() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["rab-projects"],
    queryFn: async () => {
      const res = await fetch("/api/rab");
      if (!res.ok) throw new Error("Gagal memuat data RAB");
      return res.json() as Promise<RabProjectData[]>;
    },
  });

  const summaryQuery = useQuery({
    queryKey: ["rab-summary"],
    queryFn: async () => {
      const res = await fetch("/api/rab?summary=true");
      if (!res.ok) throw new Error("Gagal memuat ringkasan RAB");
      return res.json() as Promise<RabSummaryData>;
    },
    staleTime: 60_000,
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["rab-projects"] });
    queryClient.invalidateQueries({ queryKey: ["rab-summary"] });
  };

  return {
    projects: projectsQuery.data ?? [],
    summary: summaryQuery.data ?? null,
    isLoading: projectsQuery.isPending || summaryQuery.isPending,
    error: projectsQuery.error?.message ?? summaryQuery.error?.message ?? null,
    refetch,
  };
}
