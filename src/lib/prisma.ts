import { PrismaClient } from '@prisma/client';

// Load environment variables first
import 'dotenv/config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 requires explicit options in constructor
class PrismaClientInstance extends PrismaClient {
  constructor() {
    super({
      log: ['error']
    });
  }
}

export const prisma = globalForPrisma.prisma || new PrismaClientInstance();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
