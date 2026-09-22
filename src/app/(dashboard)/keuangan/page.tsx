"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalendarClock, NotebookPen, FileDown, Loader2, FileSpreadsheet, FileText, X } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/features/keuangan/utils/exportTransactions";
import { useKeuangan } from "@/features/keuangan/hooks/useKeuangan";
import { KeuanganTable } from "@/features/keuangan/components/KeuanganTable";
import { formatCurrency } from "@/features/keuangan/utils/formatCurrency";
import RecordTransactionModal from "@/components/modals/RecordTransactionModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import type { TransactionRecord } from "@/features/keuangan/types/keuangan.types";


const filterTabs = [
  { label: "Semua Transaksi", value: "all" },
  { label: "pemasukan", value: "pemasukan" },
  { label: "pengeluaran", value: "pengeluaran" },
];

export default function KeuanganPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSearch = searchParams.get("search") ?? "";

  const {
    transactions,
    categories,
    isLoading,
    error,
    fetchTransactions,
    create,
    update,
    remove,
  } = useKeuangan();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionRecord | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<TransactionRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Fetch with search param from URL
  useEffect(() => {
    if (urlSearch) {
      fetchTransactions({ search: urlSearch });
    }
  }, [urlSearch, fetchTransactions]);

  // Calculate metrics
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const pemasukanBulanIni = thisMonthTransactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + t.amount, 0);
  const pemasukanCount = thisMonthTransactions.filter((t) => t.type === "pemasukan").length;

  const pengeluaranBulanIni = thisMonthTransactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + t.amount, 0);
  const pengeluaranCount = thisMonthTransactions.filter((t) => t.type === "pengeluaran").length;

  const cashFlowBulanIni = pemasukanBulanIni + pengeluaranBulanIni;

  // Close export menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    }
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showExportMenu]);

  // Apply filter
  const filteredTransactions =
    activeFilter === "all"
      ? transactions
      : transactions.filter((t) => t.type === activeFilter);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    const filters: { type?: string; search?: string } = {};
    if (value !== "all") filters.type = value;
    if (urlSearch) filters.search = urlSearch;
    fetchTransactions(Object.keys(filters).length ? filters : undefined);
  };

  const clearSearch = () => {
    router.push("/keuangan");
  };

  const handleEdit = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      setEditingTransaction(tx);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRequest = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) setDeleteTarget(tx);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (data: Parameters<typeof create>[0]) => {
    if (editingTransaction) {
      await update(editingTransaction.id, data);
    } else {
      await create(data);
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const openCreateModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold leading-7 tracking-tight text-[#0f172a]">
                Manajemen Keuangan
              </h1>
              <p className="text-sm text-gray-500">
                Kelola keuangan kamu agar sesuai dengan RAB
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                Bulan Ini
                <CalendarClock size={14} />
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#044a38] transition-colors"
              >
                <NotebookPen size={14} />
                Catat Transaksi
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => fetchTransactions()}
                className="mt-2 text-xs font-medium text-red-700 underline hover:no-underline"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && transactions.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#064e3b]" />
            </div>
          ) : (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      CASH FLOW
                    </span>
                    <div className="flex size-7 items-center justify-center rounded-full bg-blue-50">
                      <span className="text-xs font-bold text-blue-600">⇄</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                    {formatCurrency(cashFlowBulanIni)}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700">
                      {pemasukanCount + pengeluaranCount} Transaksi
                    </span>
                    <span className="text-xs text-gray-400">Total arus kas</span>
                  </div>
                </div>
                {/* Pemasukan Bulan Ini */}
                <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      PEMASUKAN BULAN INI
                    </span>
                    <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50">
                      <span className="text-xs font-bold text-emerald-600">↙</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                    {formatCurrency(pemasukanBulanIni)}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {pemasukanCount} Transaksi
                    </span>
                    <span className="text-xs text-gray-400">Inflow stabil</span>
                  </div>
                </div>

                {/* Pengeluaran Bulan Ini */}
                <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      PENGELUARAN BULAN INI
                    </span>
                    <div className="flex size-7 items-center justify-center rounded-full bg-rose-50">
                      <span className="text-xs font-bold text-rose-600">↗</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                    {formatCurrency(pengeluaranBulanIni)}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">
                      {pengeluaranCount} Transaksi
                    </span>
                    <span className="text-xs text-gray-400">Sesuai pagu RAB</span>
                  </div>
                </div>

                {/* Cash Flow Bulan Ini */}
               
              </div>

              {/* Transaction History */}
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 md:p-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-bold text-[#0f172a]">
                      Riwayat Transaksi
                    </h3>
                    <p className="text-xs text-gray-400">
                      Semua aktivitas transaksi ada disini
                    </p>
                  </div>
                  <div className="relative self-start" ref={exportMenuRef}>
                    <button
                      onClick={() => setShowExportMenu((prev) => !prev)}
                      className="flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#044a38] transition-colors"
                    >
                      <FileDown size={12} />
                      Unduh PDF/EXCEL
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          onClick={() => {
                            exportToPDF(filteredTransactions);
                            setShowExportMenu(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FileText size={14} className="text-red-500" />
                          Unduh PDF
                        </button>
                        <button
                          onClick={() => {
                            exportToExcel(filteredTransactions);
                            setShowExportMenu(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FileSpreadsheet size={14} className="text-emerald-600" />
                          Unduh Excel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => handleFilterChange(tab.value)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors ${
                        activeFilter === tab.value
                          ? "bg-[#064e3b] font-semibold text-white"
                          : "bg-gray-100 font-medium text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Search Indicator */}
                {urlSearch && (
                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                    <span className="text-xs text-blue-700">
                      Hasil pencarian: <strong>&quot;{urlSearch}&quot;</strong>
                    </span>
                    <button
                      onClick={clearSearch}
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Table */}
                <KeuanganTable
                  transactions={filteredTransactions}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />

                {/* Footer */}
                <div className="flex justify-center border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400">
                    Menampilkan {filteredTransactions.length} dari {transactions.length} Transaksi
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Record Transaction Modal */}
      <RecordTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSave}
        initialData={editingTransaction}
        categories={categories}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Transaksi?"
        message={`Transaksi "${deleteTarget?.name}" akan dihapus permanen. Saldo akun juga akan disesuaikan.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
