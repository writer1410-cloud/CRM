"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { CustomerStatus } from "@/lib/mock-data";

export async function createCustomerAction(values: {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}): Promise<{ error?: string }> {
  try {
    const latest = await prisma.customer.findFirst({ orderBy: { id: "desc" } });
    const maxNum = latest
      ? parseInt(latest.id.replace(/\D/g, ""), 10)
      : 10;
    const newId = `CUS-${String(isNaN(maxNum) ? 11 : maxNum + 1).padStart(3, "0")}`;

    await prisma.customer.create({
      data: {
        id: newId,
        name: values.name,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        status: values.status as Parameters<
          typeof prisma.customer.create
        >[0]["data"]["status"],
        totalSpent: 0,
        lastContact: new Date(),
      },
    });

    revalidatePath("/customers");
    return {};
  } catch (e) {
    console.error("[createCustomerAction]", e);
    return { error: "DB保存に失敗しました。Vercel の DATABASE_URL を確認してください。" };
  }
}
