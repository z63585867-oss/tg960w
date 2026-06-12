import { PrismaClient as PC } from "@/prisma-client/client";
import type { PrismaClient } from "@/prisma-client/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "file:./prisma/skillos.db";

  const adapterUrl =
    dbUrl.startsWith("libsql://") || dbUrl.startsWith("http")
      ? dbUrl
      : dbUrl.startsWith("file:")
        ? dbUrl
        : `file:${dbUrl}`;

  const adapter = new PrismaLibSql({ url: adapterUrl });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PC as any)({ adapter }) as PrismaClient;
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// Safe wrapper with retry
export async function safeQuery<T>(fn: (db: PrismaClient) => Promise<T>, fallback: T): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const db = getPrisma();
      return await fn(db);
    } catch (e: any) {
      if (attempt === 2) {
        console.error(`DB query failed after 3 attempts: ${e.message}`);
        return fallback;
      }
      // Wait before retry (100ms, 500ms, 1s)
      await new Promise((r) => setTimeout(r, [100, 500, 1000][attempt]));
    }
  }
  return fallback;
}

const prisma = getPrisma();
export { prisma };
export default prisma;
