"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  TransactionRecord,
  CategoryInfo,
  TransactionFormData,
} from "@/features/keuangan/types/keuangan.types";

interface RecordTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionFormData) => Promise<void>;
  initialData?: TransactionRecord | null;
  categories: CategoryInfo[];
}

const paymentMethods = [
  { id: "GOPAY", label: "Gopay", initial: "G", color: "#10B981" },
  { id: "NEVBANK_PRIMARY", label: "NevBank", initial: "NB", color: "#064E3B" },
  { id: "BANK_TRANSFER", label: "Transfer", initial: "TF", color: "#6B7280" },
  { id: "QRIS", label: "QRIS", initial: "QR", color: "#8B5CF6" },
  { id: "OVO", label: "OVO", initial: "O", color: "#6366F1" },
  { id: "DANA", label: "Dana", initial: "D", color: "#3B82F6" },
  { id: "SHOPEEPAY", label: "ShopeePay", initial: "SP", color: "#EF4444" },
  { id: "CASH", label: "Tunai", initial: "C", color: "#64748B" },
];

const defaultAccountOptions = [
  "Tunai",
  "Mandiri",
  "BCA",
  "BRI",
  "BNI",
  "BSI",
  "Jenius",
  "CIMB Niaga",
  "Muamalat",
  "GoPay",
  "OVO",
  "Dana",
  "ShopeePay",
  "LinkAja",
];

function getInitialFormState(initialData?: TransactionRecord | null) {
  if (initialData) {
    return {
      transactionType: initialData.type.toUpperCase() as "PEMASUKAN" | "PENGELUARAN",
      transactionName: initialData.name,
      selectedCategoryId: initialData.categoryId || "",
      quantity: String(initialData.quantity),
      price: String(initialData.amount),
      accountName: initialData.accountName || "",
      selectedPaymentMethod: initialData.paymentMethod,
      date: initialData.date.split("T")[0],
      notes: initialData.notes || "",
    };
  }
  return {
    transactionType: "PENGELUARAN" as const,
    transactionName: "",
    selectedCategoryId: "",
    quantity: "1",
    price: "",
    accountName: "",
    selectedPaymentMethod: "GOPAY",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  };
}

