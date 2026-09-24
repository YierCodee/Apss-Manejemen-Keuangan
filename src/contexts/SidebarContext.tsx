"use client";

import { createContext, useContext, useState, useCallback } from "react";

const MIN_WIDTH = 64; // w-16 = 64px
const MAX_WIDTH = 320; // w-80 = 320px
const DEFAULT_WIDTH = 256; // w-64 = 256px
const STORAGE_KEY = "sidebar-width";

function getInitialWidth(): number {
  if (typeof window === "undefined") return DEFAULT_WIDTH;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed) && parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
      return parsed;
    }
  }
  return DEFAULT_WIDTH;
}

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  width: number;
  setWidth: (width: number | ((prev: number) => number)) => void;
  toggleCollapse: () => void;
  isCollapsed: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidthState] = useState<number>(() => getInitialWidth());

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const setWidth = useCallback((newWidth: number | ((prev: number) => number)) => {
    const resolvedWidth = typeof newWidth === "function" ? newWidth(width) : newWidth;
    const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resolvedWidth));
    setWidthState(clamped);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, clamped.toString());
    }
  }, [width]);

  const toggleCollapse = useCallback(() => {
    setWidth((prev: number) => (prev > MIN_WIDTH + 20 ? MIN_WIDTH : DEFAULT_WIDTH));
  }, [setWidth]);

  const isCollapsed = width <= MIN_WIDTH + 1;

  return (
    <SidebarContext.Provider
      value={{ isOpen, toggle, close, width, setWidth, toggleCollapse, isCollapsed }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export { MIN_WIDTH, MAX_WIDTH, DEFAULT_WIDTH };
