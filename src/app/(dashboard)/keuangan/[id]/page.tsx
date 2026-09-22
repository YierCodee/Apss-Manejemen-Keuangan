"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Loader2, Calendar, CreditCard, Tag, FileText, Hash } from "lucide-react";
import { getTransaction, updateTransaction, deleteTransaction, getCategories } from "@/features/keuangan/services/keuanganService";
import { formatCurrency } from "@/features/keuangan/utils/formatCurrency";
import type { TransactionRecord, CategoryInfo, TransactionFormData } from "@/features/keuangan/types/keuangan.types";
import RecordTransactionModal from "@/components/modals/RecordTransactionModal";
import ConfirmDialog from "@/components/modals/ConfirmDialog";

export default function KeuanganDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [transaction, setTransaction] = useState<TransactionRecord | null>(null);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [tx, cats] = await Promise.all([
          getTransaction(id),
          getCategories(),
        ]);
        setTransaction(tx);
        setCategories(cats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transaction");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpdate = async (data: TransactionFormData) => {
    const updated = await updateTransaction(id, data);
    setTransaction(updated);
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTransaction(id);
      router.push("/keuangan");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#064e3b]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
          <button
            onClick={() => router.push("/keuangan")}
            className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#064e3b] transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali ke Keuangan
          </button>
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-red-500">{error || "Transaksi tidak ditemukan"}</p>
          </div>
        </div>
      </div>
    );
  }

  const isIncome = transaction.type === "pemasukan";
  const dateObj = new Date(transaction.date);
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const day = dayNames[dateObj.getDay()];
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const paymentMethodLabels: Record<string, string> = {
    GOPAY: "Gopay",
    OVO: "Ovo",
    SHOPEEPAY: "ShopeePay",
    DANA: "Dana",
    QRIS: "QRIS",
    BANK_TRANSFER: "Transfer Bank",
    CASH: "Tunai",
    NEVBANK_PRIMARY: "NevBank",
  };

  const detailItems = [
    { icon: <Tag size={14} />, label: "Nama", value: transaction.name },
    { icon: <Tag size={14} />, label: "Kategori", value: transaction.category?.name || "—" },
    { icon: <Hash size={14} />, label: "Jumlah", value: `${transaction.quantity} item` },
    {
      icon: <CreditCard size={14} />,
      label: "Harga Satuan",
      value: transaction.pricePerUnit ? formatCurrency(transaction.pricePerUnit) : "—",
    },
    { icon: <CreditCard size={14} />, label: "Total", value: formatCurrency(transaction.amount) },
    { icon: <CreditCard size={14} />, label: "Metode Pembayaran", value: paymentMethodLabels[transaction.paymentMethod] || transaction.paymentMethod },
    { icon: <Calendar size={14} />, label: "Tanggal", value: formattedDate },
    { icon: <Calendar size={14} />, label: "Waktu", value: formattedTime },
    { icon: <FileText size={14} />, label: "Catatan", value: transaction.notes || "—" },
    { icon: <Tag size={14} />, label: "Akun", value: transaction.accountName || "—" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Back Button */}
          <button
            onClick={() => router.push("/keuangan")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#064e3b] transition-colors self-start"
          >
            <ArrowLeft size={14} />
            Kembali ke Keuangan
          </button>

          {/* Header Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: transaction.category?.bgColor || (isIncome ? "#ecfdf5" : "#fff2db"),
                  }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: transaction.category?.color || (isIncome ? "#047857" : "#f62440"),
                    }}
                  >
                    {isIncome ? "↙" : "↗"}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-[#0f172a]">{transaction.name}</h1>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: isIncome ? "#ecfdf5" : "#fff2db",
                        color: isIncome ? "#047857" : "#f62440",
                      }}
                    >
                      {isIncome ? "Pemasukan" : "Pengeluaran"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formattedDate} • {formattedTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Transaksi</span>
              <p className="mt-1 text-2xl font-extrabold text-[#0f172a]">
                {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>

          {/* Detail Grid */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-base font-bold text-[#0f172a] mb-4">Detail Transaksi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detailItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl border border-gray-100 p-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{item.label}</span>
                    <span className="text-sm font-medium text-gray-800">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <RecordTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        initialData={transaction}
        categories={categories}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Transaksi?"
        message={`Transaksi "${transaction.name}" akan dihapus permanen. Saldo akun juga akan disesuaikan.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
