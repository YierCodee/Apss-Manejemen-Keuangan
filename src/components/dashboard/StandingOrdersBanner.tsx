import { CalendarDays, ArrowRight } from "lucide-react";

export function StandingOrdersBanner() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold leading-snug mb-3">
            Define standing orders
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We help you remember about recurring payments for the fixed price.
            Define once standing order and bank will take care of your regular
            transfers.
          </p>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Mulai Sekarang
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-muted">
            <CalendarDays className="h-16 w-16 text-muted-foreground/40" />
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
