import { PrismaClient as PC } from '@/prisma-client/client';
import type { PrismaClient } from '@/prisma-client/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || 'file:./prisma/skillos.db';

  const adapterUrl = dbUrl.startsWith('libsql://') || dbUrl.startsWith('http')
    ? dbUrl
    : dbUrl.startsWith('file:') ? dbUrl : `file:${dbUrl}`;

  const adapter = new PrismaLibSql({
    url: adapterUrl,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PC as any)({ adapter }) as PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
