import { DS } from "./theme";

const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Kontak Kami", href: "/kontak-kami" },
];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: DS.colors.primaryContainer,
        borderTop: `1px solid ${DS.colors.onPrimaryContainer}`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                borderRadius: "0.75rem",
              }}
            >
              <span className="text-base font-extrabold" style={{ color: DS.colors.primaryContainer }}>
                N
              </span>
            </div>
            <div>
              <div className="text-base font-extrabold text-white tracking-[-0.45px]">Serkwu UMPO</div>
              <div className="text-[11px]" style={{ color: DS.colors.onPrimaryContainer }}>
                Platform Sertifikasi Kewirausahaan — Universitas Muhammadiyah Ponorogo
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: DS.colors.onPrimaryContainer }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          style={{ borderTop: `1px solid ${DS.colors.onPrimaryContainer}` }}
        >
          <span className="text-xs" style={{ color: DS.colors.onPrimaryContainer }}>
            © 2026 Serkwu UMPO. Hak cipta dilindungi.
          </span>
          <span className="text-xs" style={{ color: DS.colors.onPrimaryContainer }}>
            Platform Sertifikasi Kewirausahaan Internal UMPO
          </span>
        </div>
      </div>
    </footer>
  );
}