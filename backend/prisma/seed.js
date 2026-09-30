import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'USUARIO';
  const password = process.env.ADMIN_PASSWORD || 'CONTRASENA';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', name: process.env.ADMIN_NAME || 'Administrador Gricel' },
    create: {
      name: process.env.ADMIN_NAME || 'Administrador Gricel',
      email,
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log(`Admin listo: ${email}`);
}

main().finally(() => prisma.$disconnect());
