import { prisma } from "@/lib/prisma";
import {
  customers as mockCustomers,
  type Customer,
  type CustomerStatus,
} from "@/lib/mock-data";
import { CustomersView } from "@/components/customers/customers-view";

export default async function CustomersPage() {
  let initialCustomers: Customer[] = mockCustomers;

  try {
    if (process.env.DATABASE_URL) {
      const rows = await prisma.customer.findMany({
        orderBy: { lastContact: "desc" },
      });
      initialCustomers = rows.map((c) => ({
        id: c.id,
        name: c.name,
        contactName: c.contactName,
        email: c.email,
        phone: c.phone,
        status: c.status as CustomerStatus,
        totalSpent: c.totalSpent,
        lastContact: c.lastContact.toISOString().slice(0, 10),
      }));
    }
  } catch {
    // DB unreachable → fall back to mock data
  }

  return <CustomersView initialCustomers={initialCustomers} />;
}
