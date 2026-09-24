"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

interface SessionTimeoutContextType {
  showWarning: boolean;
  timeLeft: number;
  extendSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType | null>(null);

export function SessionTimeoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  const { isWarning, timeLeft: hookTimeLeft, extendSession, logout } = useSessionTimeout(handleLogout);

  // Sync warning state from hook
  if (showWarning !== isWarning) {
    setShowWarning(isWarning);
  }
  if (timeLeft !== hookTimeLeft) {
    setTimeLeft(hookTimeLeft);
  }

  return (
    <SessionTimeoutContext.Provider
      value={{
        showWarning,
        timeLeft,
        extendSession,
        logout,
      }}
    >
      {children}
    </SessionTimeoutContext.Provider>
  );
}

export function useSessionTimeoutContext() {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error(
      "useSessionTimeoutContext must be used within a SessionTimeoutProvider"
    );
  }
  return context;
}
