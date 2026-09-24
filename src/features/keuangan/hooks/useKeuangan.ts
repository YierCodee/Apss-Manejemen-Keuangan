"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionRecord, TransactionFormData } from "../types/keuangan.types";
import * as keuanganService from "../services/keuanganService";

export function useKeuangan() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ type?: string; search?: string } | undefined>(undefined);

  const transactionsQuery = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => keuanganService.getTransactions(filters),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => keuanganService.getCategories(),
    staleTime: 5 * 60_000,
  });

  const createMutation = useMutation({
    mutationFn: keuanganService.createTransaction,
    onSuccess: (created) => {
      queryClient.setQueryData<TransactionRecord[]>(
        ["transactions", filters],
        (old) => [created, ...(old ?? [])]
      );
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionFormData> }) =>
      keuanganService.updateTransaction(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<TransactionRecord[]>(
        ["transactions", filters],
        (old) => old?.map((t) => (t.id === updated.id ? updated : t)) ?? []
      );
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: keuanganService.deleteTransaction,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<TransactionRecord[]>(
        ["transactions", filters],
        (old) => old?.filter((t) => t.id !== id) ?? []
      );
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });

  const fetchTransactions = useCallback(
    (newFilters?: { type?: string; search?: string }) => {
      setFilters(newFilters);
    },
    []
  );

  return {
    transactions: transactionsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    isLoading: transactionsQuery.isPending || categoriesQuery.isPending,
    error: transactionsQuery.error?.message ?? categoriesQuery.error?.message ?? null,
    fetchTransactions,
    create: createMutation.mutateAsync,
    update: (id: string, data: Partial<TransactionFormData>) =>
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
  };
}
