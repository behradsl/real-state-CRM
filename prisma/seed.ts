import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@platform.local';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin12345';
  const firstName = process.env.ADMIN_FIRST_NAME ?? 'Platform';
  const lastName = process.env.ADMIN_LAST_NAME ?? 'Admin';

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findFirst({
    where: {
      email,
      role: UserRole.ADMIN,
      organizationId: null,
    },
  });

  const admin = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          firstName,
          lastName,
          isActive: true,
        },
      })
    : await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: UserRole.ADMIN,
          isActive: true,
          organizationId: null,
        },
      });

  console.log(`Platform ADMIN ready: ${admin.email} (id=${admin.id})`);
  console.log('Login: POST /auth/login with email/password and no organizationSlug');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
