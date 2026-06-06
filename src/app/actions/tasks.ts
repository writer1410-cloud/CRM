"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { TaskStatus } from "@/lib/mock-data";

export async function updateTaskStatusAction(id: string, status: TaskStatus) {
  await prisma.task.update({
    where: { id },
    data: {
      status: status as Parameters<
        typeof prisma.task.update
      >[0]["data"]["status"],
    },
  });

  revalidatePath("/tasks");
}
