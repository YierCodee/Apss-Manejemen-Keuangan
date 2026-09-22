"use client";

import { SidebarNavItem } from "./SidebarItem";
import { sidebarConfig } from "@/config/sidebar.config";
import { LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState } from "react";
import type { Role } from "@/lib/permissions";

type SidebarUser = {
  name: string;
  email: string;
  role: Role;
};

export function Sidebar({ user }: { user?: SidebarUser }) {
  const router = useRouter();
  const { isOpen, close } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col h-full
          transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Brand */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-sm font-bold text-sidebar-primary-foreground">
                  N
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">
                  NevBank
                </h2>
                <p className="text-xs text-muted-foreground">FINANCIAL HUB</p>
              </div>
            </div>
            {/* Close button - mobile only */}
            <button
              onClick={close}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent md:hidden"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sidebarConfig.map((section) => {
            const filteredItems = section.items.filter(
              (item) => !item.roles || (user?.role && item.roles.includes(user.role))
            );
            if (filteredItems.length === 0) return null;
            return (
              <div key={section.label}>
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {section.label}
                </h3>
                <ul className="space-y-2">
                  {filteredItems.map((item) => (
                    <li key={item.href}>
                      <SidebarNavItem
                        label={item.label}
                        href={item.href}
                        iconName={item.icon}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Bottom: User Info + Logout (single row) */}
        <div className="border-t border-sidebar-border p-3 mt-auto">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isLoggingOut ? "Keluar..." : "Log out"}
            >
              <LogOut className="h-4 w-4 text-muted-foreground hover:text-red-600" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
