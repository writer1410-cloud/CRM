import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { appName } from "@/lib/nav";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border hidden w-64 shrink-0 flex-col border-r lg:flex">
      <div className="border-sidebar-border flex h-16 items-center gap-2 border-b px-6">
        <div className="bg-neon text-neon-foreground flex size-8 items-center justify-center">
          <LayoutGrid className="size-5" />
        </div>
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          {appName}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <p className="text-sidebar-foreground/50 px-6 py-2 text-xs font-semibold tracking-wider uppercase">
          メニュー
        </p>
        <SidebarNav />
      </div>

      <div className="border-sidebar-border border-t p-4">
        <p className="text-sidebar-foreground/50 text-xs">
          オールインワン業務管理
        </p>
        <p className="text-sidebar-foreground/40 text-xs">v0.1.0 · Demo</p>
      </div>
    </aside>
  );
}
