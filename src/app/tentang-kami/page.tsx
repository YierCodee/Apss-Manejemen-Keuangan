"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  FileText,
  Users,
  Target,
  BookOpenCheck,
} from "lucide-react";
import {
  DS,
  btnPrimary,
  sectionLabel,
  fadeUp,
  staggerContainer,
} from "@/components/landing/theme";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

/* ─── Data ─── */
const STATS = [
  { value: "8+", label: "Anggota Kelompok", sub: "Aktif mengerjakan Serkwu" },
  { value: "12", label: "Dokumen Terunggah", sub: "Lengkap dalam satu ruang" },
  { value: "5", label: "Milestone Tercapai", sub: "Dari 6 tahapan Sertifikasi" },
  { value: "UMPO 2025", label: "Periode Sertifikasi", sub: "Universitas Muhammadiyah Ponorogo" },
];

const VALUES = [
  {
    icon: FileText,
    title: "Dokumentasi Terpadu",
    desc: "Semua dokumen Serkwu — proposal, bukti kegiatan, laporan, dan berkas administrasi — berada dalam satu ruang terstruktur. Tidak lagi tersebar di folder pribadi atau chat grup.",
  },
  {
    icon: Users,
    title: "Kolaborasi Real-time",
    desc: "Setiap anggota kelompok bisa mengakses, mengedit, dan berkontribusi secara bersamaan. Pembagian tugas, revisi dokumen, dan koordinasi jadwal menjadi transparan dan terukur.",
  },
  {
    icon: Target,
    title: "Monitoring Berkala",
    desc: "Dashboard memantau perkembangan setiap tahapan Sertifikasi Kewirausahaan. Tim pembina dapat melihat progres dan memberikan umpan balik langsung sebelum deadline.",
  },
  {
    icon: ShieldCheck,
    title: "Standar Kompetensi Terpenuhi",
    desc: "Semua berkas dan bukti kegiatan diverifikasi sesuai rubrik kompetensi yang dipersyaratkan. Kami memastikan setiap dokumen memenuhi standar yang ditetapkan.",
  },
];

const MILESTONES = [
  {
    year: "Semester 5",
    period: "Perencanaan",
    title: "Pembentukan Kelompok & Perencanaan",
    desc: "Delapan mahasiswa Universitas Muhammadiyah Ponorogo bergabung untuk membentuk kelompok kewirausahaan. Kami menyusun rancangan awal, membagi peran, dan menetapkan timeline pelaksanaan Sertifikasi Kewirausahaan.",
  },
  {
    year: "Semester 6",
    period: "Documentasi & Implementasi",
    title: "Eksekusi Proyek & Dokumentasi",
    desc: "Kami menjalankan proyek kewirausahaan sesuai rencana — dari analisis pasar, penyusunan business plan, hingga pelaksanaan operasional. Seluruh proses didokumentasikan secara berkala sebagai bukti kegiatan.",
  },
  {
    year: "Semester 6",
    period: "Revisi & Konsolidasi",
    title: "Revisi Dokumen & Konsolidasi Berkas",
    desc: "Berdasarkan umpan balik dari pembina, kami merevisi seluruh dokumen administrasi. Laporan keuangan, bukti kegiatan, dan portofolio dikonsolidasikan ke dalam satu platform terpusat.",
  },
  {
    year: "Sekarang",
    period: "Finalisasi & Serah Terima",
    title: "Finalisasi & Menuju Sertifikasi",
    desc: "Dokumen final siap diverifikasi. Kami telah memenuhi seluruh persyaratan administrasi dan kompetensi yang dipersyaratkan. Platform ini — dibangun sendiri oleh mahasiswa — menjadi bukti komitmen kami.",
  },
];

const TEAM = [
  { initials: "AR", role: "Ketua Kelompok", name: "Andi Rizki" },
  { initials: "DS", role: "Sekretaris & Dokumentasi", name: "Dita Safitri" },
  { initials: "BP", role: "Koordinator Keuangan", name: "Budi Pratama" },
  { initials: "LA", role: "Koordinator Proyek", name: "Lela Amalia" },
  { initials: "FR", role: "Public Relation", name: "Fajar Ramadhan" },
  { initials: "NK", role: "Koordinator Administrasi", name: "Nina Kusuma" },
  { initials: "AZ", role: "Teknis & Platform", name: "Ahmad Zamzami" },
  { initials: "SM", role: "Koordinator Monitoring", name: "Siti Mutia" },
];

