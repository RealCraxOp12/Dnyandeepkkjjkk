const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const title = 'Test';
    const targetClass = 'Class 4th';
    const subject = 'Hindi';
    const fileUrl = null;
    
    // First, let's see if the table exists at all by trying a simple raw query
    const check = await prisma.$queryRawUnsafe(`SELECT 1 FROM "Syllabus" LIMIT 1`);
    console.log('Table exists!', check);

    const res = await prisma.$executeRawUnsafe(`
      INSERT INTO "Syllabus" ("id", "title", "targetClass", "subject", "fileUrl", "createdAt", "updatedAt") 
      VALUES ('cuid_test', 'Test', 'Class 4th', 'Hindi', null, NOW(), NOW())
    `);
    console.log('Success:', res);
  } catch(e) {
    console.error('Error:', e);
  }
}
main();
