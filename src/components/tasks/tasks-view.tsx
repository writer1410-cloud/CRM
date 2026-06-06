"use client";

import { useOptimistic, useState, useTransition } from "react";
import { CalendarDays, GripVertical } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import {
  taskStatusLabels,
  taskPriorityLabels,
  type Task,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updateTaskStatusAction } from "@/app/actions/tasks";

const TODAY = "2026-06-06";

const columns: TaskStatus[] = ["todo", "in_progress", "done"];

const columnAccent: Record<TaskStatus, string> = {
  todo: "border-t-brand-orange",
  in_progress: "border-t-brand-blue",
  done: "border-t-brand-green",
};

const priorityVariant: Record<
  TaskPriority,
  "destructive" | "warning" | "secondary"
> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

function initials(name: string) {
  return name.replace(/\s/g, "").slice(0, 2);
}

function TaskCard({
  task,
  onDragStart,
}: {
  task: Task;
  onDragStart: (id: string) => void;
}) {
  const isOverdue = task.status !== "done" && task.dueDate < TODAY;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      className="bg-card group flex cursor-grab flex-col gap-2 border p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant={priorityVariant[task.priority]}>
          優先度: {taskPriorityLabels[task.priority]}
        </Badge>
        <GripVertical className="text-muted-foreground/40 size-4 shrink-0" />
      </div>

      <p className="text-sm leading-snug font-semibold">{task.title}</p>
      <p className="text-muted-foreground line-clamp-2 text-xs">
        {task.description}
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs",
            isOverdue ? "text-brand-red font-medium" : "text-muted-foreground"
          )}
        >
          <CalendarDays className="size-3.5" />
          {formatDate(task.dueDate)}
        </span>
        <div className="flex items-center gap-1.5">
          <Avatar className="size-6">
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
              {initials(task.assignee)}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-xs">{task.assignee}</span>
        </div>
      </div>
    </div>
  );
}

interface TasksViewProps {
  initialTasks: Task[];
}

export function TasksView({ initialTasks }: TasksViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [, startTransition] = useTransition();

  const [optimisticTasks, updateOptimisticTask] = useOptimistic(
    initialTasks,
    (
      state: Task[],
      { id, status }: { id: string; status: TaskStatus }
    ) => state.map((t) => (t.id === id ? { ...t, status } : t))
  );

  function handleDrop(status: TaskStatus) {
    if (!draggedId) return;

    const id = draggedId;
    setDraggedId(null);
    setDragOverColumn(null);

    startTransition(async () => {
      updateOptimisticTask({ id, status });
      await updateTaskStatusAction(id, status);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid items-start gap-4 lg:grid-cols-3">
        {columns.map((status) => {
          const columnTasks = optimisticTasks.filter(
            (t) => t.status === status
          );
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(status);
              }}
              onDragLeave={() =>
                setDragOverColumn((c) => (c === status ? null : c))
              }
              onDrop={() => handleDrop(status)}
              className={cn(
                "bg-secondary/60 flex flex-col gap-3 border border-t-2 p-3 transition-colors",
                columnAccent[status],
                dragOverColumn === status && "bg-accent ring-primary/40 ring-2"
              )}
            >
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold">
                  {taskStatusLabels[status]}
                </h2>
                <Badge variant="outline" className="tabular-nums">
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="flex min-h-24 flex-col gap-3">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={setDraggedId}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-muted-foreground flex flex-1 items-center justify-center border border-dashed py-8 text-xs">
                    ここにドラッグして移動
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-muted-foreground text-xs">
        ※ カードをドラッグして、ステータス間で移動できます。
      </p>
    </div>
  );
}
