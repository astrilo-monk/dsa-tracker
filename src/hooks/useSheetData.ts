"use client";

import { useEffect, useState } from "react";
import { loadSheetDataset } from "@/lib/sheets/catalog";
import type { SheetDataset, SheetId } from "@/lib/sheets/types";

export function useSheetData(sheetId: SheetId) {
  const [data, setData] = useState<SheetDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    loadSheetDataset(sheetId)
      .then((dataset) => {
        if (!active) return;
        setData(dataset);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load sheet data.");
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sheetId]);

  return { data, isLoading, error };
}
