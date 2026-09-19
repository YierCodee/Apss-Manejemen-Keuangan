"use client";

import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  Calculator,
  PiggyBank,
  TrendingDown,
  Shield,
  Target,
  Zap,
  FileText,
  Download,
  Search,
  Settings,
  Bell,
  MessageSquare,
} from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3">
            <div className="bg-emerald-900 rounded-xl w-9 h-9 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-lg leading-[28px]">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 text-base font-extrabold tracking-[-0.45px] leading-[22.5px]">NevBank</span>
              <span className="text-slate-400 text-[10px] font-bold tracking-[0.5px] uppercase leading-[15px]">Financial Hub</span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Beranda", active: true },
              { label: "Fitur", active: false },
              { label: "Perbandingan", active: false },
              { label: "FAQ", active: false },
            ].map((item) => (
              <a
                key={item.label}
                href="#"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-emerald-900 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Icons - hidden on mobile, show on md+ */}
            <div className="hidden md:flex items-center gap-2">
              <button className="p-[9px] rounded-xl hover:bg-slate-100 transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-[9px] rounded-xl hover:bg-slate-100 transition-colors relative">
                <MessageSquare className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-[9px] rounded-xl hover:bg-slate-100 transition-colors relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-[8px] right-[8px] bg-rose-500 rounded-full size-2 border-2 border-white" />
              </button>
            </div>
            <a
              href="#"
              className="bg-emerald-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-950 transition-colors"
            >
              Masuk
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-black">
      <Navbar />
      {/* ===== HERO SECTION ===== */}
      <motion.section
        className="relative bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 flex flex-col items-center gap-6 md:gap-8">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 md:px-4 py-1.5 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-emerald-800 text-[10px] md:text-xs font-semibold tracking-wider uppercase">
              🎓 NevBank Edu • Atur Uang Saku, Biaya Kuliah & RAB Praktikum Tanpa Stres
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            className="text-center max-w-[896px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-1.5px] text-slate-900 leading-tight md:leading-[60px] mb-0">
              <p>Kelola Uang Bulanan, Anggaran</p>
              <p>Kuliah, & Pos Pengeluaran</p>
              <p>
                <span className="text-emerald-800 underline decoration-emerald-400 decoration-2 decoration-wavy underline-offset-4">
                  dalam Satu Tempat
                </span>
              </p>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.div
            className="text-center max-w-[672px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-base md:text-lg text-slate-600 leading-relaxed md:leading-[28px]">
              Bukan sekadar pencatat uang jajan biasa. NevBank membantu mahasiswa mengontrol pagu bulanan, mengunci alokasi dana praktikum & UKT, serta memantau saldo e-wallet agar terhindar dari sindrom krisis akhir bulan.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center pt-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="#"
              className="bg-emerald-800 text-white rounded-xl px-6 sm:px-7 py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-colors w-full sm:w-auto"
            >
              <span className="font-semibold text-sm leading-[20px]">Daftar Gratis Mahasiswa (Selamanya)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="bg-white border border-slate-200 text-slate-800 rounded-xl px-6 sm:px-7 py-3.5 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto"
            >
              <span className="font-semibold text-sm leading-[20px]">Coba Demo Simulasi Uang Saku</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Feature Indicators */}
          <motion.div
            className="flex flex-wrap gap-4 md:gap-8 items-center justify-center pt-4 md:pt-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-medium">15.000+ Mahasiswa se-Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-medium">Terhubung Gopay, QRIS, & Mutasi Bank</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-medium">100% Bebas Iklan & Terenkripsi</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview Cards */}
        <div className="max-w-[1024px] mx-auto px-4 md:px-6 lg:px-8 pb-8 md:pb-16">
          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            {/* Top bar */}
            <div className="bg-white/70 backdrop-blur border-b border-slate-100 px-4 md:px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-800 rounded-lg w-7 h-7 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Ruang Keuangan Mahasiswa</div>
                  <div className="text-[11px] text-slate-500">Semester Genap 2025/2026 • Periode Berjalan</div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">Bulan Ini: Maret 2025</span>
                <button className="bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" />
                  Catat Transaksi
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pagu Uang Saku */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">PAGU UANG SAKU BULANAN</span>
                  <div className="w-6 h-6 rounded-md bg-emerald-800/10 flex items-center justify-center">
                    <PiggyBank className="w-3.5 h-3.5 text-emerald-800" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-[-0.6px]">Rp 2.500.000</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-medium px-2 py-0.5 rounded">Kirim dari Orang Tua / Gaji</span>
                  <span className="text-[12px] text-slate-500">100% Pagu</span>
                </div>
              </div>

              {/* Pengeluaran Realisasi */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">PENGELUARAN REALISASI</span>
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-[-0.6px]">Rp 1.450.000</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-medium px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Serapan 58% (Aman)
                  </span>
                  <span className="text-[12px] text-slate-500">Hari ke-18</span>
                </div>
              </div>

              {/* Sisa Saldo */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">SISA SALDO & DANA KUNCI</span>
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-800 tracking-[-0.6px]">Rp 1.050.000</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[12px] text-slate-600">Terkunci: UKT & Kost</span>
                  <span className="text-emerald-700 text-[12px] font-bold">Tersisa 42%</span>
                </div>
              </div>
            </div>

            {/* Transaction Table Preview */}
            <div className="bg-white border-t border-slate-100 px-4 md:px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-slate-800">Rencana Anggaran Biaya (RAB) Mahasiswa</div>
                  <div className="text-[11px] text-slate-500">Pengawasan pos bulanan agar tidak over-budget</div>
                </div>
                <span className="text-emerald-800 text-[12px] font-semibold flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh Rekap XLS</span>
                </span>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-5 gap-2 text-[12px] text-slate-400 font-bold border-b border-slate-100 pb-2">
                    <span>Pos Pengeluaran</span>
                    <span>Kategori</span>
                    <span>Pagu</span>
                    <span>Realisasi</span>
                    <span className="text-right">Status</span>
                  </div>
                  {[
                    { name: "Makan & Minum Harian", cat: "Makanan", pagu: "Rp 900.000", realisasi: "Rp 620.000", status: "Terkendali", statusColor: "emerald" },
                    { name: "Alat Lab & Modul Cetak", cat: "Kuliah", pagu: "Rp 500.000", realisasi: "Rp 450.000", status: "Capai 90%", statusColor: "amber" },
                    { name: "Bensin Motor & Parkir", cat: "Transport", pagu: "Rp 250.000", realisasi: "Rp 180.000", status: "On-Track", statusColor: "emerald" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 text-[12px] py-2.5 border-b border-slate-50 items-center">
                      <span className="font-semibold text-slate-800">{row.name}</span>
                      <span className="text-slate-600">{row.cat}</span>
                      <span className="text-slate-600">{row.pagu}</span>
                      <span className="font-semibold text-slate-800">{row.realisasi}</span>
                      <span className={`bg-${row.statusColor}-50 text-${row.statusColor}-700 border border-${row.statusColor}-200 text-[10px] font-bold px-2 py-0.5 rounded text-right`}>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== PARTNERS SECTION ===== */}
      <motion.section
        className="bg-white border-b border-slate-100 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-slate-400 text-[12px] font-semibold uppercase tracking-wider">KOMPATIBEL DAN TERHUBUNG MULUS DENGAN REKENING & E-WALLET ANDALAN MAHASISWA</span>
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-12 flex-wrap">
            {[
              { name: "Bank Central Asia (BCA)", color: "bg-blue-600" },
              { name: "Bank Mandiri", color: "bg-blue-800" },
              { name: "Bank BNI", color: "bg-orange-600" },
              { name: "Bank BRI", color: "bg-blue-700" },
              { name: "Standar QRIS Nasional", color: "bg-emerald-500" },
              { name: "GoPay", color: "bg-teal-600" },
              { name: "OVO", color: "bg-purple-600" },
              { name: "ShopeePay", color: "bg-orange-500" },
            ].map((partner, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`${partner.color} rounded-full w-2.5 h-2.5`} />
                <span className="text-slate-600 text-xs sm:text-sm font-semibold">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== FEATURES SECTION ===== */}
      <motion.section
        className="bg-slate-50 border-b border-slate-200/80 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-[768px] mx-auto mb-8 md:mb-12">
            <div className="inline-flex items-center bg-emerald-50 rounded-full px-3 py-1 mb-4">
              <span className="text-emerald-800 text-[12px] font-bold uppercase tracking-wider">FITUR SPESIFIK MAHASISWA</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-[-0.9px] mb-4 leading-tight md:leading-[40px]">
              <p>Bukan Aplikasi Keuangan Perusahaan yang</p>
              <p>Rumit. Ini Didesain Khusus untuk Ritme</p>
              <p className="text-emerald-800">Kampus.</p>
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed md:leading-[24px]">
              Dari pembagian uang saku warteg, biaya patungan tugas lab, sampai urusan kas bendahara himpunan mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm flex flex-col">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-emerald-800" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 leading-[28px]">Sistem RAB Anti-Boncos</h3>
              <p className="text-slate-600 text-sm leading-[22.75px] mb-6">
                Bagi uang saku bulanan ke pos-pos pasti: Makan, Kost, Praktikum, dan Liburan. Saat pos makan harian menipis, NevBank memberi tanda bahaya sebelum uang kos terpakai.
              </p>
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 text-xs font-medium">Peringatan dini otomatis di serapan 80%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 text-xs font-medium">Kunci dana UKT/Semesteran anti utak-atik</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm flex flex-col">
              <div className="bg-teal-50 border border-teal-200 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 leading-[28px]">Catat Transaksi Cepat (&lt; 5 Detik)</h3>
              <p className="text-slate-600 text-sm leading-[22.75px] mb-6">
                Tidak ada form berbelit-belit. Preset siap pakai untuk Ayam Geprek, bensin motor, cetak proposal skripsi, atau langganan AI tools dengan tag pembayaran langsung.
              </p>
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 text-xs font-medium">Pilihan sekali tap kategori makanan & transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 text-xs font-medium">Upload foto struk atau mutasi bank otomatis</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm flex flex-col">
              <div className="bg-purple-50 border border-purple-200 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 leading-[28px]">Kas Panitia & Kas Kelompok</h3>
              <p className="text-slate-600 text-sm leading-[22.75px] mb-6">
                Menjadi bendahara himpunan (BEM), kepanitiaan ospek, atau patungan sewa studio jadi transparan. Anggota kelompok bisa memantau sisa saldo bersama secara real-time.
              </p>
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 text-xs font-medium">Ekspor Laporan Pertanggungjawaban (LPJ) PDF/XLS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 text-xs font-medium">Tautan publik view-only transparan untuk mahasiswa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== COMPARISON SECTION ===== */}
      <motion.section
        className="bg-slate-50 border-b border-slate-200/80 py-8 md:py-16 px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center max-w-[672px] mx-auto mb-8 md:mb-10">
            <div className="inline-flex items-center bg-emerald-50 rounded-full px-3 py-1 mb-4">
              <span className="text-emerald-800 text-[12px] font-bold uppercase tracking-wider">PERBANDINGAN NYATA</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-[-0.75px] mb-4 leading-tight md:leading-[36px]">
              Cara Konvensional vs NevBank Mahasiswa
            </h2>
            <p className="text-slate-600 text-sm leading-[20px]">
              Lihat mengapa mencatat di buku catatan atau lembar spreadsheet Excel sering terbengkalai setelah minggu pertama.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Mobile: Card layout */}
            <div className="md:hidden divide-y divide-slate-100">
              {[
                {
                  name: "Kecepatan Mencatat",
                  con: "Lambat, harus buka rumus dan ketik manual di laptop",
                  nb: "Kilat (<5 detik) dari smartphone",
                },
                {
                  name: "Pemisahan Dana UKT & Jajan",
                  con: "Bercampur aduk di satu rekening, uang lab rentan terpakai",
                  nb: "Sistem RAB mengunci alokasi wajib",
                },
                {
                  name: "Peringatan Serapan Uang",
                  con: "Tidak ada notifikasi, baru sadar saat saldo ATM habis",
                  nb: "Notifikasi dini batas 80% per kategori",
                },
                {
                  name: "Laporan Kas Kepanitiaan/BEM",
                  con: "Harus susun nota fisik satu-satu untuk bendahara",
                  nb: "1-Klik cetak format LPJ PDF & Excel",
                },
              ].map((row, i) => (
                <div key={i} className="p-4 space-y-2">
                  <span className="text-slate-800 text-sm font-semibold">{row.name}</span>
                  <div className="flex items-start gap-2 text-slate-500 text-xs">
                    <span className="shrink-0 mt-0.5">Konvensional:</span>
                    <span>{row.con}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="text-emerald-800 text-xs font-bold">{row.nb}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-slate-50/80 border-b border-slate-200">
                <div className="p-5">
                  <span className="text-slate-700 text-sm font-bold">Kebutuhan Mahasiswa</span>
                </div>
                <div className="p-5">
                  <span className="text-slate-500 text-sm font-bold">Buku Catatan / Excel / Notes HP</span>
                </div>
                <div className="bg-emerald-50/70 border-l border-emerald-200 p-5">
                  <span className="text-emerald-900 text-sm font-bold">NevBank Edisi Mahasiswa</span>
                </div>
              </div>

              {/* Table Rows */}
              {[
                {
                  name: "Kecepatan Mencatat",
                  con: ["Lambat, harus buka rumus dan ketik", "manual di laptop"],
                  nb: "Kilat (<5 detik) dari smartphone",
                  nbColor: "emerald"
                },
                {
                  name: "Pemisahan Dana UKT & Jajan",
                  con: ["Bercampur aduk di satu rekening, uang lab", "rentan terpakai"],
                  nb: "Sistem RAB mengunci alokasi wajib",
                  nbColor: "emerald"
                },
                {
                  name: "Peringatan Serapan Uang",
                  con: ["Tidak ada notifikasi, baru sadar saat saldo", "ATM habis"],
                  nb: "Notifikasi dini batas 80% per kategori",
                  nbColor: "emerald"
                },
                {
                  name: "Laporan Kas Kepanitiaan/BEM",
                  con: ["Harus susun nota fisik satu-satu untuk", "bendahara"],
                  nb: "1-Klik cetak format LPJ PDF & Excel",
                  nbColor: "emerald"
                },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-t border-slate-100 ${i > 0 ? "" : ""}`}>
                  <div className="p-5">
                    <span className="text-slate-800 text-sm font-semibold">{row.name}</span>
                  </div>
                  <div className="p-5">
                    {row.con.map((line, j) => (
                      <p key={j} className="text-slate-500 text-sm leading-[20px]">{line}</p>
                    ))}
                  </div>
                  <div className={`bg-${row.nbColor}-50/30 border-l border-emerald-200 p-5`}>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-emerald-800 text-sm font-bold">{row.nb}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== FAQ SECTION ===== */}
      <motion.section
        className="bg-white border-b border-slate-200 py-8 md:py-16 px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <div className="max-w-[896px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-[-0.75px] mb-3 leading-tight md:leading-[36px]">
              Pertanyaan yang Sering Diajukan Mahasiswa
            </h2>
            <p className="text-slate-500 text-sm">Hal-hal mendasar tentang keamanan rekening, email kampus, dan fitur gratis.</p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: "Apakah NevBank benar-benar gratis untuk mahasiswa?",
                a: "Ya. Paket Mahasiswa Basic 100% gratis selamanya tanpa memerlukan kartu kredit. Anda dapat mengatur hingga 6 pos anggaran bulanan dan menghubungkan rekening utama serta e-wallet secara cuma-cuma."
              },
              {
                q: "Bagaimana jika kampus saya belum memberikan email berekstensi .ac.id?",
                a: "Jangan khawatir! Anda tetap bisa mengklaim paket mahasiswa dengan mengunggah foto Kartu Tanda Mahasiswa (KTM) aktif atau bukti registrasi semester berjalan dari portal akademik kampus Anda."
              },
              {
                q: "Apakah aman menyambungkan dompet e-wallet & rekening bank?",
                a: "Sangat aman. NevBank beroperasi menggunakan protokol enkripsi perbankan 256-bit TLS grade institusi. NevBank hanya memiliki akses \"Read-Only\" untuk membaca mutasi transaksi masuk dan keluar, serta TIDAK MEMILIKI otorisasi untuk melakukan pendebetan, transfer keluar, atau penarikan uang Anda."
              },
              {
                q: "Bisakah digunakan untuk mengelola dana kepanitiaan bersama teman satu kelompok?",
                a: "Bisa. Anda bisa membuat ruang buku kas terpisah khusus untuk proyek atau kepanitiaan, lalu mengundang teman sekelompok untuk melihat alur pengeluaran secara real-time."
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5.5 flex flex-col gap-1.5">
                <h4 className="text-sm font-bold text-slate-900">{item.q}</h4>
                <p className="text-[12px] text-slate-600 leading-[19.5px]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== DEEP DIVE SECTION (CTA) ===== */}
      <motion.section
        className="bg-emerald-800 py-12 md:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
      >
        <div className="max-w-[1024px] mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-[-0.75px] mb-4">
            Siap Mengambil Kendali Keuangan Kuliahmu?
          </h2>
          <p className="text-emerald-200 text-base md:text-lg mb-6 md:mb-8 max-w-[672px] mx-auto">
            Bergabung dengan 15.000+ mahasiswa yang sudah mengelola uang mereka dengan lebih cerdas menggunakan NevBank.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-emerald-900 font-semibold rounded-xl px-8 py-4 hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20"
          >
            Daftar Gratis Sekarang
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </motion.section>
    </div>
  );
}
