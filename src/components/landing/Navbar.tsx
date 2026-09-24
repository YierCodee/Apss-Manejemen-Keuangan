"use client";

import { Settings, MessageSquare, Bell } from "lucide-react";
import { DS, btnPrimary } from "./theme";
import FinaroLogo from "@/components/shared/FinaroLogo";

export type NavActive = "beranda" | "tentang-kami" | "kontak-kami";

const NAV_ITEMS: { label: string; key: NavActive; href: string }[] = [
  { label: "Beranda", key: "beranda", href: "/" },
  { label: "Tentang Kami", key: "tentang-kami", href: "/tentang-kami" },
  { label: "Kontak Kami", key: "kontak-kami", href: "/kontak-kami" },
];

export default function Navbar({ active }: { active: NavActive }) {
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
          <a href="/" className="flex items-center">
            <FinaroLogo height={36} />
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
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
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2">
              {[Settings, MessageSquare, Bell].map((Icon, i) => (
                <button
                  key={i}
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
            <a
              href="/login"
              className="px-4 py-2 transition-colors"
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
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}