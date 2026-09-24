"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Clock,
  Send,
  Phone,
  MessageSquare,
  Globe,
  Code,
  Radio,
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
const TEAM = [
  { initials: "AR", role: "Ketua Kelompok", name: "Andi Rizki", email: "andi.rizki@mail.um-po.ac.id" },
  { initials: "DS", role: "Sekretaris & Dokumentasi", name: "Dita Safitri", email: "dita.safitri@mail.um-po.ac.id" },
  { initials: "BP", role: "Koordinator Keuangan", name: "Budi Pratama", email: "budi.pratama@mail.um-po.ac.id" },
  { initials: "LA", role: "Koordinator Proyek", name: "Lela Amalia", email: "lela.amalia@mail.um-po.ac.id" },
  { initials: "FR", role: "Public Relation", name: "Fajar Ramadhan", email: "fajar.ramadhan@mail.um-po.ac.id" },
  { initials: "NK", role: "Koordinator Administrasi", name: "Nina Kusuma", email: "nina.kusuma@mail.um-po.ac.id" },
  { initials: "AZ", role: "Teknis & Platform", name: "Ahmad Zamzami", email: "ahmad.zamzami@mail.um-po.ac.id" },
  { initials: "SM", role: "Koordinator Monitoring", name: "Siti Mutia", email: "siti.mutia@mail.um-po.ac.id" },
];

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "serkwu.umpo@mail.um-po.ac.id",
    sub: "Balasan maksimal 2 x 24 jam",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    sub: "Senin–Jumat, 08.00–16.00 WIB",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: "Universitas Muhammadiyah Ponorogo",
    sub: "Jl. Raya Poso KM. 10, Ponorogo, Jawa Timur",
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Senin–Jumat",
    sub: "08.00–16.00 WIB (Hari Libur Nasional kecuali)",
  },
];

const SOCIAL_LINKS = [
  { icon: Globe, label: "GitHub", href: "#" },
  { icon: Code, label: "LinkedIn", href: "#" },
  { icon: Radio, label: "Instagram", href: "#" },
];

