import { CalendarDays, ArrowRight, NotebookPen } from "lucide-react";
import Link from "next/link";


export function StandingOrdersBanner() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold leading-snug mb-3">
            Apa itu Rencana Anggaran Biaya?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            RAB adalah perkiraan estimasi seluruh biaya yang Anda butuhkan untuk
            mendanai keperluan personal atau rumah tangga, seperti renovasi
            rumah, liburan, hingga dana pendidikan anak.
          </p>
          <Link
            href="/rab"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Coba sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <div className="flex h-30 w-30 items-center justify-center rounded-2xl bg-muted">
            <NotebookPen className="h-20 w-20 items-center justify-center bg-primary-foreground
              "/>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        <div className="h-2.5 w-2.5 rounded-full bg-muted" />
        <div className="h-2.5 w-2.5 rounded-full bg-muted" />
      </div>
    </div>
  );
}
