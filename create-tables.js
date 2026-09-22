const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Syllabus" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "targetClass" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "fileUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Syllabus_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('Syllabus created:', res);

    const res2 = await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Note" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "targetClass" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "fileUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('Note created:', res2);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