/* ─── Hero Section ─── */
function ContactHero() {
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
        <motion.div
          className="text-center max-w-[768px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="inline-flex items-center gap-2 mb-6" style={{ ...sectionLabel }}>
            <MessageSquare className="w-3.5 h-3.5" style={{ color: DS.colors.primaryContainer }} />
            <span
              className="text-[10px] md:text-xs font-bold uppercase tracking-wider"
              style={{ color: DS.colors.primaryContainer }}
            >
              Kontak Kami
            </span>
          </div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight md:leading-[56px] mb-6"
            style={{ color: DS.colors.onSurface, letterSpacing: "-0.03em" }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Kami siap mendengarkan{" "}
            <span
              className="underline decoration-2 decoration-wavy underline-offset-4"
              style={{
                color: DS.colors.primaryContainer,
                textDecorationColor: DS.colors.onPrimaryContainer,
              }}
            >
              cerita Anda
            </span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg leading-relaxed md:leading-[28px] max-w-[640px] mx-auto mb-4"
            style={{ color: DS.colors.onSurfaceVariant }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Sebagai bagian dari pemenuhan Sertifikasi Kewirausahaan (Serkwu) oleh mahasiswa UMPO, kami hadir dengan menyediakan beberapa varian produk berkualitas yang siap memenuhi kebutuhan Anda.
          </motion.p>

          <motion.p
            className="text-base md:text-lg leading-relaxed md:leading-[28px] max-w-[640px] mx-auto mb-8"
            style={{ color: DS.colors.onSurfaceVariant }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            Kami sangat terbuka untuk setiap masukan, pesanan produk, maupun koordinasi tim. Jangan ragu untuk menghubungi perwakilan kelompok kami melalui kontak resmi yang tertera di halaman ini. Terima kasih atas dukungan Anda terhadap karya kewirausahaan mahasiswa.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Contact Info Cards ─── */
function ContactInfoSection() {
  return (
    <section
      className="py-14 md:py-20"
      style={{ backgroundColor: DS.colors.surfaceContainerLow, borderBottom: `1px solid ${DS.colors.border}` }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-[672px] mx-auto mb-10 md:mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="inline-flex items-center mb-4" style={{ ...sectionLabel, backgroundColor: DS.colors.positiveBg, border: `1px solid ${DS.colors.positiveBorder}` }}>
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: DS.colors.primaryContainer }}>
              Hubungi Kami
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight md:leading-[40px]" style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}>
            Berbagai cara untuk menjangkau kami
          </h2>
          <p className="text-base" style={{ color: DS.colors.onSurfaceVariant }}>
            Pilih metode komunikasi yang paling nyaman bagi Anda. Kami menjamin setiap pesan akan kami tanggapi dengan serius.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {CONTACT_INFO.map((info, i) => (
            <motion.div
              key={i}
              className="p-6 flex flex-col gap-4"
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
                className="w-11 h-11 flex items-center justify-center"
                style={{ backgroundColor: DS.colors.positiveBg, border: `1px solid ${DS.colors.positiveBorder}`, borderRadius: "0.75rem" }}
              >
                <info.icon className="w-5 h-5" style={{ color: DS.colors.positive }} />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: DS.colors.outline }}>
                  {info.label}
                </div>
                <div className="text-sm font-bold leading-[20px]" style={{ color: DS.colors.onSurface }}>
                  {info.value}
                </div>
                <div className="text-[12px] mt-1" style={{ color: DS.colors.outline }}>
                  {info.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Contact Form ─── */
function ContactFormSection() {
  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: DS.colors.surface, borderBottom: `1px solid ${DS.colors.border}` }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left: Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="inline-flex items-center gap-2 mb-4" style={{ ...sectionLabel }}>
              <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: DS.colors.primaryContainer }}>
                Kirim Pesan
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight md:leading-[40px]" style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}>
              Bentuk pesan Anda
            </h2>
            <p className="text-base mb-8" style={{ color: DS.colors.onSurfaceVariant }}>
              Isi formulir di bawah ini dan kami akan segera merespons. Setiap pesan kami baca dengan serius.
            </p>

            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold" style={{ color: DS.colors.onSurface }}>Nama</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap Anda"
                    className="w-full px-4 py-3.5 rounded-xl text-sm transition-colors outline-none"
                    style={{
                      backgroundColor: DS.colors.surfaceContainerLow,
                      border: `1px solid ${DS.colors.border}`,
                      color: DS.colors.onSurface,
                    }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.primaryContainer)}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.border)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold" style={{ color: DS.colors.onSurface }}>Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3.5 rounded-xl text-sm transition-colors outline-none"
                    style={{
                      backgroundColor: DS.colors.surfaceContainerLow,
                      border: `1px solid ${DS.colors.border}`,
                      color: DS.colors.onSurface,
                    }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.primaryContainer)}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.border)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: DS.colors.onSurface }}>Subjek</label>
                <input
                  type="text"
                  placeholder="Apa tema pesan Anda?"
                  className="w-full px-4 py-3.5 rounded-xl text-sm transition-colors outline-none"
                  style={{
                    backgroundColor: DS.colors.surfaceContainerLow,
                    border: `1px solid ${DS.colors.border}`,
                    color: DS.colors.onSurface,
                  }}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.primaryContainer)}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.border)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: DS.colors.onSurface }}>Pesan</label>
                <textarea
                  placeholder="Tulis pesan Anda di sini..."
                  rows={5}
                  className="w-full px-4 py-3.5 rounded-xl text-sm transition-colors outline-none resize-none"
                  style={{
                    backgroundColor: DS.colors.surfaceContainerLow,
                    border: `1px solid ${DS.colors.border}`,
                    color: DS.colors.onSurface,
                  }}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.primaryContainer)}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = DS.colors.border)}
                />
              </div>

              <motion.button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5"
                style={btnPrimary}
                whileHover={{ boxShadow: DS.shadow.level2, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Kirim Pesan</span>
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>

          {/* Right: Info panel */}
          <motion.div
            className="flex flex-col gap-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
          >
            {/* What we accept */}
            <div
              className="p-6 md:p-7 flex flex-col gap-4"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: "1.5rem",
                boxShadow: DS.shadow.level1,
              }}
            >
              <h3 className="text-lg font-bold" style={{ color: DS.colors.onSurface }}>
                Kami menerima
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Masukan & saran produk", icon: Check },
                  { label: "Pesanan produk custom", icon: Check },
                  { label: "Koordinasi tim & proyek", icon: Check },
                  { label: "Kerja sama & kemitraan", icon: Check },
                  { label: "Pertanyaan administrasi Serkwu", icon: Check },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 shrink-0" style={{ color: DS.colors.positive }} />
                    <span className="text-sm" style={{ color: DS.colors.onSurfaceVariant }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social media */}
            <div
              className="p-6 md:p-7"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: "1.5rem",
                boxShadow: DS.shadow.level1,
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: DS.colors.onSurface }}>
                Ikuti kami
              </h3>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    className="w-11 h-11 flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: DS.colors.surfaceContainer,
                      borderRadius: "0.75rem",
                    }}
                    whileHover={{ scale: 1.08, backgroundColor: DS.colors.primaryContainer }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = DS.colors.primaryContainer;
                      e.currentTarget.style.boxShadow = DS.shadow.level2;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = DS.colors.surfaceContainer;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <social.icon className="w-5 h-5" style={{ color: DS.colors.onSurfaceVariant }} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Urgency note */}
            <div
              className="p-5 flex items-start gap-3"
              style={{
                backgroundColor: DS.colors.positiveBg,
                border: `1px solid ${DS.colors.positiveBorder}`,
                borderRadius: "1rem",
              }}
            >
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: DS.colors.positive }} />
              <span className="text-sm leading-[20px]" style={{ color: DS.colors.onSurfaceVariant }}>
                Responsif dalam 2 x 24 jam kerja. Untuk pertanyaan mendesak, hubungi langsung via WhatsApp.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Team Representatives ─── */
