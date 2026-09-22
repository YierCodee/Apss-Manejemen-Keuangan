import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { formatCurrency } from "@/features/keuangan/utils/formatCurrency";

interface RabExportItem {
  name: string;
  categoryName: string | null;
  priority: string;
  targetProgress: number;
  quantity: number;
  pricePerUnit: number;
  totalBudget: number;
  realization: number;
}

interface RabSummary {
  totalBudget: number;
  totalRealization: number;
}

const PRIORITY_LABELS: Record<string, string> = {
  "on-track": "On Track",
  high: "High",
  medium: "Medium",
  low: "Low",
};

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

function buildRows(items: RabExportItem[]) {
  return items.map((item, i) => [
    String(i + 1),
    item.name,
    item.categoryName || "—",
    PRIORITY_LABELS[item.priority] || item.priority,
    `${item.targetProgress}%`,
    String(item.quantity),
    formatCurrency(item.pricePerUnit),
    formatCurrency(item.totalBudget),
  ]);
}

function buildRowsExcel(items: RabExportItem[]) {
  return items.map((item, i) => ({
    no: i + 1,
    name: item.name,
    category: item.categoryName || "—",
    priority: PRIORITY_LABELS[item.priority] || item.priority,
    progress: `${item.targetProgress}%`,
    quantity: item.quantity,
    pricePerUnit: item.pricePerUnit,
    totalBudget: item.totalBudget,
    realization: item.realization,
  }));
}

export function exportToPDF(items: RabExportItem[], summary: RabSummary) {
  const doc = new jsPDF({ orientation: "landscape" });
  const now = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Rencana Anggaran Biaya (RAB)", 14, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Dicetak: ${now}`, 14, 22);

  const head = [["No", "Nama Barang", "Kategori", "Prioritas", "Progress", "Jumlah", "Harga Satuan", "Total Anggaran"]];
  const body = buildRows(items);

  autoTable(doc, {
    head,
    body,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 22, halign: "center" },
      5: { cellWidth: 18, halign: "center" },
      6: { cellWidth: 35, halign: "right" },
      7: { cellWidth: 35, halign: "right" },
    },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 3) {
        const val = String(data.cell.raw);
        if (val === "High") {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        } else if (val === "Medium") {
          data.cell.styles.textColor = [180, 83, 9];
          data.cell.styles.fontStyle = "bold";
        } else if (val === "On Track") {
          data.cell.styles.textColor = [5, 150, 105];
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
  doc.text(`Total Anggaran: ${formatCurrency(summary.totalBudget)}`, 14, finalY + 7);
  doc.text(`Total Realisasi: ${formatCurrency(summary.totalRealization)}`, 14, finalY + 13);
  doc.text(`Sisa Anggaran: ${formatCurrency(summary.totalBudget - summary.totalRealization)}`, 14, finalY + 19);

  const filename = `RAB_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export async function exportToExcel(items: RabExportItem[], summary: RabSummary) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("RAB");

  sheet.columns = [
    { header: "No", key: "no", width: 6 },
    { header: "Nama Barang", key: "name", width: 35 },
    { header: "Kategori", key: "category", width: 18 },
    { header: "Prioritas", key: "priority", width: 14 },
    { header: "Progress", key: "progress", width: 12 },
    { header: "Jumlah", key: "quantity", width: 10 },
    { header: "Harga Satuan", key: "pricePerUnit", width: 22 },
    { header: "Total Anggaran", key: "totalBudget", width: 22 },
    { header: "Realisasi", key: "realization", width: 22 },
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

  const excelRows = buildRowsExcel(items);
  excelRows.forEach((row) => {
    const addedRow = sheet.addRow(row);

    const priorityCell = addedRow.getCell("priority");
    const val = String(row.priority);
    if (val === "High") {
      priorityCell.font = { bold: true, color: { argb: "FFDC2626" } };
    } else if (val === "Medium") {
      priorityCell.font = { bold: true, color: { argb: "FFB45309" } };
    } else if (val === "On Track") {
      priorityCell.font = { bold: true, color: { argb: "FF059669" } };
    }

    const priceCell = addedRow.getCell("pricePerUnit");
    priceCell.numFmt = '#,##0';

    const totalCell = addedRow.getCell("totalBudget");
    totalCell.numFmt = '#,##0';

    const realizationCell = addedRow.getCell("realization");
    realizationCell.numFmt = '#,##0';

    addedRow.eachCell((cell) => {
      cell.alignment = { vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
  });

  sheet.addRow({});

  const totalBudgetRow = sheet.addRow({
    name: "Total Anggaran",
    totalBudget: summary.totalBudget,
  });
  totalBudgetRow.getCell("name").font = { bold: true, size: 10 };
  totalBudgetRow.getCell("name").alignment = { horizontal: "right", vertical: "middle" };
  totalBudgetRow.getCell("totalBudget").font = { bold: true, size: 10 };
  totalBudgetRow.getCell("totalBudget").numFmt = '#,##0';

  const totalRealRow = sheet.addRow({
    name: "Total Realisasi",
    realization: summary.totalRealization,
  });
  totalRealRow.getCell("name").font = { bold: true, size: 10 };
  totalRealRow.getCell("name").alignment = { horizontal: "right", vertical: "middle" };
  totalRealRow.getCell("realization").font = { bold: true, size: 10 };
  totalRealRow.getCell("realization").numFmt = '#,##0';

  const sisaRow = sheet.addRow({
    name: "Sisa Anggaran",
    totalBudget: summary.totalBudget - summary.totalRealization,
  });
  sisaRow.getCell("name").font = { bold: true, size: 10 };
  sisaRow.getCell("name").alignment = { horizontal: "right", vertical: "middle" };
  sisaRow.getCell("totalBudget").font = { bold: true, size: 10 };
  sisaRow.getCell("totalBudget").numFmt = '#,##0';

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = `RAB_${new Date().toISOString().slice(0, 10)}.xlsx`;
  downloadBlob(blob, filename);
}
