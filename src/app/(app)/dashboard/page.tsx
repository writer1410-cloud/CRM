import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  DollarSign,
  ListTodo,
  Package,
  UserPlus,
} from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/utils";
import {
  getCurrentMonthSales,
  getLowStockProducts,
  getNewCustomersThisMonth,
  getOpenTasks,
  tasks,
  taskPriorityLabels,
  type TaskPriority,
} from "@/lib/mock-data";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TaskStatusChart } from "@/components/dashboard/task-status-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const priorityVariant: Record<
  TaskPriority,
  "destructive" | "warning" | "secondary"
> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

export default function DashboardPage() {
  const currentSales = getCurrentMonthSales();
  const newCustomers = getNewCustomersThisMonth();
  const lowStock = getLowStockProducts();
  const openTasks = getOpenTasks();

  const upcomingTasks = [...openTasks]
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="今月の売上"
          value={formatCurrency(currentSales)}
          icon={DollarSign}
          change={-12.4}
          accentClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-950"
        />
        <SummaryCard
          title="新規顧客数"
          value={`${newCustomers} 件`}
          icon={UserPlus}
          change={8.1}
          accentClassName="bg-blue-100 text-blue-600 dark:bg-blue-950"
        />
        <SummaryCard
          title="在庫アラート"
          value={`${lowStock.length} 件`}
          icon={Package}
          hint="しきい値を下回る商品"
          accentClassName="bg-amber-100 text-amber-600 dark:bg-amber-950"
        />
        <SummaryCard
          title="未完了タスク"
          value={`${openTasks.length} 件`}
          icon={ListTodo}
          hint="未着手・進行中の合計"
          accentClassName="bg-violet-100 text-violet-600 dark:bg-violet-950"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <TaskStatusChart />
      </div>

      {/* Lower section: upcoming tasks + low stock alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle>直近のタスク</CardTitle>
              <CardDescription>期限が近い未完了タスク</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks">
                すべて表示
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {task.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    担当: {task.assignee}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={priorityVariant[task.priority]}>
                    {taskPriorityLabels[task.priority]}
                  </Badge>
                  <span className="text-muted-foreground w-20 text-right text-xs">
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-amber-500 size-4" />
                在庫アラート
              </CardTitle>
              <CardDescription>補充が必要な商品</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/inventory">
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {lowStock.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {product.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {product.sku}
                  </span>
                </div>
                <Badge
                  variant={product.stock <= product.threshold / 2 ? "destructive" : "warning"}
                >
                  残 {product.stock}
                </Badge>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-sm">
                在庫アラートはありません
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Helper note (mock data) */}
      <p className="text-muted-foreground text-center text-xs">
        ※ 現在はモックデータを表示しています。データベース接続（Prisma +
        PostgreSQL）は後続ステップで実装予定です。 全{" "}
        {tasks.length} タスク中 {openTasks.length} 件が未完了。
      </p>
    </div>
  );
}
