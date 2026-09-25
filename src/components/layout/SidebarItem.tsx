"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
        isCollapsed && "justify-center px-2",
        isActive
          ? "text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
      title={isCollapsed ? label : undefined}
    >
      {isActive &&
        (reduceMotion ? (
          <span className="absolute inset-0 rounded-lg bg-sidebar-primary" />
        ) : (
          <motion.span
            layoutId="sidebar-active-indicator"
            className="absolute inset-0 rounded-lg bg-sidebar-primary"
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          />
        ))}
      <span className="relative z-10 flex min-w-0 items-center gap-3">
        {Icon && (
          <Icon
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-transform duration-200",
              isActive
                ? "text-white"
                : "text-sidebar-icon group-hover:scale-110"
            )}
          />
        )}
        {!isCollapsed && label}
      </span>
    </Link>
  );
}
