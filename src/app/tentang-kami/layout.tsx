import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — Serkwu UMPO",
  description:
    "Kami adalah kelompok mahasiswa Universitas Muhammadiyah Ponorogo (UMPO) yang sedang menempuh program Sertifikasi Kewirausahaan (Serkwu). Platform internal ini dibangun secara mandiri untuk mengelola seluruh dokumen, portofolio, dan laporan perkembangan bisnis kelompok.",
};

export default function TentangKamiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}