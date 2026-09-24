"use client";

import { useState, useEffect, useCallback } from "react";
import type { SummaryData } from "../services/keuanganService";
import * as keuanganService from "../services/keuanganService";

export function useKeuanganSummary() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await keuanganService.getSummary();
      setSummary(result);
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

  return { summary, isLoading, error, refetch: fetchData };
}
