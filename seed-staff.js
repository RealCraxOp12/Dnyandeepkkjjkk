const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const staff = await prisma.staff.upsert({
    where: { employeeId: 'EMP1001' },
    update: {},
    create: {
      employeeId: 'EMP1001',
      password: hashPassword('password123'),
      firstName: 'Rahul',
      surname: 'Sharma',
      role: 'TEACHER',
      assignedClass: '10th A',
      email: 'rahul.sharma@dems.edu.in'
    }
  });
  console.log('Seeded Staff:', staff);
}

main().catch(console.error).finally(() => prisma.$disconnect());
