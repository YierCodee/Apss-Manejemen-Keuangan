"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  BarChart,
  Package,
  CircleDollarSign,
  ShoppingBag,
  LineChart,
  Users,
  LogOut,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  CreditCard,
  FileText,
  BarChart,
  Package,
  CircleDollarSign,
  ShoppingBag,
  LineChart,
  Users,
  LogOut,
};

export function SidebarNavItem({
  label,
  href,
  iconName,
  isCollapsed = false,
}: {
  label: string;
  href: string;
  iconName: string;
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = iconMap[iconName];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isCollapsed && "justify-center px-2",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      title={isCollapsed ? label : undefined}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0",
            isActive ? "text-white" : "text-sidebar-icon"
          )}
        />
      )}
      {!isCollapsed && label}
    </Link>
  );
}
