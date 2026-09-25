"use client";

import { SidebarNavItem } from "./SidebarItem";
import { sidebarConfig } from "@/config/sidebar.config";
import { LogOut, X, ChevronLeft, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar, MIN_WIDTH, MAX_WIDTH } from "@/contexts/SidebarContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { LayoutGroup } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Role } from "@/lib/permissions";
import FinaroLogo from "@/components/shared/FinaroLogo";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SidebarUser = {
  name: string;
  email: string;
  role: Role;
};

export function Sidebar({ user }: { user?: SidebarUser }) {
  const router = useRouter();
  const { isOpen, close, width, setWidth, commitWidth, toggleCollapse } =
    useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingXRef = useRef<number | null>(null);

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        alert("Gagal logout, silakan coba lagi");
        setIsLoggingOut(false);
      }
    } catch {
      alert("Terjadi kesalahan, silakan coba lagi");
      setIsLoggingOut(false);
    }
  }

  const scheduleResize = useCallback(
    (clientX: number) => {
      pendingXRef.current = clientX;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pendingXRef.current === null) return;
        const delta = pendingXRef.current - startXRef.current;
        setWidth(startWidthRef.current + delta);
      });
    },
    [setWidth]
  );

  const flushResize = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (pendingXRef.current !== null) {
      const delta = pendingXRef.current - startXRef.current;
      setWidth(startWidthRef.current + delta);
      pendingXRef.current = null;
    }
  }, [setWidth]);

  const endResize = useCallback(() => {
    flushResize();
    commitWidth();
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [flushResize, commitWidth]);

  const beginResize = useCallback(
    (clientX: number) => {
      startXRef.current = clientX;
      startWidthRef.current = width;
      pendingXRef.current = null;
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      beginResize(e.clientX);
    },
    [beginResize]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      scheduleResize(e.clientX);
    },
    [isResizing, scheduleResize]
  );

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;
    endResize();
  }, [isResizing, endResize]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      beginResize(e.touches[0].clientX);
    },
    [beginResize]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isResizing) return;
      e.preventDefault();
      scheduleResize(e.nativeEvent.touches[0].clientX);
    },
    [isResizing, scheduleResize]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isResizing) return;
    endResize();
  }, [isResizing, endResize]);

  const handleNativeTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      scheduleResize(e.touches[0].clientX);
    },
    [isResizing, scheduleResize]
  );

  const handleNativeTouchEnd = useCallback(() => {
    if (!isResizing) return;
    endResize();
  }, [isResizing, endResize]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("touchmove", handleNativeTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleNativeTouchEnd);
    }
    return () => {
      document.removeEventListener("touchmove", handleNativeTouchMove);
      document.removeEventListener("touchend", handleNativeTouchEnd);
    };
  }, [isResizing, handleNativeTouchMove, handleNativeTouchEnd]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const showLabels = width > MIN_WIDTH + 20;

  return (
    <>
      {/* Mobile overlay */}
      <div
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={close}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col h-full",
          isResizing
            ? "transition-none"
            : "transition-[transform,width] duration-200 ease-in-out",
          "md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ width: `${width}px` }}
      >
        {/* Logo Brand */}
        <div className="p-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center justify-between">
            {showLabels ? (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <FinaroLogo height={10} />
                    <h1 className="text-xl font-bold text-primary">Finaro</h1>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleCollapse}
                    className="group p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
                    title="Collapse sidebar"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:-translate-x-0.5" />
                  </button>
                  <button
                    onClick={close}
                    className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors md:hidden"
                    aria-label="Tutup sidebar"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex w-full justify-center">
                <button
                  onClick={toggleCollapse}
                  className="group p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <span className="block transition-transform duration-200 group-hover:scale-110">
                    <FinaroLogo height={10} />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 min-w-0">
          <LayoutGroup>
            {sidebarConfig.map((section) => {
              const filteredItems = section.items.filter(
                (item) =>
                  !item.roles ||
                  (user?.role && item.roles.includes(user.role))
              );
              if (filteredItems.length === 0) return null;
              return (
                <div key={section.label}>
                  <h3
                    className={cn(
                      "px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate transition-opacity duration-200",
                      showLabels
                        ? "opacity-100 mb-2"
                        : "opacity-0 h-0 mb-0 overflow-hidden px-0"
                    )}
                    aria-hidden={!showLabels}
                  >
                    {section.label}
                  </h3>
                  <ul className="space-y-2">
                    {filteredItems.map((item) => (
                      <li key={item.href}>
                        <SidebarNavItem
                          label={showLabels ? item.label : ""}
                          href={item.href}
                          iconName={item.icon}
                          isCollapsed={!showLabels}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </LayoutGroup>
        </nav>

        {/* Bottom: User Info + Logout (single row) */}
        <div className="border-t border-sidebar-border p-3 mt-auto flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {initials}
            </div>
            <div
              className={cn(
                "flex-1 min-w-0 transition-opacity duration-200",
                showLabels ? "opacity-100" : "pointer-events-none absolute opacity-0 h-0 overflow-hidden"
              )}
              aria-hidden={!showLabels}
            >
              <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate leading-tight">
                {displayEmail}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border",
                "hover:bg-red-50 hover:border-red-200 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                showLabels ? "" : "ml-auto"
              )}
              title={isLoggingOut ? "Keluar..." : "Log out"}
            >
              <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeHandleRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize",
            "transition-colors duration-100",
            isResizing ? "bg-sidebar-primary/30" : "hover:bg-sidebar-border/50",
            "md:block hidden"
          )}
            aria-label="Resize sidebar"
          role="slider"
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          aria-valuenow={width}
          tabIndex={0}
        >
          <div className="absolute right-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-px items-center justify-center">
            <GripVertical className="h-5 w-px text-muted-foreground/50" />
          </div>
        </div>
      </aside>
    </>
  );
}
