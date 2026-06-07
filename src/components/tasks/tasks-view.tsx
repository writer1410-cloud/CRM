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
import {
  updateTaskStatusAction,
  createTaskAction,
  updateTaskAction,
} from "@/app/actions/tasks";
import { TaskDialog, type TaskValues } from "./task-dialog";

const TODAY = "2026-06-07";

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
  onEdit,
  isPending,
}: {
  task: Task;
  onDragStart: (id: string) => void;
  onEdit: (task: Task, values: TaskValues) => void;
  isPending: boolean;
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
        <div className="flex items-center gap-1">
          <TaskDialog
            mode="edit"
            task={task}
            onSave={(values) => onEdit(task, values)}
            disabled={isPending}
          />
          <GripVertical className="text-muted-foreground/40 size-4 shrink-0" />
        </div>
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

type OptimisticAction =
  | { type: "status"; id: string; status: TaskStatus }
  | { type: "update"; id: string; values: TaskValues }
  | { type: "create"; task: Task };

function tasksReducer(state: Task[], action: OptimisticAction): Task[] {
  switch (action.type) {
    case "status":
      return state.map((t) =>
        t.id === action.id ? { ...t, status: action.status } : t
      );
    case "update":
      return state.map((t) =>
        t.id === action.id ? { ...t, ...action.values } : t
      );
    case "create":
      return [action.task, ...state];
  }
}

interface TasksViewProps {
  initialTasks: Task[];
}

export function TasksView({ initialTasks }: TasksViewProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const [optimisticTasks, dispatch] = useOptimistic(initialTasks, tasksReducer);

  function handleDrop(status: TaskStatus) {
    if (!draggedId) return;

    const id = draggedId;
    setDraggedId(null);
    setDragOverColumn(null);

    setSaveError(null);
    startTransition(async () => {
      dispatch({ type: "status", id, status });
      const result = await updateTaskStatusAction(id, status);
      if (result.error) setSaveError(result.error);
    });
  }

  function handleCreate(values: TaskValues) {
    const maxNumber = optimisticTasks.reduce((max, t) => {
      const n = Number(t.id.replace(/\D/g, ""));
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 9);
    const optimisticId = `TSK-${String(maxNumber + 1).padStart(2, "0")}`;
    const optimistic: Task = { id: optimisticId, ...values };

    setSaveError(null);
    startTransition(async () => {
      dispatch({ type: "create", task: optimistic });
      const result = await createTaskAction(values);
      if (result.error) setSaveError(result.error);
    });
  }

  function handleEdit(task: Task, values: TaskValues) {
    setSaveError(null);
    startTransition(async () => {
      dispatch({ type: "update", id: task.id, values });
      const result = await updateTaskAction(task.id, values);
      if (result.error) setSaveError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          タスクをドラッグしてステータスを変更できます。
        </p>
        <TaskDialog mode="create" onSave={handleCreate} disabled={isPending} />
      </div>

      {saveError && (
        <div className="bg-destructive/10 text-destructive border-destructive/30 rounded-none border px-4 py-3 text-sm">
          ⚠️ {saveError}
        </div>
      )}
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
                    onEdit={handleEdit}
                    isPending={isPending}
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
