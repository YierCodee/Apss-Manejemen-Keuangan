"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  memo,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ============================================
// Types
// ============================================

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: "ADD"; payload: Toast }
  | { type: "DISMISS"; payload: string }
  | { type: "DISMISS_ALL" };

interface ToastActionsContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ============================================
// Split Contexts
// ============================================

const ToastStateContext = createContext<ToastState | null>(null);
const ToastActionsContext = createContext<ToastActionsContextType | null>(null);

// ============================================
// Reducer
// ============================================

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD":
      return {
        toasts: [...state.toasts, action.payload].slice(-4),
      };
    case "DISMISS":
      return {
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    case "DISMISS_ALL":
      return { toasts: [] };
    default:
      return state;
  }
}

// ============================================
// Helpers
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================
// Provider
// ============================================

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = generateId();
    dispatch({ type: "ADD", payload: { ...toast, id } });
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      dispatch({ type: "DISMISS", payload: id });
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "DISMISS", payload: id });
  }, []);

  const dismissAll = useCallback(() => {
    dispatch({ type: "DISMISS_ALL" });
  }, []);

  const actionsValue = useMemo<ToastActionsContextType>(
    () => ({ addToast, dismiss, dismissAll }),
    [addToast, dismiss, dismissAll],
  );

  const stateValue = useMemo<ToastState>(() => state, [state]);

  return (
    <ToastStateContext.Provider value={stateValue}>
      <ToastActionsContext.Provider value={actionsValue}>
        {children}
        <ToastContainer />
      </ToastActionsContext.Provider>
    </ToastStateContext.Provider>
  );
}

// ============================================
// ToastItem (memoized)
// ============================================

function ToastItemComponent({ toast }: { toast: Toast }) {
  const { dismiss: dismissToast } = useContext(ToastActionsContext) ?? {};

  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colorMap = {
    success: {
      bg: "oklch(0.95 0.04 150)",
      border: "oklch(0.85 0.04 150)",
      icon: "#047857",
      ring: "oklch(0.85 0.04 150)",
    },
    error: {
      bg: "oklch(0.96 0.04 25)",
      border: "oklch(0.90 0.04 25)",
      icon: "#dc2626",
      ring: "oklch(0.90 0.04 25)",
    },
    warning: {
      bg: "oklch(0.96 0.08 60)",
      border: "oklch(0.90 0.06 60)",
      icon: "#d97706",
      ring: "oklch(0.90 0.06 60)",
    },
    info: {
      bg: "oklch(0.95 0.04 250)",
      border: "oklch(0.85 0.04 250)",
      icon: "#2563eb",
      ring: "oklch(0.85 0.04 250)",
    },
  };

  const colors = colorMap[toast.type];
  const Icon = iconMap[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${colors.border} ${colors.bg} px-4 py-3 shadow-xl backdrop-blur-sm`}
      style={{ minWidth: "320px", maxWidth: "420px" }}
    >
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.ring }}
      >
        <Icon className="h-3 w-3" style={{ color: colors.icon }} />
      </div>
      <p className="flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
      <button
        onClick={() => dismissToast?.(toast.id)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md hover:bg-black/5 transition-colors"
      >
        <X className="h-3 w-3 text-gray-400" />
      </button>
    </motion.div>
  );
}

const ToastItem = memo(ToastItemComponent);

// ============================================
// ToastContainer (subscribes to StateContext ONLY)
// ============================================

function ToastContainer() {
  const state = useContext(ToastStateContext);
  if (!state) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {state.toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Hook
// ============================================

export function useToast(): ToastActionsContextType {
  const context = useContext(ToastActionsContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
