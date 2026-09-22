"use client";

import { useState, useEffect, useCallback } from "react";

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
  const [projects, setProjects] = useState<RabProjectData[]>([]);
  const [summary, setSummary] = useState<RabSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, summaryRes] = await Promise.all([
        fetch("/api/rab"),
        fetch("/api/rab?summary=true"),
      ]);

      if (!projectsRes.ok || !summaryRes.ok) {
        throw new Error("Gagal memuat data RAB");
      }

      const projectsData = await projectsRes.json();
      const summaryData = await summaryRes.json();

      setProjects(projectsData);
      setSummary(summaryData);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetchData();
  }, [fetchData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    projects,
    summary,
    isLoading,
    error,
    refetch: fetchData,
  };
}
