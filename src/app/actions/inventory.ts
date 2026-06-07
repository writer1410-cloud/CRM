"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function updateProductAction(
  id: string,
  values: {
    name: string;
    stock: number;
    threshold: number;
    price: number;
    category: string;
  }
): Promise<{ error?: string }> {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: values.name,
        stock: values.stock,
        threshold: values.threshold,
        price: values.price,
        category: values.category,
      },
    });

    revalidatePath("/inventory");
    return {};
  } catch (e) {
    console.error("[updateProductAction]", e);
    return { error: "DB保存に失敗しました。Vercel の DATABASE_URL を確認してください。" };
  }
}

export async function importProductsFromCSVAction(
  rows: Array<{ name: string; sku: string; stock: string | number; threshold: string | number; price: string | number; category: string }>
): Promise<{ imported: number; error?: string }> {
  try {
    let imported = 0;
    for (const row of rows) {
      const latest = await prisma.product.findFirst({ orderBy: { id: "desc" } });
      const maxNum = latest
        ? parseInt(latest.id.replace(/\D/g, ""), 10)
        : 10;
      const newId = `PRD-${String(isNaN(maxNum) ? 11 : maxNum + 1).padStart(3, "0")}`;

      await prisma.product.create({
        data: {
          id: newId,
          name: row.name,
          sku: row.sku,
          stock: Number(row.stock) || 0,
          threshold: Number(row.threshold) || 0,
          price: Number(row.price) || 0,
          category: row.category || "その他",
        },
      });
      imported++;
    }

    revalidatePath("/inventory");
    return { imported };
  } catch (e) {
    console.error("[importProductsFromCSVAction]", e);
    return { imported: 0, error: "CSVインポートに失敗しました。" };
  }
}
