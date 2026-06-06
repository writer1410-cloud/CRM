// Database seed script.
// -----------------------------------------------------------------------------
// Loads the same demo dataset the UI uses (src/lib/mock-data.ts) into the
// database. Run with `npm run db:seed` after setting DATABASE_URL and applying
// the schema (`npm run db:push` or `npm run db:migrate`).

import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "node:crypto";

import {
  customers,
  sales,
  products,
  tasks,
} from "../src/lib/mock-data";

const prisma = new PrismaClient();

/** Hash a password with scrypt (salt:hash hex), matching src/auth.ts. */
function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  // Demo user — matches the credentials accepted by the login form.
  await prisma.user.upsert({
    where: { email: "admin@nexus-crm.jp" },
    update: {},
    create: {
      email: "admin@nexus-crm.jp",
      name: "田中 管理者",
      passwordHash: hashPassword("demo1234"),
      role: "admin",
    },
  });

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        contactName: c.contactName,
        email: c.email,
        phone: c.phone,
        status: c.status,
        totalSpent: c.totalSpent,
        lastContact: new Date(c.lastContact),
      },
    });
  }

  const customerByName = new Map(customers.map((c) => [c.name, c.id]));
  for (const s of sales) {
    await prisma.sale.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        date: new Date(s.date),
        customerName: s.customerName,
        amount: s.amount,
        status: s.status,
        customerId: customerByName.get(s.customerName) ?? null,
      },
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        threshold: p.threshold,
        price: p.price,
        category: p.category,
      },
    });
  }

  for (const t of tasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
        dueDate: new Date(t.dueDate),
      },
    });
  }

  console.log("✅ Seed complete:", {
    users: 1,
    customers: customers.length,
    sales: sales.length,
    products: products.length,
    tasks: tasks.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