export default function RecordTransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}: RecordTransactionModalProps) {
  const isEditing = !!initialData;

  const [transactionType, setTransactionType] = useState<
    "PEMASUKAN" | "PENGELUARAN"
  >("PENGELUARAN");
  const [transactionName, setTransactionName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("GOPAY");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [accountSearch, setAccountSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const accountInputRef = useRef<HTMLInputElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Populate form when editing
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const formState = getInitialFormState(initialData);
    setTransactionType(formState.transactionType);
    setTransactionName(formState.transactionName);
    setSelectedCategoryId(formState.selectedCategoryId);
    setQuantity(formState.quantity);
    setPrice(formState.price);
    setAccountName(formState.accountName);
    setSelectedPaymentMethod(formState.selectedPaymentMethod);
    setDate(formState.date);
    setNotes(formState.notes);
  }, [initialData, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target as Node)
      ) {
        setShowAccountDropdown(false);
      }
    }
    if (showAccountDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountDropdown]);

  const filteredCategories = categories.filter((c) => {
    if (transactionType === "PEMASUKAN") return c.type === "PEMASUKAN";
    return c.type === "PENGELUARAN";
  });

  const selectedCategory = filteredCategories.find(
    (c) => c.id === selectedCategoryId,
  );

  const filteredAccountOptions = defaultAccountOptions.filter((opt) =>
    opt.toLowerCase().includes(accountSearch.toLowerCase()),
  );

  const handleAccountSelect = (name: string) => {
    setAccountName(name);
    setAccountSearch("");
    setShowAccountDropdown(false);
  };

  const handleSave = async () => {
    if (!transactionName.trim() || !price) return;

    setIsSaving(true);
    try {
      await onSave({
        name: transactionName.trim(),
        type: transactionType,
        amount: parseFloat(price.replace(/\./g, "").replace(",", ".")),
        quantity: parseInt(quantity, 10) || 1,
        accountName: accountName.trim() || null,
        categoryId: selectedCategoryId || null,
        paymentMethod: selectedPaymentMethod,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        notes: notes.trim() || null,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
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
                    {isEditing ? "Edit Transaksi" : "Catat Transaksi"}
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
                disabled={isSaving}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50"
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
                  onClick={() => setTransactionType("PENGELUARAN")}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3.5 transition-all",
                    transactionType === "PENGELUARAN"
                      ? "border-red-200 bg-red-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      transactionType === "PENGELUARAN"
                        ? "bg-red-100"
                        : "bg-gray-100",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        transactionType === "PENGELUARAN"
                          ? "text-red-600"
                          : "text-gray-500",
                      )}
                    >
                      ↙
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        transactionType === "PENGELUARAN"
                          ? "text-red-700"
                          : "text-gray-700",
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
                        transactionType === "PENGELUARAN"
                          ? "border-red-500 bg-red-500"
                          : "border-gray-300",
                      )}
                    >
                      {transactionType === "PENGELUARAN" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setTransactionType("PEMASUKAN")}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3.5 transition-all",
                    transactionType === "PEMASUKAN"
                      ? "border-emerald-200 bg-emerald-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      transactionType === "PEMASUKAN"
                        ? "bg-emerald-100"
                        : "bg-gray-100",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        transactionType === "PEMASUKAN"
                          ? "text-emerald-600"
                          : "text-gray-500",
                      )}
                    >
                      ↗
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        transactionType === "PEMASUKAN"
                          ? "text-emerald-700"
                          : "text-gray-700",
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
                        transactionType === "PEMASUKAN"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300",
                      )}
                    >
                      {transactionType === "PEMASUKAN" && (
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
              <input
                type="text"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                placeholder="Masukkan nama transaksi"
              />
            </div>

            {/* Account Selection - Dropdown + Free Text */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                Akun <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => {
                    setShowAccountDropdown(!showAccountDropdown);
                    setTimeout(() => accountInputRef.current?.focus(), 0);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50"
                >
                  <span>{accountName || "Pilih akun"}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showAccountDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg max-h-64 overflow-y-auto"
                    >
                      {/* Search / Free text input */}
                      <div className="px-2 pb-2">
                        <input
                          ref={accountInputRef}
                          type="text"
                          value={accountSearch}
                          onChange={(e) => setAccountSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && accountSearch.trim()) {
                              handleAccountSelect(accountSearch.trim());
                            }
                          }}
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                          placeholder="Ketik nama akun..."
                        />
                      </div>

                      {/* Clear selection */}
                      {accountName && (
                        <button
                          onClick={() => handleAccountSelect("")}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                        >
                          <span>Hapus pilihan</span>
                        </button>
                      )}

                      {/* Options */}
                      {filteredAccountOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleAccountSelect(opt)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span>{opt}</span>
                          {accountName === opt && (
                            <Check className="ml-auto h-4 w-4 text-[#064E3B]" />
                          )}
                        </button>
                      ))}

                      {/* Custom input option */}
                      {accountSearch.trim() &&
                        !defaultAccountOptions.some(
                          (opt) =>
                            opt.toLowerCase() === accountSearch.toLowerCase(),
                        ) && (
                          <button
                            onClick={() =>
                              handleAccountSelect(accountSearch.trim())
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#064E3B] hover:bg-gray-100"
                          >
                            <span>
                              Gunakan &quot;{accountSearch.trim()}&quot;
                            </span>
                          </button>
                        )}

                      {filteredAccountOptions.length === 0 &&
                        !accountSearch.trim() && (
                          <p className="px-3 py-2 text-sm text-gray-400">
                            Tidak ada opsi
                          </p>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-900">
                  Kategori
                </label>
              </div>

              <div className="relative mb-3">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    {selectedCategory?.icon && (
                      <span className="text-base">{selectedCategory.icon}</span>
                    )}
                    <span>{selectedCategory?.name || "Pilih kategori"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg max-h-48 overflow-y-auto"
                    >
                      <button
                        onClick={() => {
                          setSelectedCategoryId("");
                          setShowCategoryDropdown(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                      >
                        <span>Tanpa kategori</span>
                        {!selectedCategoryId && (
                          <Check className="ml-auto h-4 w-4 text-[#064E3B]" />
                        )}
                      </button>
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setShowCategoryDropdown(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {cat.icon && (
                            <span className="text-base">{cat.icon}</span>
                          )}
                          <span>{cat.name}</span>
                          {selectedCategoryId === cat.id && (
                            <Check className="ml-auto h-4 w-4 text-[#064E3B]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                  Jumlah
                </label>
                <input
                  type="number"
                  min="1"
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
                    // 1. Mengubah tampilan angka menjadi format ribuan dengan titik (.)
                    value={price ? parseInt(price).toLocaleString("id-ID") : ""}
                    // 2. Membersihkan titik/huruf saat diketik, lalu simpan angka bersihnya ke state
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      setPrice(raw);
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-gray-900">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-4 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                      selectedPaymentMethod === method.id
                        ? "border-[#064E3B] bg-[#064E3B]/5 shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                        selectedPaymentMethod === method.id
                          ? "bg-[#064E3B]"
                          : "bg-gray-200",
                      )}
                    >
                      {method.initial}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700">
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-gray-900">
                Tanggal
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
                <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                disabled={isSaving}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !transactionName.trim() || !price}
                className="flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#044A38] disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {isEditing ? "Update Transaksi" : "Simpan Transaksi"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
