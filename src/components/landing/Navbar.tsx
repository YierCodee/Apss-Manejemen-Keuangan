"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Settings, MessageSquare, Bell, Menu, X } from "lucide-react";
import { DS, btnPrimary } from "./theme";
import FinaroLogo from "@/components/shared/FinaroLogo";

export type NavActive = "beranda" | "tentang-kami" | "kontak-kami";

const NAV_ITEMS: { label: string; key: NavActive; href: string }[] = [
  { label: "Beranda", key: "beranda", href: "/" },
  { label: "Tentang Kami", key: "tentang-kami", href: "/tentang-kami" },
  { label: "Kontak Kami", key: "kontak-kami", href: "/kontak-kami" },
];

const ACTION_ICONS = [Settings, MessageSquare, Bell];

export default function Navbar({ active }: { active: NavActive }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeMenu]);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(250,248,255,0.85)",
        borderBottom: `1px solid ${DS.colors.border}`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <FinaroLogo height={36} />
          </Link>

          {/* Nav Links (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  borderRadius: "0.75rem",
                  backgroundColor: active === item.key ? DS.colors.primaryContainer : "transparent",
                  color: active === item.key ? DS.colors.onPrimary : DS.colors.onSurfaceVariant,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2">
              {ACTION_ICONS.map((Icon, i) => (
                <button
                  key={i}
                  aria-label={["Pengaturan", "Pesan", "Notifikasi"][i]}
                  className="p-[9px] transition-colors relative"
                  style={{ borderRadius: "0.75rem" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = DS.colors.surfaceContainer)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Icon className="w-5 h-5" style={{ color: DS.colors.onSurfaceVariant }} />
                  {i === 2 && (
                    <span
                      className="absolute top-[8px] right-[8px] rounded-full size-2 border-2"
                      style={{ backgroundColor: DS.colors.error, borderColor: DS.colors.surfaceContainerLowest }}
                    />
                  )}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="hidden sm:inline-block px-4 py-2 transition-colors"
              style={btnPrimary}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = DS.colors.tertiaryContainer;
                e.currentTarget.style.boxShadow = DS.shadow.level2;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = DS.colors.primaryContainer;
                e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(6,78,59,0.25)";
              }}
            >
              Masuk
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              className="md:hidden flex h-10 w-10 items-center justify-center transition-colors"
              style={{
                borderRadius: "0.75rem",
                backgroundColor: isOpen ? DS.colors.surfaceContainer : "transparent",
                color: DS.colors.onSurfaceVariant,
              }}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div
          id="mobile-menu"
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isOpen ? 420 : 0,
            opacity: isOpen ? 1 : 0,
          }}
          inert={!isOpen ? true : undefined}
        >
          <nav
            className="flex flex-col gap-1 pt-2 pb-4"
            aria-label="Navigasi mobile"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMenu}
                className="px-4 py-3 text-sm font-medium transition-colors"
                style={{
                  borderRadius: "0.75rem",
                  backgroundColor: active === item.key ? DS.colors.surfaceContainer : "transparent",
                  color: active === item.key ? DS.colors.primary : DS.colors.onSurfaceVariant,
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Action icons row */}
            <div
              className="flex items-center gap-2 mt-2 pt-3"
              style={{ borderTop: `1px solid ${DS.colors.border}` }}
            >
              {ACTION_ICONS.map((Icon, i) => (
                <button
                  key={i}
                  onClick={closeMenu}
                  aria-label={["Pengaturan", "Pesan", "Notifikasi"][i]}
                  className="p-3 transition-colors relative"
                  style={{
                    borderRadius: "0.75rem",
                    backgroundColor: DS.colors.surfaceContainerLow,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: DS.colors.onSurfaceVariant }} />
                  {i === 2 && (
                    <span
                      className="absolute top-[10px] right-[10px] rounded-full size-2 border-2"
                      style={{
                        backgroundColor: DS.colors.error,
                        borderColor: DS.colors.surfaceContainerLow,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/login"
              onClick={closeMenu}
              className="mt-3 block w-full px-4 py-3 text-center transition-colors"
              style={btnPrimary}
            >
              Masuk
            </Link>
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10 bg-black/20 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
