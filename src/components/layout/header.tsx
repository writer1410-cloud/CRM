"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Hexagon,
  Menu,
  Search,
  AlertTriangle,
  CalendarX,
} from "lucide-react";

import { appName, navItems } from "@/lib/nav";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarNav } from "./sidebar-nav";

export interface Notification {
  id: string;
  type: "task" | "stock";
  message: string;
  href: string;
}

interface HeaderProps {
  notifications?: Notification[];
}

export function Header({ notifications = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <header className="bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 lg:px-6">
      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-white lg:hidden"
          >
            <Menu className="size-5" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-sidebar text-sidebar-foreground w-64 border-none p-0"
        >
          <SheetHeader className="border-sidebar-border border-b">
            <SheetTitle className="flex items-center gap-3 text-white">
              <div className="flex size-8 items-center justify-center rounded-none border-2 border-white/80">
                <Hexagon className="size-4" />
              </div>
              {appName}
            </SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <div className="flex items-center gap-2">
        {currentPage?.icon && (
          <currentPage.icon className="size-5 text-white" />
        )}
        <div className="flex flex-col">
          <h1 className="text-base leading-tight font-semibold text-white lg:text-lg">
            {currentPage?.title ?? appName}
          </h1>
          {currentPage?.description && (
            <p className="text-sidebar-foreground/70 hidden text-xs sm:block">
              {currentPage.description}
            </p>
          )}
        </div>
      </div>

      {/* Custom menu dropdowns (decorative, like the reference) */}
      <nav className="ml-4 hidden items-center gap-1 xl:flex">
        {["カスタムメニュー", "カスタムメニュー"].map((label, i) => (
          <button
            key={i}
            className="text-sidebar-foreground/80 hover:bg-sidebar-accent flex items-center gap-1 px-3 py-1.5 text-sm transition-colors hover:text-white"
          >
            {label}
            <ChevronDown className="size-3.5" />
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="text-sidebar-foreground/60 absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="検索..."
            className="border-sidebar-border placeholder:text-sidebar-foreground/50 w-48 bg-white/10 pl-8 text-white lg:w-64"
          />
        </div>

        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent relative hover:text-white"
            >
              <Bell className="size-5" />
              {notifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1.5 -right-1.5 size-4 rounded-none p-0 text-[10px]"
                >
                  {notifications.length}
                </Badge>
              )}
              <span className="sr-only">通知</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>通知</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="text-muted-foreground px-3 py-4 text-center text-sm">
                通知はありません
              </div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} asChild>
                  <a href={n.href} className="flex items-start gap-2 py-2">
                    {n.type === "task" ? (
                      <CalendarX className="text-brand-red mt-0.5 size-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="text-brand-orange mt-0.5 size-4 shrink-0" />
                    )}
                    <span className="text-sm leading-tight">{n.message}</span>
                  </a>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-sidebar-accent relative size-9 rounded-none"
            >
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  田中
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>田中 管理者</span>
                <span className="text-muted-foreground text-xs font-normal">
                  admin@nexus-crm.jp
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>プロフィール</DropdownMenuItem>
            <DropdownMenuItem>設定</DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem variant="destructive" asChild>
                <button type="submit" className="w-full">
                  ログアウト
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
