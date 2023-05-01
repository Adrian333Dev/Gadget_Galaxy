import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = [
  {
    email: 'johndoe@gmail.com',
    username: 'johndoe',
    password: 'password123',
  },
  {
    email: 'janedoe@gmail.com',
    username: 'janedoe',
    password: 'password414',
  },
];

async function main() {
  for (const user of users) {
    const u = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(u);
  }
}

main()
  .catch((e) => (console.error(e), process.exit(1)))
  .finally(() => prisma.$disconnect());
