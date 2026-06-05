import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  ListTodo,
  PieChart,
  Globe,
  History,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  /** Optional red count badge, like the reference's "口座残高 (2)". */
  badgeKey?: "lowStock" | "openTasks";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "メインメニュー",
    items: [
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
        badgeKey: "lowStock",
      },
      {
        title: "タスク管理",
        href: "/tasks",
        icon: ListTodo,
        description: "カンバンとタスク一覧",
        badgeKey: "openTasks",
      },
    ],
  },
  {
    label: "カスタムメニュー",
    items: [
      {
        title: "データ解析",
        href: "/dashboard",
        icon: PieChart,
        description: "経営サマリーと主要KPI",
      },
      {
        title: "期間履歴",
        href: "/sales",
        icon: History,
        description: "売上履歴と新規登録",
      },
      {
        title: "地域データ",
        href: "/customers",
        icon: Globe,
        description: "顧客一覧とステータス",
      },
    ],
  },
];

/** Flat list of all nav items (used by the header to resolve the page title). */
export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);

export const appName = "CONECT";
export const appTagline = "ABSTRACT LOGO";
