import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Attempting to connect to database...');
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful:', result);
    
    console.log('Testing player reachability...');
    const player = await prisma.player.findFirst();
    console.log('Player found:', player);
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
