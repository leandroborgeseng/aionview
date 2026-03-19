import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // No build do Railway, DATABASE_URL pode não existir ainda.
    // Mantemos fallback para permitir `prisma generate` sem falhar.
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/postgres",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});

