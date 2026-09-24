"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RabFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Priority = "on-track" | "high" | "medium" | "low";

interface CategoryOption {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

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

function getCurrentQuarter(): string {
  const now = new Date();
  const q = Math.ceil((now.getMonth() + 1) / 3);
  return `Kuartal ${q} (Q${q}) ${now.getFullYear()}`;
}

const quarterOptions = (() => {
  const now = new Date();
  const year = now.getFullYear();
  return [
    { id: `Kuartal 1 (Q1) ${year}`, label: `Q1 ${year}`, sublabel: `Jan - Mar ${year}` },
    { id: `Kuartal 2 (Q2) ${year}`, label: `Q2 ${year}`, sublabel: `Apr - Jun ${year}` },
    { id: `Kuartal 3 (Q3) ${year}`, label: `Q3 ${year}`, sublabel: `Jul - Sep ${year}` },
    { id: `Kuartal 4 (Q4) ${year}`, label: `Q4 ${year}`, sublabel: `Okt - Des ${year}` },
  ];
})();

export default function RabFormModal({ isOpen, onClose }: RabFormModalProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter);
  const [posName, setPosName] = useState("");
  const [specs, setSpecs] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("on-track");
  const [quantity, setQuantity] = useState("10");
  const [targetProgress, setTargetProgress] = useState("83");
  const [pricePerUnit, setPricePerUnit] = useState("50000");
  const [notes, setNotes] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    }
    if (showCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategoryDropdown]);

  // Fetch categories from API on mount
  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/keuangan/categories?type=PENGELUARAN")
      .then((res) => res.json())
      .then((data: CategoryOption[]) => {
        setCategories(data);
        // Auto-select first category if none selected
        if (data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(data[0].id);
        }
      })
      .catch(() => {
        // Fallback: categories will be empty, user can use custom
        setCategories([]);
      });
  }, [isOpen, selectedCategoryId]);

  const totalPagu = useMemo(() => {
    const qty = parseInt(quantity) || 0;
    const price = parseInt(pricePerUnit) || 0;
    return qty * price;
  }, [quantity, pricePerUnit]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        quarter: selectedQuarter,
        posName,
        specs: specs || undefined,
        priority: selectedPriority,
        quantity: parseInt(quantity) || 0,
        targetProgress: parseInt(targetProgress) || 0,
        pricePerUnit: parseInt(pricePerUnit) || 0,
        notes: notes || undefined,
      };

      // Send categoryId (UUID) or customCategory (new name to create)
      if (showCustomCategory && customCategory.trim()) {
        payload.customCategory = customCategory.trim();
      } else if (selectedCategoryId) {
        payload.categoryId = selectedCategoryId;
      }

      const res = await fetch("/api/rab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan pos anggaran");
      }

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setShowCustomCategory(false);
    setSelectedQuarter(getCurrentQuarter());
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
            className="fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-gray-200 bg-white shadow-xl max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Scrollable Content */}
            <div className="overflow-y-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Header */}
              <div className="mb-5 sm:mb-6 flex items-start justify-between">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#064e3b]">
                      <span className="text-xs font-bold text-white">R</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      Buat Pos Anggaran Baru
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Tambahkan pos alokasi belanja baru ke dalam perencanaan
                    anggaran RAB ({quarterOptions.find(q => q.id === selectedQuarter)?.label || selectedQuarter})
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Kuartal */}
              <div className="mb-5">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                  KUARTAL ANGGARAN <span className="text-red-500">*</span>
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {quarterOptions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuarter(q.id)}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-xl border-2 p-3 transition-all",
                        selectedQuarter === q.id
                          ? "border-[#064e3b] bg-[#064e3b]/5 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-bold",
                          selectedQuarter === q.id
                            ? "text-[#064e3b]"
                            : "text-gray-700"
                        )}
                      >
                        {q.label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {q.sublabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kategori Anggaran — Dynamic from API */}
              <div className="mb-5">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-900">
                  KATEGORI ANGGARAN
                </span>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {selectedCategoryId && !showCustomCategory ? (
                        (() => {
                          const cat = categories.find(c => c.id === selectedCategoryId);
                          return cat ? (
                            <>
                              {cat.icon && <span className="text-base">{cat.icon}</span>}
                              <span>{cat.name}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">Pilih kategori</span>
                          );
                        })()
                      ) : showCustomCategory ? (
                        <span className="text-gray-700">
                          {customCategory || "Kategori baru..."}
                        </span>
                      ) : (
                        <span className="text-gray-400">Pilih kategori</span>
                      )}
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", showCategoryDropdown && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      >
                        {/* No category */}
                        <button
                          onClick={() => {
                            setSelectedCategoryId(null);
                            setShowCustomCategory(false);
                            setShowCategoryDropdown(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                        >
                          <span>Tanpa kategori</span>
                          {!selectedCategoryId && !showCustomCategory && (
                            <Check className="ml-auto h-4 w-4 text-[#064e3b]" />
                          )}
                        </button>

                        {/* Category options */}
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategoryId(cat.id);
                              setShowCustomCategory(false);
                              setShowCategoryDropdown(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {cat.icon && <span className="text-base">{cat.icon}</span>}
                            <span>{cat.name}</span>
                            {selectedCategoryId === cat.id && !showCustomCategory && (
                              <Check className="ml-auto h-4 w-4 text-[#064e3b]" />
                            )}
                          </button>
                        ))}

                        {/* Custom category option */}
                        <button
                          onClick={() => {
                            setShowCustomCategory(true);
                            setSelectedCategoryId(null);
                            setShowCategoryDropdown(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            showCustomCategory
                              ? "bg-[#064e3b]/5 text-[#064e3b]"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <span>+ Kategori Lain</span>
                          {showCustomCategory && (
                            <Check className="ml-auto h-4 w-4 text-[#064e3b]" />
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Custom category input */}
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {priorities.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPriority(p.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl border-2 p-2.5 sm:p-3 transition-all",
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

              {/* Jumlah & Target Progress */}
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              {/* Estimasi Biaya & Total Pagu */}
              <div className="mb-5 flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                <div className="flex flex-col items-start sm:items-end justify-start sm:justify-end">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Total Pagu Pos Anggaran
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#064e3b]">
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {error ? (
                  <span className="text-red-500 font-medium">{error}</span>
                ) : (
                  <>
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>Perubahan langsung memperbarui rekap realisasi</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSaving}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 w-full sm:w-auto"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#064e3b] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#044a38] disabled:opacity-50 w-full sm:w-auto"
                >
                  <Check className="h-4 w-4" />
                  {isSaving ? "Menyimpan..." : "Simpan Pos Anggaran"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
