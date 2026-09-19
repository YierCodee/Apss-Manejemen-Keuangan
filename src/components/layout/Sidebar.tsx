"use client";

import { SidebarNavItem } from "./SidebarItem";
import { sidebarConfig, userProfile, logoutItem } from "@/config/sidebar.config";
import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

export function Sidebar() {
  const pathname = usePathname();
  const isLogoutActive = pathname === "/logout";
  const { isOpen, close } = useSidebar();

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
          {sidebarConfig.map((section) => (
            <div key={section.label}>
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {section.label}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
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
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-foreground">
              {userProfile.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userProfile.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile.email}
              </p>
            </div>
          </div>
          <Link
            href={logoutItem.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLogoutActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <LogOut className="h-5 w-5 text-sidebar-icon" />
            {logoutItem.label}
          </Link>
        </div>
      </aside>
    </>
  );
}