/* ─── Hero ─── */
function AboutHero() {
  return (
    <section
      className="relative"
      style={{
        background: `linear-gradient(180deg, ${DS.colors.surfaceContainerLow} 0%, ${DS.colors.surface} 45%, ${DS.colors.surface} 100%)`,
        borderBottom: `1px solid ${DS.colors.border}`,
      }}
    >
      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(${DS.colors.primaryContainer} 1px, transparent 1px),
            linear-gradient(90deg, ${DS.colors.primaryContainer} 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 pt-10 md:pt-14 lg:pt-16 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 flex flex-col gap-5 md:gap-6">
            <motion.div
               className="inline-flex items-center gap-2 self-start"
               style={{ ...sectionLabel }}
               variants={fadeUp}
               initial="hidden"
               animate="visible"
               custom={0}
             >
               <ShieldCheck className="w-3.5 h-3.5" style={{ color: DS.colors.primaryContainer }} />
               <span
                 className="text-[10px] md:text-xs font-bold uppercase tracking-wider"
                 style={{ color: DS.colors.primaryContainer }}
               >
                 Tentang Kami
               </span>
             </motion.div>

             <motion.h1
               className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight md:leading-[56px]"
               style={{ color: DS.colors.onSurface, letterSpacing: "-0.03em" }}
               variants={fadeUp}
               initial="hidden"
               animate="visible"
               custom={1}
             >
               Platform internal untuk{" "}
               <span
                 className="underline decoration-2 decoration-wavy underline-offset-4"
                 style={{
                   color: DS.colors.primaryContainer,
                   textDecorationColor: DS.colors.onPrimaryContainer,
                 }}
               >
                 mengelola Sertifikasi
               </span>{" "}
               Kewirausahaan
             </motion.h1>

             <motion.p
               className="text-base md:text-lg leading-relaxed md:leading-[28px] max-w-[540px]"
               style={{ color: DS.colors.onSurfaceVariant }}
               variants={fadeUp}
               initial="hidden"
               animate="visible"
               custom={2}
             >
               <strong>Tentang Kami</strong> — Kami adalah kelompok mahasiswa Universitas Muhammadiyah Ponorogo (UMPO) yang saat ini sedang menempuh program Sertifikasi Kewirausahaan (Serkwu). Platform internal ini kami bangun secara mandiri sebagai wadah terintegrasi untuk mengelola seluruh dokumen, portofolio, dan laporan perkembangan bisnis kelompok. Melalui ruang digital ini, kami berkomitmen untuk mendokumentasikan setiap tahapan usaha secara transparan dan akuntabel guna memenuhi standar kompetensi yang dipersyaratkan.
             </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3.5"
                style={btnPrimary}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = DS.colors.tertiaryContainer;
                  e.currentTarget.style.boxShadow = DS.shadow.level2;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = DS.colors.primaryContainer;
                  e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(6,78,59,0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>Masuk ke Platform</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Platform manifesto panel */}
          <motion.div
            className="lg:col-span-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <div
              className="p-5 md:p-6"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: "1.5rem",
                boxShadow: DS.shadow.level3,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#fecaca" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#fde68a" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DS.colors.positiveBorder }} />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: DS.colors.outline }}
                >
                  Platform Serkwu UMPO
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Dokumentasi terpusat — proposal, laporan, berkas", dot: DS.colors.positive },
                  { label: "Dibangun oleh mahasiswa UMPO, untuk mahasiswa UMPO", dot: DS.colors.primaryContainer },
                  { label: "Memenuhi standar kompetensi Sertifikasi Kewirausahaan", dot: DS.colors.onPrimaryContainer },
                  { label: "Monitoring progres & koordinasi real-time", dot: DS.colors.positive },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5"
                    style={{
                      backgroundColor: i % 2 === 0 ? DS.colors.surfaceContainerLow : DS.colors.surface,
                      borderRadius: "0.75rem",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
                    <span className="text-[13px] font-medium" style={{ color: DS.colors.onSurface }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 pt-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${DS.colors.surfaceContainerLow}` }}
              >
                <span className="text-[11px]" style={{ color: DS.colors.outline }}>
                  Status kelompok
                </span>
                <span
                  className="text-[13px] font-extrabold"
                  style={{ color: DS.colors.primaryContainer }}
                >
                  Proses Sertifikasi
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Misi & Visi ─── */
function MissionSection() {
  return (
    <section
      className="py-14 md:py-20"
      style={{
        backgroundColor: DS.colors.surface,
        borderBottom: `1px solid ${DS.colors.border}`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <motion.div
            className="lg:col-span-5 flex flex-col gap-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
          >
            <div
              className="inline-flex items-center self-start"
              style={{ ...sectionLabel, backgroundColor: DS.colors.positiveBg, border: `1px solid ${DS.colors.positiveBorder}` }}
            >
              <span
                className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: DS.colors.primaryContainer }}
              >
                Visi & Misi
              </span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-extrabold leading-tight md:leading-[40px]"
              style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}
            >
              Satu tujuan: lulus Sertifikasi dengan{" "}
              <span style={{ color: DS.colors.primaryContainer }}>proses yang terukur</span>
            </h2>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            {[
              "Sertifikasi Kewirausahaan menuntut setiap kelompok untuk mendokumentasikan seluruh proses kewirausahaan secara komprehensif — dari perencanaan, eksekusi, hingga pertanggungjawaban. Tanpa disiplin dokumentasi, standar kompetensi sulit dipenuhi.",
              "Kami menyadari bahwa mahasiswa sering kehilangan jejak kegiatan: file tersebar di berbagai folder, bukti kegiatan terlupakan, dan laporan belum terkonsolidasi sebelum deadline. Platform ini hadir untuk menghilangkan masalah itu.",
              "Visi kami sederhana: setiap anggota kelompok UMPO mampu menunjukkan proses kewirausahaan yang terdokumentasi dengan baik, terukur, dan sesuai standar kompetensi — bukan sekadar hasil akhir, tapi bagaimana kami sampai di sana.",
            ].map((text, i) => (
              <motion.p
                key={i}
                className="text-[15px] leading-[26px]"
                style={{ color: DS.colors.onSurfaceVariant }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i + 1}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Fitur Platform ─── */
function FeatureSection() {
  const features = [
    {
      icon: FileText,
      title: "Dokumentasi Terpusat",
      desc: "Semua dokumen Serkwu — proposal, bukti kegiatan, laporan, dan berkas administrasi — berada dalam satu ruang terstruktur. Tidak lagi tersebar di folder pribadi atau chat grup.",
      checks: [
        "Proposal, bukti kegiatan, dan laporan terstruktur",
        "Akses terbatas per peran anggota",
      ],
      iconBg: DS.colors.surfaceContainer,
      iconColor: DS.colors.primaryContainer,
    },
    {
      icon: BookOpenCheck,
      title: "Monitoring Progres Real-time",
      desc: "Dashboard memantau perkembangan setiap tahapan Sertifikasi Kewirausahaan. Tim pembina dapat melihat progres dan memberikan umpan balik langsung sebelum deadline.",
      checks: [
        "Dashboard visual setiap tahapan",
        "Notifikasi deadline mendekat",
      ],
      iconBg: DS.colors.positiveBg,
      iconColor: DS.colors.positive,
    },
    {
      icon: Users,
      title: "Koordinasi Kelompok",
      desc: "Pembagian tugas, revisi dokumen, dan koordinasi jadwal menjadi transparan dan terukur. Setiap anggota bisa berkontribusi secara bersamaan.",
      checks: [
        "Pembagian tugas transparan",
        "Revisi dokumen kolektif",
      ],
      iconBg: DS.colors.surfaceContainerHigh,
      iconColor: DS.colors.tertiaryContainer,
    },
  ];

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: DS.colors.surfaceContainerLow,
        borderBottom: `1px solid ${DS.colors.border}`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-[768px] mx-auto mb-8 md:mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{ ...sectionLabel, backgroundColor: DS.colors.positiveBg, border: `1px solid ${DS.colors.positiveBorder}` }}
          >
            <span
              className="text-[12px] font-bold uppercase tracking-wider"
              style={{ color: DS.colors.primaryContainer }}
            >
              Fitur Platform
            </span>
          </div>
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 leading-tight md:leading-[40px]"
            style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}
          >
            Dibangun untuk kebutuhan Serkwu yang nyata
          </h2>
          <p className="text-base" style={{ color: DS.colors.onSurfaceVariant }}>
            Setiap fitur hadir untuk mengatasi masalah spesifik yang kami temui dalam mengerjakan Sertifikasi Kewirausahaan.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map((feat, i) => (
            <motion.div
              key={i}
              className="p-7 flex flex-col"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: "1.5rem",
                boxShadow: DS.shadow.level1,
              }}
              variants={fadeUp}
              custom={i}
              whileHover={{ boxShadow: DS.shadow.level2, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center mb-4"
                style={{
                  backgroundColor: feat.iconBg,
                  border: `1px solid ${DS.colors.border}`,
                  borderRadius: "0.75rem",
                }}
              >
                <feat.icon className="w-5 h-5" style={{ color: feat.iconColor }} />
              </div>
              <h3 className="text-lg font-bold mb-3 leading-[28px]" style={{ color: DS.colors.onSurface }}>
                {feat.title}
              </h3>
              <p className="text-sm leading-[22.75px] mb-6" style={{ color: DS.colors.onSurfaceVariant }}>
                {feat.desc}
              </p>
              <div
                className="pt-4 flex flex-col gap-2.5"
                style={{ borderTop: `1px solid ${DS.colors.surfaceContainerLow}` }}
              >
                {feat.checks.map((check, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" style={{ color: DS.colors.positive }} />
                    <span className="text-xs font-medium" style={{ color: DS.colors.onSurfaceVariant }}>
                      {check}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Statistik ─── */
function StatsSection() {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: DS.colors.primaryContainer }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden"
          style={{ borderRadius: "1.5rem" }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="p-6 md:p-8 flex flex-col gap-1"
              style={{ backgroundColor: DS.colors.primaryContainer }}
              variants={fadeUp}
            >
              <span
                className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em]"
                style={{
                  color: DS.colors.secondaryContainer,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-white">{stat.label}</span>
              <span className="text-xs" style={{ color: DS.colors.onPrimaryContainer }}>
                {stat.sub}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Nilai ─── */
function ValuesSection() {
  return (
    <section
      className="py-14 md:py-20"
      style={{
        backgroundColor: DS.colors.surface,
        borderBottom: `1px solid ${DS.colors.border}`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-[672px] mx-auto mb-10 md:mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div
            className="inline-flex items-center mb-4"
            style={{ ...sectionLabel, backgroundColor: DS.colors.positiveBg, border: `1px solid ${DS.colors.positiveBorder}` }}
          >
            <span
              className="text-[12px] font-bold uppercase tracking-wider"
              style={{ color: DS.colors.primaryContainer }}
            >
              Prinsip Kerja Kami
            </span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight md:leading-[40px]"
            style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}
          >
            Bagaimana kami membangun platform ini
          </h2>
          <p className="text-base" style={{ color: DS.colors.onSurfaceVariant }}>
            Setiap keputusan platform — fitur, struktur dokumen, workflow monitoring — didasari oleh empat prinsip ini.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {VALUES.map((value, i) => (
            <motion.div
              key={i}
              className="p-6 flex flex-col"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: "1.25rem",
                boxShadow: DS.shadow.level1,
              }}
              variants={fadeUp}
              whileHover={{ boxShadow: DS.shadow.level2, y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center mb-4"
                style={{
                  backgroundColor: DS.colors.positiveBg,
                  border: `1px solid ${DS.colors.positiveBorder}`,
                  borderRadius: "0.75rem",
                }}
              >
                <value.icon className="w-5 h-5" style={{ color: DS.colors.positive }} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: DS.colors.onSurface }}>
                {value.title}
              </h3>
              <p className="text-[13px] leading-[19px]" style={{ color: DS.colors.onSurfaceVariant }}>
                {value.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Tim ─── */
function TeamSection() {
  return (
    <section
      className="py-14 md:py-20"
      style={{
        backgroundColor: DS.colors.surfaceContainerLow,
        borderBottom: `1px solid ${DS.colors.border}`,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 md:mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div
            className="inline-flex items-center mb-4"
            style={{ ...sectionLabel }}
          >
            <Users className="w-3.5 h-3.5 mr-1.5" style={{ color: DS.colors.primaryContainer }} />
            <span
              className="text-[12px] font-bold uppercase tracking-wider"
              style={{ color: DS.colors.primaryContainer }}
            >
              Anggota Kelompok
            </span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight md:leading-[40px]"
            style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}
          >
            Delapan mahasiswa, satu komitmen
          </h2>
          <p className="text-base" style={{ color: DS.colors.onSurfaceVariant }}>
            Setiap anggota memiliki peran spesifik dalam menjalankan dan mendokumentasikan proyek kewirausahaan kelompok.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {TEAM.map((member, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-3 p-5"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: "1.25rem",
                boxShadow: DS.shadow.level1,
              }}
              variants={fadeUp}
              whileHover={{ boxShadow: DS.shadow.level2, y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-lg"
                style={{
                  backgroundColor: i % 2 === 0 ? DS.colors.primaryContainer : DS.colors.surfaceContainer,
                  color: i % 2 === 0 ? DS.colors.onPrimary : DS.colors.primaryContainer,
                }}
              >
                {member.initials}
              </div>
              <div className="text-center">
                <div className="text-sm font-bold" style={{ color: DS.colors.onSurface }}>
                  {member.name}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: DS.colors.outline }}>
                  {member.role}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Timeline ─── */
function TimelineSection() {
  return (
    <section
      className="py-14 md:py-20"
      style={{ backgroundColor: DS.colors.surface }}
    >
      <div className="max-w-[896px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 md:mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div
            className="inline-flex items-center mb-4"
            style={{ ...sectionLabel }}
          >
            <BookOpenCheck className="w-3.5 h-3.5 mr-1.5" style={{ color: DS.colors.primaryContainer }} />
            <span
              className="text-[12px] font-bold uppercase tracking-wider"
              style={{ color: DS.colors.primaryContainer }}
            >
              Proses Serifikasi
            </span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight md:leading-[40px]"
            style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}
          >
            Dari rencana menuju sertifikasi
          </h2>
          <p className="text-base" style={{ color: DS.colors.onSurfaceVariant }}>
            Setiap tahapan didokumentasikan secara berkala di platform ini untuk memastikan kelengkapan administrasi.
          </p>
        </motion.div>

        <div className="relative">
          {/* Track line */}
          <div
            className="absolute left-[19px] top-2 bottom-2 w-[2px] hidden sm:block"
            style={{ backgroundColor: DS.colors.surfaceContainerHigh }}
          />
          <div
            className="absolute left-[19px] top-2 w-[2px]"
            style={{
              height: "75%",
              background: `linear-gradient(180deg, ${DS.colors.positive} 0%, ${DS.colors.positiveBorder} 100%)`,
            }}
          />

          <motion.div
            className="flex flex-col gap-8 md:gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {MILESTONES.map((m, i) => (
              <motion.div key={i} className="relative flex gap-5 sm:gap-8" variants={fadeUp}>
                {/* Numbered circle badge */}
                <div
                  className="relative z-10 w-10 h-10 shrink-0 flex items-center justify-center rounded-full font-bold"
                  style={{
                    backgroundColor: i === MILESTONES.length - 1 ? DS.colors.primaryContainer : DS.colors.surfaceContainerLowest,
                    color: i === MILESTONES.length - 1 ? DS.colors.onPrimary : DS.colors.primaryContainer,
                    border: `2px solid ${i === MILESTONES.length - 1 ? DS.colors.primaryContainer : DS.colors.positiveBorder}`,
                    boxShadow: DS.shadow.level2,
                  }}
                >
                  <span className="text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className="flex-1 p-5 md:p-6"
                  style={{
                    backgroundColor: DS.colors.surfaceContainerLowest,
                    border: `1px solid ${DS.colors.border}`,
                    borderRadius: "1.25rem",
                    boxShadow: DS.shadow.level1,
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-extrabold" style={{ color: DS.colors.primaryContainer }}>
                      {m.year}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: DS.colors.positiveBg,
                        color: DS.colors.positive,
                        border: `1px solid ${DS.colors.positiveBorder}`,
                      }}
                    >
                      {m.period}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-1.5" style={{ color: DS.colors.onSurface }}>
                    {m.title}
                  </h3>
                  <p className="text-[13px] leading-[20px]" style={{ color: DS.colors.onSurfaceVariant }}>
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  return (
    <motion.section
      className="py-12 md:py-20"
      style={{ backgroundColor: DS.colors.primaryContainer }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      <div className="max-w-[1024px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight md:leading-[36px]"
          style={{ letterSpacing: "-0.02em" }}
          variants={fadeUp}
        >
          Platform ini adalah karya kami
        </motion.h2>
        <motion.p
          className="text-base md:text-lg mb-6 md:mb-8 max-w-[672px] mx-auto"
          style={{ color: DS.colors.onPrimaryContainer }}
          variants={fadeUp}
        >
          Dibangun dari nol oleh mahasiswa UMPO. Bukan produk komersial — ini adalah bukti bahwa kami
          mampu memenuhi standar kompetensi kewirausahaan dengan disiplin dan kerja sama.
        </motion.p>
        <motion.a
          href="/"
          className="inline-flex items-center gap-2 font-semibold px-8 py-4"
          style={{
            backgroundColor: DS.colors.surfaceContainerLowest,
            color: DS.colors.primaryContainer,
            borderRadius: "1rem",
            boxShadow: DS.shadow.level3,
          }}
          whileHover={{ boxShadow: DS.shadow.level2, y: -1 }}
          variants={fadeUp}
        >
          Masuk ke Platform Serkwu
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
    </motion.section>
  );
}

/* ─── Page ─── */
export default function TentangKamiPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: DS.colors.surface }}>
      <Navbar active="tentang-kami" />
      <AboutHero />
      <MissionSection />
      <StatsSection />
      <ValuesSection />
      <TeamSection />
      <TimelineSection />
      <CTASection />
      <Footer />
    </div>
  );
}