function TeamSection() {
  return (
    <section
      className="py-14 md:py-20"
      style={{ backgroundColor: DS.colors.surface, borderBottom: `1px solid ${DS.colors.border}` }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-[672px] mx-auto mb-10 md:mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="inline-flex items-center gap-2 mb-4" style={{ ...sectionLabel }}>
            <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: DS.colors.primaryContainer }}>
              Perwakilan Kelompok
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight md:leading-[40px]" style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}>
            Kenali tim yang bisa Anda hubungi
          </h2>
          <p className="text-base" style={{ color: DS.colors.onSurfaceVariant }}>
            Setiap perwakilan memiliki peran spesifik. Pilih kontak yang paling relevan dengan kebutuhan Anda.
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
            <motion.a
              key={i}
              href={`mailto:${member.email}`}
              className="flex flex-col items-center gap-3 p-5 transition-all"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
                borderRadius: "1.25rem",
                boxShadow: DS.shadow.level1,
              }}
              variants={fadeUp}
              whileHover={{ boxShadow: DS.shadow.level2, y: -3 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = DS.colors.primaryContainer;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = DS.colors.border;
              }}
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
                <div className="text-[11px] mt-0.5" style={{ color: DS.colors.primaryContainer }}>
                  {member.role}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
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
          Jangan ragu untuk menghubungi kami
        </motion.h2>
        <motion.p
          className="text-base md:text-lg mb-6 md:mb-8 max-w-[672px] mx-auto"
          style={{ color: DS.colors.onPrimaryContainer }}
          variants={fadeUp}
        >
          Setiap masukan dan kerjasama adalah dukungan berharga bagi karya kewirausahaan mahasiswa UMPO. Kami siap mendengarkan Anda.
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

/* ─── Main Page ─── */
export default function KontakKamiPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: DS.colors.surface }}>
      <Navbar active="kontak-kami" />
      <ContactHero />
      <ContactInfoSection />
      <ContactFormSection />
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  );
}
