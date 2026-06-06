export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import {
  tasks as mockTasks,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/mock-data";
import { TasksView } from "@/components/tasks/tasks-view";

export default async function TasksPage() {
  let initialTasks: Task[] = mockTasks;

  try {
    if (process.env.DATABASE_URL) {
      const rows = await prisma.task.findMany({ orderBy: { dueDate: "asc" } });
      initialTasks = rows.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status as TaskStatus,
        priority: t.priority as TaskPriority,
        assignee: t.assignee,
        dueDate: t.dueDate.toISOString().slice(0, 10),
      }));
    }
  } catch {
    // DB unreachable → fall back to mock data
  }

  return <TasksView initialTasks={initialTasks} />;
}
