import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const adminEmail = 'admin@passwordmanager.com';
  const adminPassword = 'Admin@123!';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const passwordExpiresAt = new Date();
    passwordExpiresAt.setDate(passwordExpiresAt.getDate() + 90); // 90 days from now

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Administrator',
        passwordExpiresAt,
        lastPasswordChange: new Date(),
      },
    });

    console.log('✓ Default admin user created:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('  ⚠️  Please change this password after your first login!');
  } else {
    console.log('✓ Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

