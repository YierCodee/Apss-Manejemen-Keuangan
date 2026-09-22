"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Menu, MessageSquare, Bell, User } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export function Navbar() {
  const { toggle } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const params = new URLSearchParams({ search: trimmed });
    router.push(`/keuangan?${params.toString()}`);
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center pl-4 pr-2 md:pl-6 md:pr-4">
      <div className="flex items-center w-full">
        {/* Left: Hamburger (mobile) */}
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors md:hidden"
        >
          <Menu className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Right: Search */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              placeholder="Cari transaksi kamu"
              className="h-9 w-40 md:w-56 rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {/* Mobile search icon */}
          <button
            onClick={() => router.push("/keuangan")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors sm:hidden"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Message */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Notification */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
          </button>

          {/* Account */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors">
            <User className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
