"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Constants
const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes
const WARNING_BEFORE = 2 * 60 * 1000; // 2 minutes before expiry
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const ACTIVITY_DEBOUNCE = 1000; // 1 second
const CHANNEL_NAME = "session-sync";

// Types
interface SessionState {
  isActive: boolean;
  isWarning: boolean;
  timeLeft: number; // seconds remaining when in warning
  lastActivity: number; // timestamp
}

interface BroadcastMessage {
  type: "activity" | "warning" | "logout";
  payload: {
    timestamp?: number;
    show?: boolean;
    timeLeft?: number;
  };
}

export function useSessionTimeout(onLogout?: () => void) {
  const router = useRouter();
  const [state, setState] = useState<SessionState>({
    isActive: true,
    isWarning: false,
    timeLeft: 120, // 2 minutes in seconds
    lastActivity: 0,
  });

  const lastActivityRef = useRef(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearInterval(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    clearAllTimers();

    // Broadcast logout to all tabs
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "logout",
        payload: {},
      });
    }

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore error, proceed with redirect
    }

    if (onLogout) {
      onLogout();
    } else {
      router.push("/login");
    }
  }, [clearAllTimers, onLogout, router]);

  // Refresh session via API
  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });
      if (!response.ok) {
        // Session expired or invalid
        logout();
        return false;
      }
      return true;
    } catch {
      // Network error, but don't logout immediately
      // Let the timer continue
      return false;
    }
  }, [logout]);

  // Update inactivity timer
  const updateInactivityTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearInterval(warningTimerRef.current);
      warningTimerRef.current = null;
    }

    // Reset warning state
    setState((prev) => ({
      ...prev,
      isWarning: false,
      timeLeft: 120,
      lastActivity: now,
    }));

    // Set new inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);

    // Set warning timer (starts 2 minutes before expiry)
    const warningStartTime = INACTIVITY_LIMIT - WARNING_BEFORE;
    let elapsed = 0;

    warningTimerRef.current = setInterval(() => {
      elapsed += 1000;
      const remaining = Math.max(0, 120 - Math.floor(elapsed / 1000));

      if (elapsed >= warningStartTime) {
        setState((prev) => ({
          ...prev,
          isWarning: true,
          timeLeft: remaining,
        }));

        // Broadcast warning to other tabs
        if (channelRef.current) {
          channelRef.current.postMessage({
            type: "warning",
            payload: { show: true, timeLeft: remaining },
          });
        }

        // If time left is 0, logout
        if (remaining <= 0) {
          logout();
        }
      }
    }, 1000);
  }, [logout]);

  // Handle activity event
  const handleActivity = useCallback(() => {
    // Debounce to avoid too many updates
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateInactivityTimer();

      // Broadcast activity to other tabs
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "activity",
          payload: { timestamp: Date.now() },
        });
      }
    }, ACTIVITY_DEBOUNCE);
  }, [updateInactivityTimer]);

  // Extend session (called from warning modal)
  const extendSession = useCallback(async () => {
    const success = await refreshSession();
    if (success) {
      updateInactivityTimer();

      // Broadcast activity to other tabs
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "activity",
          payload: { timestamp: Date.now() },
        });
      }
    }
  }, [refreshSession, updateInactivityTimer]);

  // Set up BroadcastChannel for multi-tab communication
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);

      channelRef.current.onmessage = (event: MessageEvent<BroadcastMessage>) => {
        const { type, payload } = event.data;

        switch (type) {
          case "activity":
            // Another tab had activity, reset our timer
            if (payload.timestamp) {
              lastActivityRef.current = payload.timestamp;
              updateInactivityTimer();
            }
            break;

          case "warning":
            // Another tab is showing warning, sync our state
            if (payload.show !== undefined && payload.timeLeft !== undefined) {
              setState((prev) => ({
                ...prev,
                isWarning: payload.show!,
                timeLeft: payload.timeLeft!,
              }));
            }
            break;

          case "logout":
            // Another tab triggered logout
            clearAllTimers();
            router.push("/login");
            break;
        }
      };
    } catch {
      // BroadcastChannel not supported, proceed without multi-tab sync
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, [updateInactivityTimer, clearAllTimers, router]);

  // Set up activity event listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize timers only once
    if (!initializedRef.current) {
      initializedRef.current = true;
      const now = Date.now();
      lastActivityRef.current = now;
      setState((prev) => ({ ...prev, lastActivity: now }));

      // Set initial inactivity timer
      inactivityTimerRef.current = setTimeout(() => {
        logout();
      }, INACTIVITY_LIMIT);
    }

    // Set up auto-refresh interval
    refreshTimerRef.current = setInterval(() => {
      refreshSession();
    }, REFRESH_INTERVAL);

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearAllTimers();
    };
  }, [handleActivity, refreshSession, clearAllTimers, logout, router]);

  return {
    isActive: state.isActive,
    isWarning: state.isWarning,
    timeLeft: state.timeLeft,
    extendSession,
    logout,
  };
}
