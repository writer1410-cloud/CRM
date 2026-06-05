import Link from "next/link";
import { Hexagon } from "lucide-react";

import { appName, appTagline } from "@/lib/nav";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border hidden w-64 shrink-0 flex-col border-r lg:flex">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="border-sidebar-border flex h-16 items-center gap-3 border-b px-5"
      >
        <div className="flex size-9 items-center justify-center rounded-full border-2 border-white/80 text-white">
          <Hexagon className="size-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-wide text-white">
            {appName}
          </span>
          <span className="text-sidebar-foreground/55 text-[10px] tracking-[0.2em]">
            {appTagline}
          </span>
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav />
      </div>

      <div className="border-sidebar-border border-t px-5 py-4">
        <p className="text-sidebar-foreground/50 text-xs">
          オールインワン業務管理
        </p>
        <p className="text-sidebar-foreground/35 text-xs">v0.1.0 · Demo</p>
      </div>
    </aside>
  );
}
