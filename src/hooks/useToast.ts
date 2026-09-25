"use client";

import { useMemo } from "react";
import { useToast as useToastContext } from "@/contexts/ToastProvider";

export interface ToastApi {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export function useToast() {
  const { addToast, dismiss, dismissAll } = useToastContext();

  const toast = useMemo<ToastApi>(
    () => ({
      success: (message, duration) =>
        addToast({ type: "success", message, duration }),
      error: (message, duration) =>
        addToast({ type: "error", message, duration }),
      warning: (message, duration) =>
        addToast({ type: "warning", message, duration }),
      info: (message, duration) => addToast({ type: "info", message, duration }),
    }),
    [addToast]
  );

  return { toast, dismiss, dismissAll, addToast };
}
