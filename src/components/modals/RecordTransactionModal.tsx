"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, Calendar, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TransactionType = "pengeluaran" | "pemasukan";

const categories = [
  { id: "transportasi", label: "Transportasi", emoji: "" },
  { id: "makanan", label: "Makanan", emoji: "" },
  { id: "layanan", label: "Layanan", emoji: "" },
  { id: "liburan", label: "Liburan", emoji: "" },
  { id: "kuliah", label: "Kuliah", emoji: "" },
];

const paymentMethods = [
  { id: "gopay", label: "Gopay", sublabel: "Aktif", initial: "G", color: "#10B981" },
  { id: "nevbank", label: "NevBank", sublabel: "Primary", initial: "NB", color: "#064E3B" },
  { id: "transfer", label: "Transfer", sublabel: "Bank", initial: "", color: "#6B7280" },
];

export default function RecordTransactionModal({
  isOpen,
  onClose,
}: RecordTransactionModalProps) {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("pengeluaran");
  const [transactionName, setTransactionName] = useState("Ayam Geprek");
  const [selectedCategory, setSelectedCategory] = useState("makanan");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("15.000");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("gopay");
  const [date, setDate] = useState("Kamis, 09:12 | 19-10-2026");
  const [notes, setNotes] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSave = () => {
    // Here you would handle the form submission
    console.log({
      transactionType,
      transactionName,
      selectedCategory,
      quantity,
      price,
      selectedPaymentMethod,
      date,
      notes,
    });
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">
                    Catat Transaksi
                  </h2>
                  <div className="flex h-2 w-2 items-center justify-center rounded-full bg-[#064E3B]">
                    <div className="h-1 w-1 rounded-full bg-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Kelola arus kas & sesuaikan dengan RAB
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Transaction Type */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  JENIS TRANSAKSI
                </span>
                <span className="text-xs text-gray-400">
                  Pilih tipe transaksi
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTransactionType("pengeluaran")}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3.5 transition-all",
                    transactionType === "pengeluaran"
                      ? "border-red-200 bg-red-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      transactionType === "pengeluaran"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        transactionType === "pengeluaran"
                          ? "text-red-600"
                          : "text-gray-500"
                      )}
                    >
                      ↙
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        transactionType === "pengeluaran"
                          ? "text-red-700"
                          : "text-gray-700"
                      )}
                    >
                      Pengeluaran
                    </span>
                    <span className="text-xs text-gray-400">
                      Uang keluar / Biaya
                    </span>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2",
                        transactionType === "pengeluaran"
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300"
                      )}
                    >
                      {transactionType === "pengeluaran" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setTransactionType("pemasukan")}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3.5 transition-all",
                    transactionType === "pemasukan"
                      ? "border-emerald-200 bg-emerald-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      transactionType === "pemasukan"
                        ? "bg-emerald-100"
                        : "bg-gray-100"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        transactionType === "pemasukan"
                          ? "text-emerald-600"
                          : "text-gray-500"
                      )}
                    >
                      ↗
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        transactionType === "pemasukan"
                          ? "text-emerald-700"
                          : "text-gray-700"
                      )}
                    >
                      Pemasukan
                    </span>
                    <span className="text-xs text-gray-400">
                      Uang masuk / Pemasukan
                    </span>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2",
                        transactionType === "pemasukan"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300"
                      )}
                    >
                      {transactionType === "pemasukan" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Transaction Name */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                Nama Transaksi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={transactionName}
                  onChange={(e) => setTransactionName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  placeholder="Masukkan nama transaksi"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-900">
                  Kategori
                </label>
                <button className="text-xs font-semibold text-[#064E3B] hover:underline">
                  + Tambah Baru
                </button>
              </div>

              {/* Category Dropdown */}
              <div className="relative mb-3">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {categories.find((c) => c.id === selectedCategory)?.emoji}
                    </span>
                    <span>
                      {categories.find((c) => c.id === selectedCategory)?.label}{" "}
                      (Food & Beverage)
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                    >
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setShowCategoryDropdown(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="text-base">{category.emoji}</span>
                          <span>{category.label}</span>
                          {selectedCategory === category.id && (
                            <Check className="ml-auto h-4 w-4 text-[#064E3B]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Category Buttons */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                      selectedCategory === category.id
                        ? "bg-[#064E3B] text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                  Jumlah
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                  Harga / Nominal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-gray-900">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                      selectedPaymentMethod === method.id
                        ? "border-[#064E3B] bg-[#064E3B]/5 shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white",
                        selectedPaymentMethod === method.id
                          ? "bg-[#064E3B]"
                          : "bg-gray-200"
                      )}
                    >
                      {method.initial}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        {method.label}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {method.sublabel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                Tanggal & Waktu
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                Catatan Tambahan{" "}
                <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B] resize-none"
                placeholder="Catat keterangan spesifik transaksi..."
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#044A38]"
              >
                <Check className="h-4 w-4" />
                Simpan Transaksi
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
