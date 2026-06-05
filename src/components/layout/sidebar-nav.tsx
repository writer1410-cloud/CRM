"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/nav";
import { getLowStockProducts, getOpenTasks } from "@/lib/mock-data";

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const badgeCounts: Record<string, number> = {
    lowStock: getLowStockProducts().length,
    openTasks: getOpenTasks().length,
  };

  return (
    <div className="flex flex-col">
      {navGroups.map((group) => (
        <div key={group.label} className="pb-2">
          {/* Section header band */}
          <div className="bg-sidebar-header text-sidebar-foreground/80 flex items-center justify-between px-5 py-2.5 text-xs font-semibold tracking-wider">
            <span>{group.label}</span>
            <ChevronDown className="size-3.5 opacity-60" />
          </div>

          <nav className="mt-1 flex flex-col">
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              const badge = item.badgeKey
                ? badgeCounts[item.badgeKey]
                : undefined;

              return (
                <Link
                  key={`${group.label}-${item.title}`}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border",
                      isActive
                        ? "border-white/40 bg-white/10"
                        : "border-white/15 bg-white/5"
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex-1 truncate">{item.title}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="bg-brand-red flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white">
                      {badge}
                    </span>
                  )}
                  <ChevronRight className="size-3.5 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}
