// =============================================================================
// Mock data layer
// -----------------------------------------------------------------------------
// All screens currently read from these fake datasets so the UI/UX can be built
// and reviewed before the database (Prisma + PostgreSQL) is wired up. When the
// DB is introduced, these shapes are intended to map directly to Prisma models.
// =============================================================================

// ---------- Sales ----------

export type SaleStatus = "paid" | "pending" | "overdue" | "cancelled";

export interface Sale {
  id: string;
  date: string; // ISO date
  customerName: string;
  amount: number;
  status: SaleStatus;
}

export const saleStatusLabels: Record<SaleStatus, string> = {
  paid: "入金済み",
  pending: "保留中",
  overdue: "支払い遅延",
  cancelled: "キャンセル",
};

export const sales: Sale[] = [
  { id: "INV-1042", date: "2026-06-04", customerName: "株式会社サクラ商事", amount: 480000, status: "paid" },
  { id: "INV-1041", date: "2026-06-03", customerName: "山田デザイン事務所", amount: 128000, status: "pending" },
  { id: "INV-1040", date: "2026-06-02", customerName: "グローバルテック株式会社", amount: 1250000, status: "paid" },
  { id: "INV-1039", date: "2026-05-29", customerName: "みどり物産", amount: 96000, status: "overdue" },
  { id: "INV-1038", date: "2026-05-27", customerName: "株式会社アオゾラ", amount: 342000, status: "paid" },
  { id: "INV-1037", date: "2026-05-24", customerName: "ひかりソリューションズ", amount: 215000, status: "pending" },
  { id: "INV-1036", date: "2026-05-21", customerName: "株式会社サクラ商事", amount: 530000, status: "paid" },
  { id: "INV-1035", date: "2026-05-18", customerName: "ファースト・コンサルティング", amount: 78000, status: "cancelled" },
  { id: "INV-1034", date: "2026-05-15", customerName: "ニッポン製作所", amount: 670000, status: "paid" },
  { id: "INV-1033", date: "2026-05-12", customerName: "山田デザイン事務所", amount: 154000, status: "paid" },
  { id: "INV-1032", date: "2026-05-09", customerName: "みどり物産", amount: 88000, status: "pending" },
  { id: "INV-1031", date: "2026-05-06", customerName: "グローバルテック株式会社", amount: 920000, status: "paid" },
];

// ---------- Customers ----------

export type CustomerStatus = "lead" | "active" | "inactive" | "churned";

export interface Customer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  totalSpent: number;
  lastContact: string; // ISO date
}

export const customerStatusLabels: Record<CustomerStatus, string> = {
  lead: "リード",
  active: "契約中",
  inactive: "休眠",
  churned: "解約",
};

export const customers: Customer[] = [
  { id: "CUS-001", name: "株式会社サクラ商事", contactName: "佐藤 健一", email: "sato@sakura-corp.jp", phone: "03-1234-5678", status: "active", totalSpent: 4820000, lastContact: "2026-06-04" },
  { id: "CUS-002", name: "山田デザイン事務所", contactName: "山田 花子", email: "yamada@yd-design.jp", phone: "06-2345-6789", status: "active", totalSpent: 982000, lastContact: "2026-06-03" },
  { id: "CUS-003", name: "グローバルテック株式会社", contactName: "鈴木 大輔", email: "suzuki@globaltech.co.jp", phone: "03-3456-7890", status: "active", totalSpent: 8650000, lastContact: "2026-06-02" },
  { id: "CUS-004", name: "みどり物産", contactName: "田中 美咲", email: "tanaka@midori-bussan.jp", phone: "052-456-7890", status: "inactive", totalSpent: 412000, lastContact: "2026-05-29" },
  { id: "CUS-005", name: "株式会社アオゾラ", contactName: "高橋 翔", email: "takahashi@aozora.jp", phone: "045-567-8901", status: "active", totalSpent: 1530000, lastContact: "2026-05-27" },
  { id: "CUS-006", name: "ひかりソリューションズ", contactName: "伊藤 由美", email: "ito@hikari-sol.jp", phone: "092-678-9012", status: "lead", totalSpent: 0, lastContact: "2026-05-24" },
  { id: "CUS-007", name: "ファースト・コンサルティング", contactName: "渡辺 隆", email: "watanabe@first-consult.jp", phone: "011-789-0123", status: "churned", totalSpent: 234000, lastContact: "2026-04-30" },
  { id: "CUS-008", name: "ニッポン製作所", contactName: "中村 智子", email: "nakamura@nippon-mfg.jp", phone: "078-890-1234", status: "active", totalSpent: 3120000, lastContact: "2026-05-15" },
  { id: "CUS-009", name: "クラウドワークス・ジャパン", contactName: "小林 誠", email: "kobayashi@cw-japan.jp", phone: "03-9012-3456", status: "lead", totalSpent: 0, lastContact: "2026-05-20" },
  { id: "CUS-010", name: "株式会社ウミノ", contactName: "加藤 直樹", email: "kato@umino.jp", phone: "099-012-3456", status: "active", totalSpent: 756000, lastContact: "2026-05-11" },
];

// ---------- Inventory ----------

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
  price: number;
  category: string;
}

