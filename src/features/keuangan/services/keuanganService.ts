import type { TransactionRecord, TransactionFormData, AccountInfo, CategoryInfo } from "../types/keuangan.types";

export async function getTransactions(filters?: {
  type?: string;
  categoryId?: string;
  search?: string;
}): Promise<TransactionRecord[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.set("type", filters.type);
  if (filters?.categoryId) params.set("categoryId", filters.categoryId);
  if (filters?.search) params.set("search", filters.search);

  const query = params.toString();
  const res = await fetch(`/api/keuangan${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function getTransaction(id: string): Promise<TransactionRecord> {
  const res = await fetch(`/api/keuangan/${id}`);
  if (!res.ok) throw new Error("Failed to fetch transaction");
  return res.json();
}

export async function createTransaction(data: TransactionFormData): Promise<TransactionRecord> {
  const res = await fetch("/api/keuangan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return res.json();
}

export async function updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<TransactionRecord> {
  const res = await fetch(`/api/keuangan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update transaction");
  return res.json();
}

export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`/api/keuangan/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete transaction");
}

export async function getAccounts(): Promise<AccountInfo[]> {
  const res = await fetch("/api/keuangan/accounts");
  if (!res.ok) throw new Error("Failed to fetch accounts");
  return res.json();
}

export interface SummaryData {
  totalSaldo: number;
  currentMonth: { pemasukan: number; pengeluaran: number; net: number };
  previousMonth: { pemasukan: number; pengeluaran: number; net: number };
  percentageChange: number | null;
}

export async function getSummary(): Promise<SummaryData> {
  const res = await fetch("/api/keuangan/summary");
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function getCategories(type?: string): Promise<CategoryInfo[]> {
  const params = type ? `?type=${type}` : "";
  const res = await fetch(`/api/keuangan/categories${params}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}
