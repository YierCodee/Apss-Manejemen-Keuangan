import { AccountCard } from "@/components/dashboard/AccountCard";
import { StandingOrdersBanner } from "@/components/dashboard/StandingOrdersBanner";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ExpenseSummary } from "@/components/dashboard/ExpenseSummary";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold leading-7 tracking-tight text-[#0f172a]">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Selamat datang kembali, kelola keuanganmu dengan mudah
              </p>
            </div>
          </div>

          {/* Top Row: Account Card + Standing Orders Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <AccountCard />
            </div>
            <div className="lg:col-span-2">
              <StandingOrdersBanner />
            </div>
          </div>

          {/* Bottom Row: Recent Transactions + Expense Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <RecentTransactions />
            </div>
            <div className="lg:col-span-2">
              <ExpenseSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
