"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutGrid, Menu, Search } from "lucide-react";

import { appName, navItems } from "@/lib/nav";
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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur lg:px-6">
      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b">
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-7 items-center justify-center rounded-lg">
                <LayoutGrid className="size-4" />
              </div>
              {appName}
            </SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col">
        <h1 className="text-base font-semibold lg:text-lg">
          {currentPage?.title ?? appName}
        </h1>
        {currentPage?.description && (
          <p className="text-muted-foreground hidden text-xs sm:block">
            {currentPage.description}
          </p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="検索..."
            className="w-48 pl-8 lg:w-64"
          />
        </div>

        <Button variant="outline" size="icon" className="relative">
          <Bell className="size-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1.5 -right-1.5 size-4 rounded-full p-0 text-[10px]"
          >
            3
          </Badge>
          <span className="sr-only">通知</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-9 rounded-full">
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
            <DropdownMenuItem variant="destructive" asChild>
              <Link href="/dashboard">ログアウト</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
