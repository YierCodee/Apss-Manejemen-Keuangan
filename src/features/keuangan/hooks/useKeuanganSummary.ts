"use client";

import { useQuery } from "@tanstack/react-query";
import * as keuanganService from "../services/keuanganService";

export function useKeuanganSummary() {
  const query = useQuery({
    queryKey: ["summary"],
    queryFn: keuanganService.getSummary,
    staleTime: 60_000,
  });

  return {
    summary: query.data ?? null,
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
