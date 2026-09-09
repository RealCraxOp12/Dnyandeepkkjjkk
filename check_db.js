const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany({
    select: { id: true, firstName: true, currentClass: true, activeStatus: true }
  });
  console.log("All Students:");
  console.log(students);

  const exams = await prisma.exam.findMany();
  console.log("All Exams:");
  console.log(exams);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
