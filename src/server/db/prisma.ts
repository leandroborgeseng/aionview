import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getConnectionString() {
  // Durante o build (especialmente no Railway), DATABASE_URL pode não estar disponível.
  // Usamos um fallback apenas para evitar quebra de build-time import.
  return (
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/postgres"
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: getConnectionString() }),
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

