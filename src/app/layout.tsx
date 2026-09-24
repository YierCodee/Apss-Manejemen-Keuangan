import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Finaro — Financial Hub for Student Founders",
  description: "Kelola uang bulanan, anggaran kuliah, dan pos pengeluaran dalam satu tempat. Dirancang khusus untuk mahasiswa dan kampus.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>{children}</body>
    </html>
  );
}
