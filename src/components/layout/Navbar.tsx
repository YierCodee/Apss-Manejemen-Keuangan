"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Menu, MessageSquare, Bell, User } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useMessages } from "@/features/pesan/hooks/useMessages";

export function Navbar() {
  const { toggle } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const messageDropdownRef = useRef<HTMLDivElement>(null);
  const { messages, unreadCount, markAsRead } = useMessages();

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const params = new URLSearchParams({ search: trimmed });
    router.push(`/keuangan?${params.toString()}`);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        messageDropdownRef.current &&
        !messageDropdownRef.current.contains(e.target as Node)
      ) {
        setShowMessageDropdown(false);
      }
    }
    if (showMessageDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMessageDropdown]);

  const recentMessages = messages.slice(0, 5);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center pl-4 pr-2 md:pl-6 md:pr-4">
      <div className="flex items-center w-full">
        {/* Left: Hamburger (mobile) */}
        <button
          onClick={toggle}
          aria-label="Buka menu sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors md:hidden"
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
            aria-label="Cari transaksi"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors sm:hidden"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Message */}
          <div className="relative" ref={messageDropdownRef}>
            <button
              onClick={() => setShowMessageDropdown((prev) => !prev)}
              aria-label="Pesan"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showMessageDropdown && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <h3 className="text-sm font-bold text-gray-900">Pesan</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentMessages.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-gray-400">Tidak ada pesan</p>
                    </div>
                  ) : (
                    recentMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          markAsRead(msg.id);
                          setShowMessageDropdown(false);
                          router.push("/pesan");
                        }}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          !msg.isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            !msg.isRead
                              ? "bg-[#064e3b] text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {msg.senderAvatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-xs ${
                                !msg.isRead
                                  ? "font-bold text-gray-900"
                                  : "font-medium text-gray-600"
                              } truncate`}
                            >
                              {msg.senderName}
                            </p>
                            {!msg.isRead && (
                              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {msg.subject}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-100 px-4 py-2.5">
                  <Link
                    href="/pesan"
                    onClick={() => setShowMessageDropdown(false)}
                    className="block text-center text-xs font-semibold text-[#064e3b] hover:underline"
                  >
                    Lihat Semua Pesan
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Notification */}
          <button
            aria-label="Notifikasi"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive" />
          </button>

          {/* Account */}
          <Link
            href="/profil"
            aria-label="Profil"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <User className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
