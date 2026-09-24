import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Kami — Serkwu UMPO",
  description:
    "Hubungi kami untuk masukan, pesanan produk, atau koordinasi tim. Kami sangat terbuka untuk setiap komunikasi. Terima kasih atas dukungan Anda terhadap karya kewirausahaan mahasiswa UMPO.",
};

export default function KontakKamiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
