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
  const isProd = process.env.NODE_ENV === 'production';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME ?? 'Platform';
  const lastName = process.env.ADMIN_LAST_NAME ?? 'Admin';
  const resetPassword = process.env.ADMIN_RESET_PASSWORD === 'true';

  if (!email?.trim()) {
    throw new Error('ADMIN_EMAIL is required to seed the platform admin');
  }
  if (!password || password.length < 12) {
    throw new Error(
      'ADMIN_PASSWORD is required and must be at least 12 characters',
    );
  }
  if (isProd && password === 'Admin12345') {
    throw new Error(
      'Refuse to seed production with the documented example ADMIN_PASSWORD',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

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
          ...(resetPassword ? { passwordHash } : {}),
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
  if (existing && !resetPassword) {
    console.log(
      'Existing admin password left unchanged (set ADMIN_RESET_PASSWORD=true to rotate).',
    );
  }
  console.log(
    'Login: POST /auth/login with email/password and no organizationSlug',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
