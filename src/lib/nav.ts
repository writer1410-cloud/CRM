import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  ListTodo,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  {
    title: "ダッシュボード",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "経営サマリーと主要KPI",
  },
  {
    title: "売上管理",
    href: "/sales",
    icon: TrendingUp,
    description: "売上履歴と新規登録",
  },
  {
    title: "顧客管理",
    href: "/customers",
    icon: Users,
    description: "顧客一覧とステータス",
  },
  {
    title: "在庫管理",
    href: "/inventory",
    icon: Package,
    description: "商品と在庫状況",
  },
  {
    title: "タスク管理",
    href: "/tasks",
    icon: ListTodo,
    description: "カンバンとタスク一覧",
  },
];

export const appName = "Nexus CRM";
