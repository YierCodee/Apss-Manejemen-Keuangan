"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, Calendar, Loader2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  TransactionRecord,
  CategoryInfo,
  TransactionFormData,
} from "@/features/keuangan/types/keuangan.types";

interface RabItemOption {
  id: string;
  name: string;
  totalBudget: number;
  realization: number;
  projectName: string;
  projectId: string;
}

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
      selectedRabItemId: initialData.rabItemId || "",
      selectedRabSyncMode: initialData.rabSyncMode || "none",
      quantity: String(initialData.quantity),
      price: String(Math.round(initialData.pricePerUnit ?? initialData.amount)),
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
    selectedRabItemId: "",
    selectedRabSyncMode: "none" as const,
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
  const [selectedRabItemId, setSelectedRabItemId] = useState<string>("");
  const [selectedRabSyncMode, setSelectedRabSyncMode] = useState<"auto" | "manual" | "none">("none");
  const [rabItemOptions, setRabItemOptions] = useState<RabItemOption[]>([]);
  const [loadingRabItems, setLoadingRabItems] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("GOPAY");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRabItemDropdown, setShowRabItemDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [accountSearch, setAccountSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const accountInputRef = useRef<HTMLInputElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const rabItemDropdownRef = useRef<HTMLDivElement>(null);

  // Populate form when editing
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const formState = getInitialFormState(initialData);
    setTransactionType(formState.transactionType);
    setTransactionName(formState.transactionName);
    setSelectedCategoryId(formState.selectedCategoryId);
    setSelectedRabItemId(formState.selectedRabItemId);
    setSelectedRabSyncMode(formState.selectedRabSyncMode);
    setQuantity(formState.quantity);
    setPrice(formState.price);
    setAccountName(formState.accountName);
    setSelectedPaymentMethod(formState.selectedPaymentMethod);
    setDate(formState.date);
    setNotes(formState.notes);
    setSaveError(null);
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
      if (
        rabItemDropdownRef.current &&
        !rabItemDropdownRef.current.contains(e.target as Node)
      ) {
        setShowRabItemDropdown(false);
      }
    }
    if (showAccountDropdown || showRabItemDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountDropdown, showRabItemDropdown]);

  const filteredCategories = categories.filter((c) => {
    if (transactionType === "PEMASUKAN") return c.type === "PEMASUKAN";
    return c.type === "PENGELUARAN";
  });

  const selectedCategory = filteredCategories.find(
    (c) => c.id === selectedCategoryId,
  );

  const selectedRabItem = rabItemOptions.find(
    (item) => item.id === selectedRabItemId,
  );

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedRabItemId("");
    setShowCategoryDropdown(false);

    // Fetch RAB items for this category (for pengeluaran with RAB sync)
    if (transactionType === "PENGELUARAN" && categoryId && selectedRabSyncMode !== "none") {
      setLoadingRabItems(true);
      fetch(`/api/rab?categoryId=${categoryId}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setRabItemOptions(Array.isArray(data) ? data : []))
        .catch(() => setRabItemOptions([]))
        .finally(() => setLoadingRabItems(false));
    } else {
      setRabItemOptions([]);
    }
  };

  const fetchRabItemsForCategory = (categoryId: string) => {
    if (!categoryId) {
      setRabItemOptions([]);
      return;
    }
    setLoadingRabItems(true);
    fetch(`/api/rab?categoryId=${categoryId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRabItemOptions(Array.isArray(data) ? data : []))
      .catch(() => setRabItemOptions([]))
      .finally(() => setLoadingRabItems(false));
  };

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
    setSaveError(null);
    try {
      // Determine effective rabSyncMode
      const effectiveSyncMode = transactionType === "PENGELUARAN"
        ? selectedRabSyncMode
        : "none";

      const parsedQty = parseInt(quantity, 10) || 1;
      const unitPrice = parseFloat(price.replace(/\./g, "").replace(",", "."));

      await onSave({
        name: transactionName.trim(),
        type: transactionType,
        amount: Math.round(unitPrice * parsedQty * 100) / 100,
        pricePerUnit: unitPrice,
        quantity: parsedQty,
        accountName: accountName.trim() || null,
        categoryId: selectedCategoryId || null,
        rabItemId: effectiveSyncMode === "manual" ? (selectedRabItemId || null) : null,
        rabSyncMode: effectiveSyncMode,
        paymentMethod: selectedPaymentMethod,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setSaveError(
        err instanceof Error && err.message
          ? err.message
          : "Gagal menyimpan transaksi. Silakan coba lagi."
      );
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
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                    "flex items-center gap-2 sm:gap-3 rounded-xl border p-3 sm:p-3.5 transition-all",
                    transactionType === "PENGELUARAN"
                      ? "border-red-200 bg-red-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full",
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
                    "flex items-center gap-2 sm:gap-3 rounded-xl border p-3 sm:p-3.5 transition-all",
                    transactionType === "PEMASUKAN"
                      ? "border-emerald-200 bg-emerald-50 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full",
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
                          handleCategorySelect("");
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
                            handleCategorySelect(cat.id);
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

            {/* RAB Sync Mode (only for PENGELUARAN) */}
            {transactionType === "PENGELUARAN" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-900">
                    Pengeluaran ini bagian dari RAB?
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedRabSyncMode("auto");
                      setSelectedRabItemId("");
                      if (selectedCategoryId) fetchRabItemsForCategory(selectedCategoryId);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 transition-all",
                      selectedRabSyncMode !== "none"
                        ? "border-[#064E3B] bg-[#064E3B]/5 shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2",
                        selectedRabSyncMode !== "none"
                          ? "border-[#064E3B] bg-[#064E3B]"
                          : "border-gray-300",
                      )}
                    >
                      {selectedRabSyncMode !== "none" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={cn(
                        "text-sm font-semibold",
                        selectedRabSyncMode !== "none" ? "text-[#064E3B]" : "text-gray-700",
                      )}>
                        Ya, masuk RAB
                      </span>
                      <span className="text-[10px] text-gray-400">Realisasi anggaran</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRabSyncMode("none");
                      setSelectedRabItemId("");
                      setRabItemOptions([]);
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 transition-all",
                      selectedRabSyncMode === "none"
                        ? "border-gray-400 bg-gray-50 shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2",
                        selectedRabSyncMode === "none"
                          ? "border-gray-400 bg-gray-400"
                          : "border-gray-300",
                      )}
                    >
                      {selectedRabSyncMode === "none" && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={cn(
                        "text-sm font-semibold",
                        selectedRabSyncMode === "none" ? "text-gray-700" : "text-gray-700",
                      )}>
                        Tidak
                      </span>
                      <span className="text-[10px] text-gray-400">Di luar RAB</span>
                    </div>
                  </button>
                </div>

                {/* RAB Item Selector (when "Ya, masuk RAB" selected) */}
                {selectedRabSyncMode !== "none" && selectedCategoryId && rabItemOptions.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                        <Link2 className="h-3.5 w-3.5 text-gray-400" />
                        Pilih Item RAB
                      </label>
                    </div>

                    <div className="relative" ref={rabItemDropdownRef}>
                      <button
                        onClick={() => setShowRabItemDropdown(!showRabItemDropdown)}
                        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors hover:bg-gray-50"
                      >
                        <span className="truncate">
                          {selectedRabItem
                            ? `${selectedRabItem.name} — Rp ${selectedRabItem.totalBudget.toLocaleString("id-ID")}`
                            : "Otomatis (category + nama cocok)"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
                      </button>

                      <AnimatePresence>
                        {showRabItemDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg max-h-60 overflow-y-auto"
                          >
                            {/* Default: auto match */}
                            <button
                              onClick={() => {
                                setSelectedRabItemId("");
                                setSelectedRabSyncMode("auto");
                                setShowRabItemDropdown(false);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                            >
                              <span>Otomatis (category + nama cocok)</span>
                              {!selectedRabItemId && (
                                <Check className="ml-auto h-4 w-4 text-[#064E3B]" />
                              )}
                            </button>

                            {loadingRabItems ? (
                              <div className="flex items-center justify-center gap-2 px-3 py-3 text-sm text-gray-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Memuat item RAB...</span>
                              </div>
                            ) : (
                              rabItemOptions.map((item) => {
                                // Check if name matches (contains)
                                const isNameMatch = transactionName &&
                                  item.name.toLowerCase().includes(transactionName.toLowerCase());

                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setSelectedRabItemId(item.id);
                                      setSelectedRabSyncMode("manual");
                                      setShowRabItemDropdown(false);
                                    }}
                                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex flex-col items-start min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{item.name}</span>
                                        {isNameMatch && (
                                          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                            Cocok
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-xs text-gray-400">
                                        Budget: Rp {item.totalBudget.toLocaleString("id-ID")} · Real: Rp {item.realization.toLocaleString("id-ID")}
                                      </span>
                                    </div>
                                    {selectedRabItemId === item.id && (
                                      <Check className="h-4 w-4 text-[#064E3B] shrink-0" />
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Price */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  Harga Satuan <span className="text-red-500">*</span>
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
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl border p-2 sm:p-3 transition-all",
                      selectedPaymentMethod === method.id
                        ? "border-[#064E3B] bg-[#064E3B]/5 shadow-sm"
                        : "border-gray-200 bg-white hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold text-white",
                        selectedPaymentMethod === method.id
                          ? "bg-[#064E3B]"
                          : "bg-gray-200",
                      )}
                    >
                      {method.initial}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-gray-700">
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
            <div className="border-t border-gray-100 pt-4">
              {saveError && (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {saveError}
                </div>
              )}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 w-full sm:w-auto"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !transactionName.trim() || !price}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#044A38] disabled:opacity-50 w-full sm:w-auto"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {isEditing ? "Update Transaksi" : "Simpan Transaksi"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
