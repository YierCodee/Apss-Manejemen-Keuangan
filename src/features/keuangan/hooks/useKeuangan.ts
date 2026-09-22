"use client";

import { useState, useEffect, useCallback } from "react";
import type { TransactionRecord, CategoryInfo, TransactionFormData } from "../types/keuangan.types";
import * as keuanganService from "../services/keuanganService";

export function useKeuangan() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (filters?: { type?: string; search?: string }) => {
    try {
      const [txns, cats] = await Promise.all([
        keuanganService.getTransactions(filters),
        keuanganService.getCategories(),
      ]);
      setTransactions(txns);
      setCategories(cats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void fetchData();
  }, [fetchData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const create = async (data: TransactionFormData) => {
    const created = await keuanganService.createTransaction(data);
    setTransactions((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id: string, data: Partial<TransactionFormData>) => {
    const updated = await keuanganService.updateTransaction(id, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const remove = async (id: string) => {
    await keuanganService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    transactions,
    categories,
    isLoading,
    error,
    fetchTransactions: fetchData,
    create,
    update,
    remove,
  };
}
