"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RabFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Priority = "on-track" | "high" | "medium" | "low";

const categories = [
  { id: "kuliah", label: "Kuliah" },
  { id: "biaya-hidup", label: "Biaya Hidup" },
  { id: "operasional", label: "Operasional" },
  { id: "praktikum", label: "Praktikum & Laboratorium" },
];

const priorities: {
  id: Priority;
  label: string;
  sublabel: string;
  dotColor: string;
  activeBorder: string;
  activeBg: string;
  activeText: string;
}[] = [
  {
    id: "on-track",
    label: "OnTrack",
    sublabel: "Terencana",
    dotColor: "bg-emerald-500",
    activeBorder: "border-emerald-300",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-700",
  },
  {
    id: "high",
    label: "Tinggi (High)",
    sublabel: "Urgen",
    dotColor: "bg-rose-500",
    activeBorder: "border-rose-300",
    activeBg: "bg-rose-50",
    activeText: "text-rose-700",
  },
  {
    id: "medium",
    label: "Medium",
    sublabel: "Standar",
    dotColor: "bg-amber-500",
    activeBorder: "border-amber-300",
    activeBg: "bg-amber-50",
    activeText: "text-amber-700",
  },
  {
    id: "low",
    label: "Rendah",
    sublabel: "Opsional",
    dotColor: "bg-gray-400",
    activeBorder: "border-gray-300",
    activeBg: "bg-gray-50",
    activeText: "text-gray-600",
  },
];

const quarterOptions = [
  "Kuartal 1 (Q1) 2024",
  "Kuartal 2 (Q2) 2024",
  "Kuartal 3 (Q3) 2024",
  "Kuartal 4 (Q4) 2024",
];

export default function RabFormModal({ isOpen, onClose }: RabFormModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("kuliah");
  const [posName, setPosName] = useState("");
  const [specs, setSpecs] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("on-track");
  const [quantity, setQuantity] = useState("10");
  const [targetProgress, setTargetProgress] = useState("83");
  const [selectedQuarter, setSelectedQuarter] = useState("Kuartal 4 (Q4) 2024");
  const [pricePerUnit, setPricePerUnit] = useState("50000");
  const [notes, setNotes] = useState("");
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const totalPagu = useMemo(() => {
    const qty = parseInt(quantity) || 0;
    const price = parseInt(pricePerUnit) || 0;
    return qty * price;
  }, [quantity, pricePerUnit]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID");
  };

  const handleSave = () => {
    console.log({
      category: selectedCategory,
      customCategory,
      posName,
      specs,
      priority: selectedPriority,
      quantity,
      targetProgress,
      quarter: selectedQuarter,
      pricePerUnit,
      totalPagu,
      notes,
    });
    onClose();
  };

  const handleClose = () => {
    setShowQuarterDropdown(false);
    setShowCustomCategory(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 flex w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-gray-200 bg-white shadow-xl max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 pt-6 pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#064e3b]">
                      <span className="text-xs font-bold text-white">R</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Buat Pos Anggaran Baru
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    Tambahkan pos alokasi belanja baru ke dalam perencanaan
                    anggaran RAB (Kuartal 4 – 2024)
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Kategori Anggaran */}
              <div className="mb-5">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                  KATEGORI ANGGARAN
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                        selectedCategory === cat.id
                          ? "bg-[#064e3b] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomCategory(!showCustomCategory)}
                    className="rounded-full border border-dashed border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  >
                    + Kategori Lain
                  </button>
                </div>
                <AnimatePresence>
                  {showCustomCategory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Masukkan nama kategori baru..."
                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nama Pos / Nama Barang */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                  NAMA POS / NAMA BARANG <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={posName}
                  onChange={(e) => setPosName(e.target.value)}
                  placeholder="Alat Praktikum"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
                />
              </div>

              {/* Rincian Spesifikasi */}
              <div className="mb-5">
                <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                  Rincian Spesifikasi / Sub-item
                </label>
                <input
                  type="text"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  placeholder="Kertas HVS, Bolpoin, Binder Notes"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Ditampilkan sebagai catatan spesifikasi di bawah nama barang
                  tabel RAB
                </p>
              </div>

              {/* Tingkat Prioritas */}
              <div className="mb-5">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                  TINGKAT PRIORITAS (STATUS) <span className="text-red-500">*</span>
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {priorities.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPriority(p.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all",
                        selectedPriority === p.id
                          ? cn(p.activeBorder, p.activeBg, "shadow-sm")
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      )}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          p.dotColor
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          selectedPriority === p.id
                            ? p.activeText
                            : "text-gray-700"
                        )}
                      >
                        {p.label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {p.sublabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah, Target Progress, Alokasi Kuartal */}
              <div className="mb-5 grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                    JUMLAH (UNIT) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 transition-colors focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      Qty
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                    TARGET PROGRESS (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={targetProgress}
                      onChange={(e) => setTargetProgress(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 transition-colors focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      %
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                    ALOKASI KUARTAL
                  </label>
                  <button
                    onClick={() =>
                      setShowQuarterDropdown(!showQuarterDropdown)
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    <span className="truncate">{selectedQuarter}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                  </button>
                  <AnimatePresence>
                    {showQuarterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
                      >
                        {quarterOptions.map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setSelectedQuarter(q);
                              setShowQuarterDropdown(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                              selectedQuarter === q
                                ? "bg-[#064e3b]/5 font-medium text-[#064e3b]"
                                : "text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            <span>{q}</span>
                            {selectedQuarter === q && (
                              <Check className="h-4 w-4 text-[#064e3b]" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Estimasi Biaya & Total Pagu */}
              <div className="mb-5 flex gap-4">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                    Estimasi Biaya per Unit
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={
                        pricePerUnit
                          ? parseInt(pricePerUnit).toLocaleString("id-ID")
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setPricePerUnit(raw);
                      }}
                      placeholder="50.000"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end justify-end">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Total Pagu Pos Anggaran
                  </span>
                  <span className="text-2xl font-extrabold tracking-tight text-[#064e3b]">
                    Rp {formatCurrency(totalPagu)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Dihitung otomatis dari {quantity || 0} Unit × Rp{" "}
                    {formatCurrency(parseInt(pricePerUnit) || 0)}
                  </span>
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="mb-2">
                <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                  Catatan Tambahan & Sumber Kas{" "}
                  <span className="font-normal text-gray-400">(Opsional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Tambahkan informasi akun/rekening sumber, PIC, atau tautan persetujuan..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#064e3b] focus:outline-none focus:ring-1 focus:ring-[#064e3b]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Info className="h-3.5 w-3.5" />
                <span>Perubahan langsung memperbarui rekap realisasi</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-xl bg-[#064e3b] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#044a38]"
                >
                  <Check className="h-4 w-4" />
                  Simpan Pos Anggaran
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
