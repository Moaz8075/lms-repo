import { PrismaClient, UserRole, OrganizationStatus, CaseStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

const SEED = {
  organization: {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'LegalEase Demo Firm',
    slug: 'legalease-demo',
    status: OrganizationStatus.ACTIVE,
  },
  user: {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'admin@legalease.pk',
    password: 'Password123!',
    firstName: 'Ahmed',
    lastName: 'Khan',
    role: UserRole.ORG_ADMIN,
    phone: '+923001234567',
  },
} as const;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main(): Promise<void> {
  console.log('Seeding database...');

  const passwordHash = await hashPassword(SEED.user.password);

  const organization = await prisma.organization.upsert({
    where: { slug: SEED.organization.slug },
    update: {
      name: SEED.organization.name,
      status: SEED.organization.status,
    },
    create: {
      id: SEED.organization.id,
      name: SEED.organization.name,
      slug: SEED.organization.slug,
      status: SEED.organization.status,
    },
  });

  const user = await prisma.user.upsert({
    where: {
      users_org_email_unique: {
        organizationId: organization.id,
        email: SEED.user.email,
      },
    },
    update: {
      passwordHash,
      firstName: SEED.user.firstName,
      lastName: SEED.user.lastName,
      role: SEED.user.role,
      phone: SEED.user.phone,
      isActive: true,
    },
    create: {
      id: SEED.user.id,
      organizationId: organization.id,
      email: SEED.user.email,
      passwordHash,
      firstName: SEED.user.firstName,
      lastName: SEED.user.lastName,
      role: SEED.user.role,
      phone: SEED.user.phone,
      isActive: true,
    },
  });

  const client = await prisma.client.upsert({
    where: {
      clients_org_cnic_unique: {
        organizationId: organization.id,
        cnic: '42101-1234567-1',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      firstName: 'Zahid',
      lastName: 'Hassan',
      cnic: '42101-1234567-1',
      phone: '+923211234567',
      email: 'zahid.hassan@email.com',
      city: 'Karachi',
    },
  });

  await prisma.case.upsert({
    where: {
      cases_org_case_number_unique: {
        organizationId: organization.id,
        caseNumber: 'CASE-2026-001',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      clientId: client.id,
      assignedLawyerId: user.id,
      createdById: user.id,
      caseNumber: 'CASE-2026-001',
      title: 'Zahid vs. Metro Corp',
      status: CaseStatus.IN_PROGRESS,
      courtName: 'Sindh High Court',
      courtLocation: 'Karachi',
      judgeName: 'Hon. Justice Ali Raza',
      opposingParty: 'Metro Corp Ltd.',
      nextHearingDate: new Date('2026-07-15T10:00:00Z'),
    },
  });

  console.log('\nSeed completed successfully.\n');
  console.log('Test login credentials:');
  console.log(`  Email:    ${SEED.user.email}`);
  console.log(`  Password: ${SEED.user.password}`);
  console.log(`  Org:      ${organization.name} (${organization.slug})\n`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
