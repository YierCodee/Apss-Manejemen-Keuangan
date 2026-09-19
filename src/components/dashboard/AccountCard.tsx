import { Eye } from "lucide-react";

export function AccountCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Total Saldo</p>
        <button className="text-xs text-muted-foreground hover:text-foreground">
          Hubungkan Rekening
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Rp 68.789,56</h2>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">
          •••• •••• •••• 4821
        </span>
        <button className="text-muted-foreground hover:text-foreground">
          <Eye className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Catat Transaksi
        </button>
        <button className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors">
          Cek RAB
        </button>
      </div>
    </div>
  );
}
