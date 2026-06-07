import { Sidebar } from "@/components/layout/sidebar";
import { Header, type Notification } from "@/components/layout/header";
import {
  tasks as mockTasks,
  products as mockProducts,
} from "@/lib/mock-data";

const TODAY = "2026-06-07";

function buildNotifications(): Notification[] {
  const notifications: Notification[] = [];

  // Overdue tasks (status != done and dueDate < today)
  const overdueTasks = mockTasks.filter(
    (t) => t.status !== "done" && t.dueDate < TODAY
  );
  for (const task of overdueTasks) {
    notifications.push({
      id: `task-${task.id}`,
      type: "task",
      message: `期限超過: ${task.title}（${task.dueDate}）`,
      href: "/tasks",
    });
  }

  // Low stock products
  const lowStock = mockProducts.filter((p) => p.stock <= p.threshold);
  for (const product of lowStock) {
    notifications.push({
      id: `stock-${product.id}`,
      type: "stock",
      message: `在庫不足: ${product.name}（残${product.stock}/${product.threshold}）`,
      href: "/inventory",
    });
  }

  return notifications;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = buildNotifications();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header notifications={notifications} />
        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
