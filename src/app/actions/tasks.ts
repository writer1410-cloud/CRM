"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { TaskStatus, TaskPriority } from "@/lib/mock-data";

export async function updateTaskStatusAction(
  id: string,
  status: TaskStatus
): Promise<{ error?: string }> {
  try {
    await prisma.task.update({
      where: { id },
      data: {
        status: status as Parameters<
          typeof prisma.task.update
        >[0]["data"]["status"],
      },
    });

    revalidatePath("/tasks");
    return {};
  } catch (e) {
    console.error("[updateTaskStatusAction]", e);
    return { error: "DB保存に失敗しました。" };
  }
}

export async function createTaskAction(values: {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
}): Promise<{ error?: string }> {
  try {
    const latest = await prisma.task.findFirst({ orderBy: { id: "desc" } });
    const maxNum = latest
      ? parseInt(latest.id.replace(/\D/g, ""), 10)
      : 9;
    const newId = `TSK-${String(isNaN(maxNum) ? 10 : maxNum + 1).padStart(2, "0")}`;

    await prisma.task.create({
      data: {
        id: newId,
        title: values.title,
        description: values.description,
        status: values.status as Parameters<
          typeof prisma.task.create
        >[0]["data"]["status"],
        priority: values.priority as Parameters<
          typeof prisma.task.create
        >[0]["data"]["priority"],
        assignee: values.assignee,
        dueDate: new Date(values.dueDate),
      },
    });

    revalidatePath("/tasks");
    return {};
  } catch (e) {
    console.error("[createTaskAction]", e);
    return { error: "DB保存に失敗しました。" };
  }
}

export async function updateTaskAction(
  id: string,
  values: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    dueDate: string;
  }
): Promise<{ error?: string }> {
  try {
    await prisma.task.update({
      where: { id },
      data: {
        title: values.title,
        description: values.description,
        status: values.status as Parameters<
          typeof prisma.task.update
        >[0]["data"]["status"],
        priority: values.priority as Parameters<
          typeof prisma.task.update
        >[0]["data"]["priority"],
        assignee: values.assignee,
        dueDate: new Date(values.dueDate),
      },
    });

    revalidatePath("/tasks");
    return {};
  } catch (e) {
    console.error("[updateTaskAction]", e);
    return { error: "DB保存に失敗しました。" };
  }
}
