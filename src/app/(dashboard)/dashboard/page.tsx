import { getSession } from "@/lib/auth";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { StandingOrdersBanner } from "@/components/dashboard/StandingOrdersBanner";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ExpenseSummary } from "@/components/dashboard/ExpenseSummary";

export default async function DashboardPage() {
  const session = await getSession();
  const userName = session?.name || "User";

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Welcome Banner */}
          <WelcomeBanner userName={userName} />

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