export const products: Product[] = [
  { id: "PRD-001", name: "ワイヤレスキーボード Pro", sku: "WK-PRO-001", stock: 124, threshold: 30, price: 8800, category: "周辺機器" },
  { id: "PRD-002", name: "USB-C ハブ 7-in-1", sku: "HUB-7IN1", stock: 18, threshold: 25, price: 4500, category: "周辺機器" },
  { id: "PRD-003", name: "27インチ 4K モニター", sku: "MON-4K-27", stock: 42, threshold: 15, price: 42000, category: "ディスプレイ" },
  { id: "PRD-004", name: "ノートPCスタンド アルミ", sku: "STND-ALU", stock: 7, threshold: 20, price: 3200, category: "アクセサリ" },
  { id: "PRD-005", name: "ノイズキャンセリングヘッドホン", sku: "HP-NC-100", stock: 56, threshold: 20, price: 19800, category: "オーディオ" },
  { id: "PRD-006", name: "Webカメラ フルHD", sku: "CAM-FHD", stock: 3, threshold: 15, price: 6700, category: "周辺機器" },
  { id: "PRD-007", name: "エルゴノミクスマウス", sku: "MS-ERGO", stock: 89, threshold: 30, price: 5400, category: "周辺機器" },
  { id: "PRD-008", name: "ポータブルSSD 1TB", sku: "SSD-1TB", stock: 12, threshold: 25, price: 14500, category: "ストレージ" },
  { id: "PRD-009", name: "デスクライト LED", sku: "LGT-LED-01", stock: 64, threshold: 20, price: 4900, category: "アクセサリ" },
  { id: "PRD-010", name: "モバイルバッテリー 20000mAh", sku: "BAT-20K", stock: 21, threshold: 40, price: 3980, category: "アクセサリ" },
];

// ---------- Tasks ----------

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string; // ISO date
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export const tasks: Task[] = [
  { id: "TSK-01", title: "サクラ商事への提案書作成", description: "新規プランの提案資料をまとめる", status: "in_progress", priority: "high", assignee: "佐藤 健一", dueDate: "2026-06-08" },
  { id: "TSK-02", title: "月次売上レポートの作成", description: "5月度の売上をダッシュボード化", status: "todo", priority: "medium", assignee: "鈴木 大輔", dueDate: "2026-06-10" },
  { id: "TSK-03", title: "在庫補充の発注（Webカメラ）", description: "在庫しきい値を下回ったため発注", status: "todo", priority: "high", assignee: "田中 美咲", dueDate: "2026-06-06" },
  { id: "TSK-04", title: "新規リードへのフォローアップ", description: "ひかりソリューションズへ電話", status: "in_progress", priority: "medium", assignee: "山田 花子", dueDate: "2026-06-07" },
  { id: "TSK-05", title: "請求書 INV-1039 の督促", description: "支払い遅延の確認連絡", status: "todo", priority: "high", assignee: "高橋 翔", dueDate: "2026-06-05" },
  { id: "TSK-06", title: "Webサイトの商品ページ更新", description: "新商品の写真と説明を追加", status: "done", priority: "low", assignee: "中村 智子", dueDate: "2026-06-01" },
  { id: "TSK-07", title: "顧客満足度アンケートの集計", description: "Q2アンケート結果のまとめ", status: "done", priority: "medium", assignee: "渡辺 隆", dueDate: "2026-05-30" },
  { id: "TSK-08", title: "四半期ミーティングの準備", description: "アジェンダと資料の用意", status: "in_progress", priority: "low", assignee: "小林 誠", dueDate: "2026-06-12" },
  { id: "TSK-09", title: "新人スタッフのオンボーディング", description: "システムの使い方をレクチャー", status: "todo", priority: "low", assignee: "加藤 直樹", dueDate: "2026-06-15" },
];

// ---------- Dashboard aggregates ----------

export interface MonthlySales {
  month: string;
  sales: number;
  target: number;
}

export const monthlySales: MonthlySales[] = [
  { month: "1月", sales: 3200000, target: 3000000 },
  { month: "2月", sales: 2850000, target: 3000000 },
  { month: "3月", sales: 4100000, target: 3500000 },
  { month: "4月", sales: 3780000, target: 3500000 },
  { month: "5月", sales: 4520000, target: 4000000 },
  { month: "6月", sales: 2890000, target: 4000000 },
];

export interface WeeklySales {
  week: string;
  sales: number;
}

export const weeklySales: WeeklySales[] = [
  { week: "第1週", sales: 980000 },
  { week: "第2週", sales: 1240000 },
  { week: "第3週", sales: 760000 },
  { week: "第4週", sales: 1420000 },
];

// ---------- Derived helpers ----------

export function getCurrentMonthSales() {
  return monthlySales[monthlySales.length - 1].sales;
}

export function getNewCustomersThisMonth() {
  return customers.filter((c) => c.status === "lead").length + 3;
}

export function getLowStockProducts() {
  return products.filter((p) => p.stock <= p.threshold);
}

export function getOpenTasks() {
  return tasks.filter((t) => t.status !== "done");
}

export function getTaskStatusBreakdown() {
  return (Object.keys(taskStatusLabels) as TaskStatus[]).map((status) => ({
    status,
    label: taskStatusLabels[status],
    count: tasks.filter((t) => t.status === status).length,
  }));
}
