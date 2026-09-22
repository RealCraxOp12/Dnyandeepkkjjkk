const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRaw`ALTER TABLE "Staff" ADD COLUMN "assignedSubject" TEXT;`;
    console.log("Column added successfully!");
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
