import { prisma } from "@/lib/prisma";
import { products as mockProducts, type Product } from "@/lib/mock-data";
import { InventoryView } from "@/components/inventory/inventory-view";

export default async function InventoryPage() {
  let initialProducts: Product[] = mockProducts;

  try {
    if (process.env.DATABASE_URL) {
      const rows = await prisma.product.findMany({ orderBy: { name: "asc" } });
      initialProducts = rows.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        threshold: p.threshold,
        price: p.price,
        category: p.category,
      }));
    }
  } catch {
    // DB unreachable → fall back to mock data
  }

  return <InventoryView initialProducts={initialProducts} />;
}
