"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";

import {
  taskStatusLabels,
  taskPriorityLabels,
  type TaskStatus,
  type TaskPriority,
  type Task,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface TaskValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
}

const TODAY = "2026-06-07";

interface TaskDialogProps {
  mode: "create" | "edit";
  task?: Task;
  onSave: (values: TaskValues) => void;
  disabled?: boolean;
}

export function TaskDialog({ mode, task, onSave, disabled = false }: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [assignee, setAssignee] = useState(task?.assignee ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? TODAY);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    if (mode === "create") {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setAssignee("");
      setDueDate(TODAY);
    } else {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setStatus(task?.status ?? "todo");
      setPriority(task?.priority ?? "medium");
      setAssignee(task?.assignee ?? "");
      setDueDate(task?.dueDate ?? TODAY);
    }
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("タイトルを入力してください。");
      return;
    }
    if (!assignee.trim()) {
      setError("担当者を入力してください。");
      return;
    }
    if (!dueDate) {
      setError("期限を入力してください。");
      return;
    }
    onSave({ title: title.trim(), description: description.trim(), status, priority, assignee: assignee.trim(), dueDate });
    reset();
    setOpen(false);
  }

  const trigger = mode === "create" ? (
    <Button className="gap-2" disabled={disabled}>
      <Plus className="size-4" />
      新規タスク
    </Button>
  ) : (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 opacity-0 group-hover:opacity-100"
      disabled={disabled}
    >
      <Pencil className="size-3.5" />
      <span className="sr-only">編集</span>
    </Button>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "新規タスクの作成" : "タスクの編集"}</DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "タスクの詳細を入力してください。"
                : "タスクの情報を編集してください。"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">タイトル</Label>
              <Input
                id="task-title"
                placeholder="例: 提案書の作成"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-description">説明</Label>
              <Textarea
                id="task-description"
                placeholder="タスクの詳細を入力..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-status">ステータス</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                  <SelectTrigger id="task-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {taskStatusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">優先度</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                  <SelectTrigger id="task-priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(taskPriorityLabels) as TaskPriority[]).map((p) => (
                      <SelectItem key={p} value={p}>
                        {taskPriorityLabels[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">担当者</Label>
                <Input
                  id="task-assignee"
                  placeholder="例: 田中 太郎"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-due-date">期限</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit">{mode === "create" ? "作成する" : "保存する"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
