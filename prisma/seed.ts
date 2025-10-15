import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create cooperators
  const cooperator1 = await prisma.cooperator.create({
    data: {
      name: 'Wellness App Co',
      email: 'api@wellnessapp.com',
      description: 'A wellness and fitness aggregator platform',
      isActive: true,
    },
  });

  const cooperator2 = await prisma.cooperator.create({
    data: {
      name: 'FitConnect',
      email: 'api@fitconnect.com',
      description: 'Fitness class booking platform',
      isActive: true,
    },
  });

  console.log('✓ Created cooperators');

  // Create API keys for cooperators
  // In production, these would be properly generated and hashed
  const apiKey1Hash = await bcrypt.hash('wellness_api_key_123', 10);
  await prisma.apiKey.create({
    data: {
      cooperatorId: cooperator1.id,
      keyHash: apiKey1Hash,
      name: 'Production Key',
      isActive: true,
    },
  });

  const apiKey2Hash = await bcrypt.hash('fitconnect_api_key_456', 10);
  await prisma.apiKey.create({
    data: {
      cooperatorId: cooperator2.id,
      keyHash: apiKey2Hash,
      name: 'Production Key',
      isActive: true,
    },
  });

  console.log('✓ Created API keys');

  // Create venues
  const venue1 = await prisma.venue.create({
    data: {
      name: 'Zen Yoga Studio',
      email: 'contact@zenyoga.com',
      phone: '+1-555-0101',
      address: '123 Peaceful Lane',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US',
      description: 'A tranquil space for yoga and mindfulness',
      website: 'https://zenyoga.com',
      isActive: true,
      apiEnabled: true,
    },
  });

  const venue2 = await prisma.venue.create({
    data: {
      name: 'Flow Fitness',
      email: 'hello@flowfitness.com',
      phone: '+1-555-0102',
      address: '456 Wellness Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'US',
      description: 'Modern yoga and fitness studio',
      website: 'https://flowfitness.com',
      isActive: true,
      apiEnabled: true,
    },
  });

  const venue3 = await prisma.venue.create({
    data: {
      name: 'Harmony Studio',
      email: 'info@harmonystudio.com',
      phone: '+1-555-0103',
      address: '789 Balance Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      description: 'Traditional yoga studio with certified instructors',
      website: 'https://harmonystudio.com',
      isActive: true,
      apiEnabled: false, // Not enabled for API access
    },
  });

  console.log('✓ Created venues');

  // Create venue-cooperator relationships (access control)
  await prisma.venueCooperator.create({
    data: {
      venueId: venue1.id,
      cooperatorId: cooperator1.id,
      isActive: true,
    },
  });

  await prisma.venueCooperator.create({
    data: {
      venueId: venue2.id,
      cooperatorId: cooperator1.id,
      isActive: true,
    },
  });

  await prisma.venueCooperator.create({
    data: {
      venueId: venue1.id,
      cooperatorId: cooperator2.id,
      isActive: true,
    },
  });

  console.log('✓ Created venue-cooperator relationships');

  // Create classes for venues
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfterTomorrow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Zen Yoga Studio classes
  await prisma.class.createMany({
    data: [
      {
        venueId: venue1.id,
        name: 'Morning Vinyasa Flow',
        description: 'Start your day with an energizing vinyasa flow',
        instructorName: 'Sarah Johnson',
        startTime: new Date(tomorrow.setHours(7, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
        spotsTotal: 20,
        spotsAvailable: 20,
        price: 25.00,
        isActive: true,
        difficultyLevel: 'Intermediate',
      },
      {
        venueId: venue1.id,
        name: 'Gentle Yoga',
        description: 'Relaxing and restorative yoga practice',
        instructorName: 'Emily Chen',
        startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
        spotsTotal: 15,
        spotsAvailable: 15,
        price: 20.00,
        isActive: true,
        difficultyLevel: 'Beginner',
      },
      {
        venueId: venue1.id,
        name: 'Power Yoga',
        description: 'Intense workout combining strength and flexibility',
        instructorName: 'Michael Torres',
        startTime: new Date(tomorrow.setHours(18, 30, 0, 0)),
        endTime: new Date(tomorrow.setHours(19, 30, 0, 0)),
        spotsTotal: 25,
        spotsAvailable: 25,
        price: 30.00,
        isActive: true,
        difficultyLevel: 'Advanced',
      },
    ],
  });

  // Flow Fitness classes
  await prisma.class.createMany({
    data: [
      {
        venueId: venue2.id,
        name: 'Sunrise Yoga',
        description: 'Wake up with the sun',
        instructorName: 'Lisa Anderson',
        startTime: new Date(tomorrow.setHours(6, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(7, 0, 0, 0)),
        spotsTotal: 30,
        spotsAvailable: 30,
        price: 28.00,
        isActive: true,
        difficultyLevel: 'Intermediate',
      },
      {
        venueId: venue2.id,
        name: 'Hot Yoga',
        description: 'Heated room yoga for deep stretching',
        instructorName: 'David Kim',
        startTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(13, 15, 0, 0)),
        spotsTotal: 20,
        spotsAvailable: 18, // Some spots already taken
        price: 35.00,
        isActive: true,
        difficultyLevel: 'Intermediate',
      },
    ],
  });

  // Harmony Studio classes (venue not enabled for API)
  await prisma.class.create({
    data: {
      venueId: venue3.id,
      name: 'Traditional Hatha Yoga',
      description: 'Classic yoga practice',
      instructorName: 'Priya Sharma',
      startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(10, 30, 0, 0)),
      spotsTotal: 12,
      spotsAvailable: 12,
      price: 22.00,
      isActive: true,
      difficultyLevel: 'Beginner',
    },
  });

  console.log('✓ Created classes');

  console.log('');
  console.log('='.repeat(60));
  console.log('Database seeded successfully!');
  console.log('='.repeat(60));
  console.log('');
  console.log('Test Credentials:');
  console.log('-'.repeat(60));
  console.log('Cooperator 1: Wellness App Co');
  console.log('  API Key: wellness_api_key_123');
  console.log('  Has access to: Zen Yoga Studio, Flow Fitness');
  console.log('');
  console.log('Cooperator 2: FitConnect');
  console.log('  API Key: fitconnect_api_key_456');
  console.log('  Has access to: Zen Yoga Studio');
  console.log('');
  console.log('-'.repeat(60));
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
