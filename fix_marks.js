const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const records = await prisma.marksRecord.findMany({
    where: { marksObtained: { gt: 100 } }
  });
  
  for (const record of records) {
    await prisma.marksRecord.update({
      where: { id: record.id },
      data: { marksObtained: 100 }
    });
  }
  console.log(`Fixed ${records.length} records.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
