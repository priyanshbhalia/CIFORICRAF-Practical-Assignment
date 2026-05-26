import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed: Starting database seeding...');

  // 1. Clean existing records (Optional, but good for repeatability)
  await prisma.tree.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Seed: Cleared existing user and tree records.');

  // 2. Create default Admin User
  const adminEmail = 'admin@cifor-icraf.org';
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin Tree Monitor',
    },
  });
  console.log(`Seed: Created default admin user: ${adminUser.email}`);

  // 3. Create Seed Trees
  const treesData = [
    {
      species: 'Neem',
      latitude: -1.2921,
      longitude: 36.8219,
      plantingDate: new Date('2023-01-15'),
      health: 'Good',
    },
    {
      species: 'Neem',
      latitude: -1.2930,
      longitude: 36.8230,
      plantingDate: new Date('2023-03-10'),
      health: 'Good',
    },
    {
      species: 'Neem',
      latitude: -1.2945,
      longitude: 36.8210,
      plantingDate: new Date('2024-02-05'),
      health: 'Fair',
    },
    {
      species: 'Mango',
      latitude: -1.2915,
      longitude: 36.8250,
      plantingDate: new Date('2022-05-20'),
      health: 'Good',
    },
    {
      species: 'Mango',
      latitude: -1.2950,
      longitude: 36.8260,
      plantingDate: new Date('2022-06-15'),
      health: 'Poor',
    },
    {
      species: 'Teak',
      latitude: -1.2960,
      longitude: 36.8200,
      plantingDate: new Date('2021-11-01'),
      health: 'Good',
    },
    {
      species: 'Teak',
      latitude: -1.2970,
      longitude: 36.8215,
      plantingDate: new Date('2021-12-15'),
      health: 'Fair',
    },
    {
      species: 'Moringa',
      latitude: -1.2890,
      longitude: 36.8240,
      plantingDate: new Date('2023-08-20'),
      health: 'Good',
    },
    {
      species: 'Moringa',
      latitude: -1.2880,
      longitude: 36.8220,
      plantingDate: new Date('2023-09-01'),
      health: 'Good',
    },
    {
      species: 'Eucalyptus',
      latitude: -1.2905,
      longitude: 36.8280,
      plantingDate: new Date('2020-04-10'),
      health: 'Poor',
    },
  ];

  for (const tree of treesData) {
    await prisma.tree.create({
      data: tree,
    });
  }

  console.log(`Seed: Seeded ${treesData.length} tree records.`);
  console.log('Seed: Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed: Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
