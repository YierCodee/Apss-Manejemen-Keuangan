"use client";

import { useState, useEffect, useCallback } from "react";
import type { LaporanData } from "../types/keuangan.types";
import * as laporanService from "../services/laporanService";

export function useLaporan() {
  const [data, setData] = useState<LaporanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await laporanService.getLaporanData();
      setData(result);
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

  return { data, isLoading, error, refetch: fetchData };
}
