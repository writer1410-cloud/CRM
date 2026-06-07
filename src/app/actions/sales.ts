"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { SaleStatus } from "@/lib/mock-data";

export async function createSaleAction(values: {
  date: string;
  customerName: string;
  amount: number;
  status: SaleStatus;
}): Promise<{ error?: string }> {
  try {
    const latest = await prisma.sale.findFirst({ orderBy: { id: "desc" } });
    const maxNum = latest
      ? parseInt(latest.id.replace(/\D/g, ""), 10)
      : 1042;
    const newId = `INV-${isNaN(maxNum) ? 1043 : maxNum + 1}`;

    await prisma.sale.create({
      data: {
        id: newId,
        date: new Date(values.date),
        customerName: values.customerName,
        amount: values.amount,
        status: values.status as Parameters<
          typeof prisma.sale.create
        >[0]["data"]["status"],
      },
    });

    revalidatePath("/sales");
    return {};
  } catch (e) {
    console.error("[createSaleAction]", e);
    return { error: "DB保存に失敗しました。Vercel の DATABASE_URL を確認してください。" };
  }
}
