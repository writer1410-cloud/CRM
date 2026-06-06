// Prisma client singleton.
// -----------------------------------------------------------------------------
// Reuses a single PrismaClient across hot reloads in development to avoid
// exhausting the database connection pool. Import from here (not @prisma/client
// directly) wherever DB access is needed.
//
// NOTE: The app currently renders from src/lib/mock-data.ts. Swap those imports
// for queries through this client once DATABASE_URL is configured and the schema
// has been migrated/seeded.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
