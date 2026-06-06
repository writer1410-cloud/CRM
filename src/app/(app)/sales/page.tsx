export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { sales as mockSales, type Sale, type SaleStatus } from "@/lib/mock-data";
import { SalesView } from "@/components/sales/sales-view";

export default async function SalesPage() {
  let initialSales: Sale[] = mockSales;

  try {
    if (process.env.DATABASE_URL) {
      const rows = await prisma.sale.findMany({ orderBy: { date: "desc" } });
      initialSales = rows.map((s) => ({
        id: s.id,
        date: s.date.toISOString().slice(0, 10),
        customerName: s.customerName,
        amount: s.amount,
        status: s.status as SaleStatus,
      }));
    }
  } catch {
    // DB unreachable → fall back to mock data
  }

  return <SalesView initialSales={initialSales} />;
}
