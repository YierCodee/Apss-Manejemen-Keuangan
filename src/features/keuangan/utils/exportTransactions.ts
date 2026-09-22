import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import type { TransactionRecord } from "../types/keuangan.types";
import { formatCurrency } from "./formatCurrency";

const paymentMethodLabels: Record<string, string> = {
  GOPAY: "Gopay",
  OVO: "Ovo",
  SHOPEEPAY: "ShopeePay",
  DANA: "Dana",
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer",
  CASH: "Tunai",
  NEVBANK_PRIMARY: "NevBank",
};

interface SummaryRow {
  totalPemasukan: number;
  totalPengeluaran: number;
  selisih: number;
}

function getSummary(transactions: TransactionRecord[]): SummaryRow {
  const totalPemasukan = transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPengeluaran = transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + t.amount, 0);
  return {
    totalPemasukan,
    totalPengeluaran,
    selisih: totalPemasukan - totalPengeluaran,
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildRows(transactions: TransactionRecord[]) {
  return transactions.map((tx, i) => [
    String(i + 1),
    tx.name,
    tx.category?.name || "—",
    String(tx.quantity),
    paymentMethodLabels[tx.paymentMethod] || tx.paymentMethod,
    tx.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
    formatCurrency(tx.amount),
    formatDate(tx.date),
  ]);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToPDF(transactions: TransactionRecord[]) {
  const doc = new jsPDF({ orientation: "landscape" });
  const summary = getSummary(transactions);
  const now = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Riwayat Transaksi", 14, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Dicetak: ${now}`, 14, 22);

  const head = [["No", "Nama", "Kategori", "Jumlah", "Metode", "Jenis", "Harga", "Tanggal"]];
  const body = buildRows(transactions);

  autoTable(doc, {
    head,
    body,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 50 },
      2: { cellWidth: 30 },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 25, halign: "center" },
      5: { cellWidth: 25, halign: "center" },
      6: { cellWidth: 35, halign: "right" },
      7: { cellWidth: 28, halign: "center" },
    },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 5) {
        const val = String(data.cell.raw);
        if (val === "Pemasukan") {
          data.cell.styles.textColor = [4, 120, 87];
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [246, 36, 64];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, finalY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Total Pemasukan: ${formatCurrency(summary.totalPemasukan)}`, 14, finalY + 7);
  doc.text(`Total Pengeluaran: ${formatCurrency(summary.totalPengeluaran)}`, 14, finalY + 13);
  doc.text(`Selisih: ${formatCurrency(summary.selisih)}`, 14, finalY + 19);

  const filename = `Riwayat_Transaksi_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export async function exportToExcel(transactions: TransactionRecord[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Riwayat Transaksi");
  const summary = getSummary(transactions);

  sheet.columns = [
    { header: "No", key: "no", width: 6 },
    { header: "Nama", key: "name", width: 35 },
    { header: "Kategori", key: "category", width: 18 },
    { header: "Jumlah", key: "quantity", width: 10 },
    { header: "Metode", key: "method", width: 16 },
    { header: "Jenis", key: "type", width: 14 },
    { header: "Harga", key: "amount", width: 22 },
    { header: "Tanggal", key: "date", width: 16 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF064E3B" },
    };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  transactions.forEach((tx, i) => {
    const row = sheet.addRow({
      no: i + 1,
      name: tx.name,
      category: tx.category?.name || "—",
      quantity: tx.quantity,
      method: paymentMethodLabels[tx.paymentMethod] || tx.paymentMethod,
      type: tx.type === "pemasukan" ? "Pemasukan" : "Pengeluaran",
      amount: formatCurrency(tx.amount),
      date: formatDate(tx.date),
    });

    const typeCell = row.getCell("type");
    if (tx.type === "pemasukan") {
      typeCell.font = { bold: true, color: { argb: "FF047857" } };
    } else {
      typeCell.font = { bold: true, color: { argb: "FFF62440" } };
    }

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
  });

  sheet.addRow({});
  const summaryLabelRow = sheet.addRow({
    name: "Total Pemasukan",
    amount: formatCurrency(summary.totalPemasukan),
  });
  summaryLabelRow.getCell("name").font = { bold: true, size: 10 };
  summaryLabelRow.getCell("amount").font = { bold: true, color: { argb: "FF047857" }, size: 10 };

  const summaryRow2 = sheet.addRow({
    name: "Total Pengeluaran",
    amount: formatCurrency(summary.totalPengeluaran),
  });
  summaryRow2.getCell("name").font = { bold: true, size: 10 };
  summaryRow2.getCell("amount").font = { bold: true, color: { argb: "FFF62440" }, size: 10 };

  const summaryRow3 = sheet.addRow({
    name: "Selisih",
    amount: formatCurrency(summary.selisih),
  });
  summaryRow3.getCell("name").font = { bold: true, size: 10 };
  summaryRow3.getCell("amount").font = { bold: true, size: 10 };

  [summaryLabelRow, summaryRow2, summaryRow3].forEach((r) => {
    r.getCell("name").alignment = { horizontal: "right", vertical: "middle" };
    r.getCell("amount").alignment = { horizontal: "left", vertical: "middle" };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = `Riwayat_Transaksi_${new Date().toISOString().slice(0, 10)}.xlsx`;
  downloadBlob(blob, filename);
}
