import {
  PrismaClient,
  UserRole,
  OrganizationStatus,
  CaseStatus,
  CaseType,
  HearingOutcome,
  DocumentFileType,
  PaymentStatus,
  PaymentMethod,
  ExpenseCategory,
  ActivityType,
  TaskType,
  TaskStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

const ORG_ID = '11111111-1111-4111-8111-111111111111';

const IDS = {
  users: {
    admin: '22222222-2222-4222-8222-222222222222',
    lawyer: '22222222-2222-4222-8222-222222222223',
    clerk: '22222222-2222-4222-8222-222222222224',
  },
  clients: {
    zahid: '33333333-3333-4333-8333-333333333331',
    fatima: '33333333-3333-4333-8333-333333333332',
    ali: '33333333-3333-4333-8333-333333333333',
    hassan: '33333333-3333-4333-8333-333333333334',
  },
  cases: {
    metro: '44444444-4444-4444-8444-444444444441',
    divorce: '44444444-4444-4444-8444-444444444442',
    property: '44444444-4444-4444-8444-444444444443',
    bail: '44444444-4444-4444-8444-444444444444',
    labour: '44444444-4444-4444-8444-444444444445',
    inheritance: '44444444-4444-4444-8444-444444444446',
  },
  library: {
    systemBail: '55555555-5555-4555-8555-555555555551',
    systemConstitution: '55555555-5555-4555-8555-555555555552',
    orgLabour: '55555555-5555-4555-8555-555555555553',
    systemDivorce: '55555555-5555-4555-8555-555555555554',
    systemProperty: '55555555-5555-4555-8555-555555555555',
    orgCpc: '55555555-5555-4555-8555-555555555556',
  },
  legalNotes: {
    fairTrial: '66666666-6666-4666-8666-666666666661',
    bailPrinciple: '66666666-6666-4666-8666-666666666662',
    labourRights: '66666666-6666-4666-8666-666666666663',
    khulaGrounds: '66666666-6666-4666-8666-666666666664',
    specificPerformance: '66666666-6666-4666-8666-666666666665',
    limitationPeriod: '66666666-6666-4666-8666-666666666666',
    injunctionTest: '66666666-6666-4666-8666-666666666667',
  },
} as const;

const ADMIN = {
  email: 'admin@legalease.pk',
  password: 'Password123!',
  firstName: 'Ahmed',
  lastName: 'Khan',
} as const;

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

function dateOnly(daysOffset: number): Date {
  const d = daysFromNow(daysOffset);
  return new Date(d.toISOString().slice(0, 10));
}

function todayAt(hours: number, minutes = 0): Date {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function clearOrgDemoData(organizationId: string): Promise<void> {
  await prisma.$transaction([
    prisma.activityLog.deleteMany({ where: { organizationId } }),
    prisma.refreshToken.deleteMany({ where: { organizationId } }),
    prisma.caseReference.deleteMany({ where: { legalNote: { organizationId } } }),
    prisma.legalNote.deleteMany({ where: { organizationId } }),
    prisma.libraryItem.deleteMany({ where: { organizationId } }),
    prisma.expense.deleteMany({ where: { organizationId } }),
    prisma.payment.deleteMany({ where: { organizationId } }),
    prisma.document.deleteMany({ where: { organizationId } }),
    prisma.task.deleteMany({ where: { organizationId } }),
    prisma.hearing.deleteMany({ where: { organizationId } }),
    prisma.case.deleteMany({ where: { organizationId } }),
    prisma.client.deleteMany({ where: { organizationId } }),
  ]);
}

async function main(): Promise<void> {
  console.log('Seeding LegalEase demo database...\n');

  const passwordHash = await hashPassword(ADMIN.password);

  const organization = await prisma.organization.upsert({
    where: { slug: 'legalease-demo' },
    update: {
      name: 'LegalEase Demo Firm',
      phone: '+9221-34567890',
      address: 'Suite 402, Business Plaza, I.I. Chundrigar Road, Karachi 74000',
      status: OrganizationStatus.ACTIVE,
    },
    create: {
      id: ORG_ID,
      name: 'LegalEase Demo Firm',
      slug: 'legalease-demo',
      phone: '+9221-34567890',
      address: 'Suite 402, Business Plaza, I.I. Chundrigar Road, Karachi 74000',
      status: OrganizationStatus.ACTIVE,
    },
  });

  const orgId = organization.id;

  await clearOrgDemoData(orgId);

  const admin = await prisma.user.upsert({
    where: {
      users_org_email_unique: { organizationId: orgId, email: ADMIN.email },
    },
    update: {
      passwordHash,
      firstName: ADMIN.firstName,
      lastName: ADMIN.lastName,
      role: UserRole.ORG_ADMIN,
      phone: '+923001234567',
      isActive: true,
    },
    create: {
      id: IDS.users.admin,
      organizationId: orgId,
      email: ADMIN.email,
      passwordHash,
      firstName: ADMIN.firstName,
      lastName: ADMIN.lastName,
      role: UserRole.ORG_ADMIN,
      phone: '+923001234567',
      isActive: true,
    },
  });

  const lawyer = await prisma.user.upsert({
    where: {
      users_org_email_unique: {
        organizationId: orgId,
        email: 'lawyer@legalease.pk',
      },
    },
    update: {
      passwordHash,
      firstName: 'Sara',
      lastName: 'Malik',
      role: UserRole.SENIOR_LAWYER,
      phone: '+923001234568',
      isActive: true,
    },
    create: {
      id: IDS.users.lawyer,
      organizationId: orgId,
      email: 'lawyer@legalease.pk',
      passwordHash,
      firstName: 'Sara',
      lastName: 'Malik',
      role: UserRole.SENIOR_LAWYER,
      phone: '+923001234568',
      isActive: true,
    },
  });

  const clerk = await prisma.user.upsert({
    where: {
      users_org_email_unique: {
        organizationId: orgId,
        email: 'clerk@legalease.pk',
      },
    },
    update: {
      passwordHash,
      firstName: 'Usman',
      lastName: 'Raza',
      role: UserRole.CLERK,
      phone: '+923001234569',
      isActive: true,
    },
    create: {
      id: IDS.users.clerk,
      organizationId: orgId,
      email: 'clerk@legalease.pk',
      passwordHash,
      firstName: 'Usman',
      lastName: 'Raza',
      role: UserRole.CLERK,
      phone: '+923001234569',
      isActive: true,
    },
  });

  const clients = await Promise.all([
    prisma.client.create({
      data: {
        id: IDS.clients.zahid,
        organizationId: orgId,
        firstName: 'Zahid',
        lastName: 'Hassan',
        fatherName: 'Muhammad Hassan',
        cnic: '42101-1234567-1',
        phone: '+923211234567',
        whatsapp: '+923211234567',
        email: 'zahid.hassan@email.com',
        address: 'House 12, Block 5, Clifton, Karachi',
        city: 'Karachi',
        notes: 'Corporate dispute client. Prefers WhatsApp updates.',
      },
    }),
    prisma.client.create({
      data: {
        id: IDS.clients.fatima,
        organizationId: orgId,
        firstName: 'Fatima',
        lastName: 'Sheikh',
        fatherName: 'Abdul Sheikh',
        cnic: '35202-9876543-2',
        phone: '+923001112233',
        whatsapp: '+923001112233',
        email: 'fatima.sheikh@gmail.com',
        address: '45-C Gulberg III, Lahore',
        city: 'Lahore',
        notes: 'Family law matter — sensitive case.',
      },
    }),
    prisma.client.create({
      data: {
        id: IDS.clients.ali,
        organizationId: orgId,
        firstName: 'Ali',
        lastName: 'Raza',
        fatherName: 'Imtiaz Raza',
        cnic: '61101-5556677-3',
        phone: '+923331234567',
        email: 'ali.raza@outlook.com',
        address: 'Plot 78, Satellite Town, Rawalpindi',
        city: 'Rawalpindi',
        notes: 'Property dispute resolved. Case closed.',
      },
    }),
    prisma.client.create({
      data: {
        id: IDS.clients.hassan,
        organizationId: orgId,
        firstName: 'Hassan',
        lastName: 'Mehmood',
        fatherName: 'Mehmood Ali',
        cnic: '37405-1122334-4',
        phone: '+923451234567',
        whatsapp: '+923451234567',
        address: 'Sector F-7, Islamabad',
        city: 'Islamabad',
        notes: 'Criminal bail application pending.',
      },
    }),
  ]);

  const [zahid, fatima, ali, hassan] = clients;

  const saima = await prisma.client.create({
    data: {
      organizationId: orgId,
      firstName: 'Saima',
      lastName: 'Qureshi',
      fatherName: 'Nadeem Qureshi',
      cnic: '35202-4455667-5',
      phone: '+923001998877',
      whatsapp: '+923001998877',
      email: 'saima.qureshi@email.com',
      address: 'House 22, Model Town, Lahore',
      city: 'Lahore',
      notes: 'Labour court matter — wrongful termination.',
    },
  });

  const caseMetro = await prisma.case.create({
    data: {
      id: IDS.cases.metro,
      organizationId: orgId,
      clientId: zahid.id,
      assignedLawyerId: lawyer.id,
      createdById: admin.id,
      updatedById: admin.id,
      caseNumber: 'CASE-2026-001',
      title: 'Zahid Hassan vs. Metro Corp Ltd.',
      caseType: CaseType.CORPORATE,
      description:
        'Breach of contract and wrongful termination claim against Metro Corp Ltd. Client seeks reinstatement and damages for unpaid dues.',
      status: CaseStatus.IN_PROGRESS,
      courtName: 'Sindh High Court',
      courtLocation: 'Karachi',
      judgeName: 'Hon. Justice Ali Raza',
      opposingParty: 'Metro Corp Ltd.',
      opposingLawyer: 'Adv. Tariq Mehmood',
      filedDate: dateOnly(-120),
      nextHearingDate: daysFromNow(14),
      isActive: true,
    },
  });

  const caseDivorce = await prisma.case.create({
    data: {
      id: IDS.cases.divorce,
      organizationId: orgId,
      clientId: fatima.id,
      assignedLawyerId: lawyer.id,
      createdById: admin.id,
      caseNumber: 'CASE-2026-002',
      title: 'Fatima Sheikh — Khula Petition',
      caseType: CaseType.FAMILY,
      description: 'Khula petition filed in Family Court Lahore. Mediation attempted, proceeding to trial.',
      status: CaseStatus.OPEN,
      courtName: 'Family Court Lahore',
      courtLocation: 'Lahore',
      judgeName: 'Hon. Judge Ayesha Bibi',
      opposingParty: 'Sheikh Family',
      opposingLawyer: 'Adv. Kamran Siddiqui',
      filedDate: dateOnly(-45),
      nextHearingDate: daysFromNow(7),
      isActive: true,
    },
  });

  const caseProperty = await prisma.case.create({
    data: {
      id: IDS.cases.property,
      organizationId: orgId,
      clientId: ali.id,
      assignedLawyerId: admin.id,
      createdById: admin.id,
      caseNumber: 'CASE-2025-089',
      title: 'Ali Raza vs. Housing Society — Property Dispute',
      caseType: CaseType.CIVIL,
      description: 'Land ownership dispute settled out of court. Final decree received.',
      status: CaseStatus.CLOSED,
      courtName: 'District Court Rawalpindi',
      courtLocation: 'Rawalpindi',
      opposingParty: 'Green Valley Housing Society',
      filedDate: dateOnly(-365),
      closedDate: dateOnly(-30),
      nextHearingDate: null,
      isActive: true,
    },
  });

  const caseBail = await prisma.case.create({
    data: {
      id: IDS.cases.bail,
      organizationId: orgId,
      clientId: hassan.id,
      assignedLawyerId: lawyer.id,
      createdById: clerk.id,
      caseNumber: 'CASE-2026-003',
      title: 'State vs. Hassan Mehmood — Bail Application',
      caseType: CaseType.CRIMINAL,
      description: 'Post-arrest bail application under Section 497 Cr.P.C.',
      status: CaseStatus.IN_PROGRESS,
      courtName: 'Sessions Court Islamabad',
      courtLocation: 'Islamabad',
      judgeName: 'Hon. Judge Rashid Ahmed',
      opposingParty: 'State',
      opposingLawyer: 'Additional Prosecutor General',
      filedDate: dateOnly(-10),
      nextHearingDate: daysFromNow(3),
      isActive: true,
    },
  });

  const caseLabour = await prisma.case.create({
    data: {
      id: IDS.cases.labour,
      organizationId: orgId,
      clientId: saima.id,
      assignedLawyerId: lawyer.id,
      createdById: admin.id,
      caseNumber: 'CASE-2026-004',
      title: 'Saima Qureshi vs. Textile Mills — Labour Dispute',
      caseType: CaseType.OTHER,
      description: 'Wrongful termination and unpaid gratuity claim before Labour Court.',
      status: CaseStatus.IN_PROGRESS,
      courtName: 'Labour Court Lahore',
      courtLocation: 'Lahore',
      judgeName: 'Hon. Judge Farhan Ali',
      opposingParty: 'Allied Textile Mills Pvt Ltd',
      opposingLawyer: 'Adv. Bilal Hussain',
      filedDate: dateOnly(-60),
      nextHearingDate: todayAt(14, 0),
      isActive: true,
    },
  });

  const caseInheritance = await prisma.case.create({
    data: {
      id: IDS.cases.inheritance,
      organizationId: orgId,
      clientId: ali.id,
      assignedLawyerId: admin.id,
      createdById: admin.id,
      caseNumber: 'CASE-2026-005',
      title: 'Ali Raza — Inheritance Appeal',
      caseType: CaseType.FAMILY,
      description: 'Appeal against succession certificate order in the High Court.',
      status: CaseStatus.OPEN,
      courtName: 'Islamabad High Court',
      courtLocation: 'Islamabad',
      judgeName: 'Hon. Justice Samina Malik',
      opposingParty: 'Raza Family Members',
      filedDate: dateOnly(-20),
      nextHearingDate: todayAt(16, 0),
      isActive: true,
    },
  });

  // --- TODAY: Case Diary roznamcha — 5 cases in court today ---
  const roznamchaToday = [
    {
      caseId: caseMetro.id,
      scheduledDate: todayAt(9, 0),
      courtRoom: 'Court Room 3',
      purpose: 'Evidence — PW-1 Zahid Hassan examination',
      nextHearingDate: daysFromNow(14),
      nextPurpose: 'Plaintiff evidence — remaining witnesses',
    },
    {
      caseId: caseDivorce.id,
      scheduledDate: todayAt(10, 30),
      courtRoom: 'Court Room 1',
      purpose: 'Reconciliation committee report',
      nextHearingDate: daysFromNow(7),
      nextPurpose: 'Mediation report submission',
    },
    {
      caseId: caseBail.id,
      scheduledDate: todayAt(11, 15),
      courtRoom: 'Court Room 5',
      purpose: 'Bail arguments — Section 497 Cr.P.C.',
      nextHearingDate: daysFromNow(5),
      nextPurpose: 'Bail order pronouncement',
    },
    {
      caseId: caseLabour.id,
      scheduledDate: todayAt(14, 0),
      courtRoom: 'Labour Court Hall A',
      purpose: 'Conciliation proceedings',
      nextHearingDate: daysFromNow(21),
      nextPurpose: 'Employer reply and evidence',
    },
    {
      caseId: caseInheritance.id,
      scheduledDate: todayAt(16, 0),
      courtRoom: 'Court Room 2',
      purpose: 'Admission of appeal & stay application',
      nextHearingDate: daysFromNow(12),
      nextPurpose: 'Arguments on stay application',
    },
  ] as const;

  await prisma.hearing.createMany({
    data: roznamchaToday.map((h) => ({
      organizationId: orgId,
      caseId: h.caseId,
      scheduledDate: h.scheduledDate,
      courtRoom: h.courtRoom,
      purpose: h.purpose,
      outcome: HearingOutcome.PENDING,
      nextHearingDate: h.nextHearingDate,
    })),
  });

  await prisma.hearing.createMany({
    data: roznamchaToday.map((h) => ({
      organizationId: orgId,
      caseId: h.caseId,
      scheduledDate: h.nextHearingDate,
      courtRoom: h.courtRoom,
      purpose: h.nextPurpose,
      outcome: HearingOutcome.PENDING,
    })),
  });

  await prisma.task.createMany({
    data: [
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        createdById: lawyer.id,
        title: 'Meet Client — Zahid Hassan',
        description: 'Review witness list and employment records before court.',
        date: dateOnly(0),
        time: '08:30',
        type: TaskType.CLIENT_MEETING,
        status: TaskStatus.PENDING,
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        createdById: clerk.id,
        title: 'Prepare Written Arguments',
        description: 'Draft arguments for evidence stage hearing.',
        date: dateOnly(1),
        time: '11:00',
        type: TaskType.DOCUMENT_PREPARATION,
        status: TaskStatus.PENDING,
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        createdById: lawyer.id,
        title: 'Meet Client — Hassan Mehmood',
        description: 'Discuss bail hearing strategy and surety documents.',
        date: daysFromNow(3),
        time: '09:00',
        type: TaskType.CLIENT_MEETING,
        status: TaskStatus.PENDING,
      },
      {
        organizationId: orgId,
        caseId: null,
        createdById: admin.id,
        title: 'Chamber Administration',
        description: 'Weekly file review and clerk briefing.',
        date: dateOnly(0),
        time: '17:00',
        type: TaskType.PERSONAL,
        status: TaskStatus.PENDING,
      },
      {
        organizationId: orgId,
        caseId: caseDivorce.id,
        createdById: lawyer.id,
        title: 'Prepare Mediation Brief',
        description: 'Compile reconciliation committee report for Family Court.',
        date: daysFromNow(7),
        time: '10:00',
        type: TaskType.DOCUMENT_PREPARATION,
        status: TaskStatus.PENDING,
      },
      {
        organizationId: orgId,
        caseId: caseLabour.id,
        createdById: clerk.id,
        title: 'Court Filing — Labour Court',
        description: 'Submit conciliation reply at Labour Court Lahore.',
        date: dateOnly(0),
        time: '13:00',
        type: TaskType.COURT_WORK,
        status: TaskStatus.PENDING,
      },
    ],
  });

  // --- Hearings (Metro Corp case — rich timeline) ---
  await prisma.hearing.createMany({
    data: [
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        scheduledDate: daysAgo(90),
        actualDate: daysAgo(90),
        courtRoom: 'Court Room 3',
        purpose: 'First hearing — admission of petition',
        judgeName: 'Hon. Justice Ali Raza',
        outcome: HearingOutcome.COMPLETED,
        notes: 'Notice issued to respondent. Next date for written reply.',
        nextHearingDate: daysAgo(60),
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        scheduledDate: daysAgo(60),
        actualDate: daysAgo(60),
        courtRoom: 'Court Room 3',
        purpose: 'Written reply by respondent',
        judgeName: 'Hon. Justice Ali Raza',
        outcome: HearingOutcome.ADJOURNED,
        notes: 'Respondent sought extension. Granted 2 weeks.',
        nextHearingDate: daysAgo(30),
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        scheduledDate: daysAgo(30),
        actualDate: daysAgo(30),
        courtRoom: 'Court Room 3',
        purpose: 'Framing of issues',
        judgeName: 'Hon. Justice Ali Raza',
        outcome: HearingOutcome.COMPLETED,
        notes: 'Issues framed. Evidence to commence next date.',
        nextHearingDate: daysFromNow(14),
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        scheduledDate: daysFromNow(14),
        courtRoom: 'Court Room 3',
        purpose: 'Plaintiff evidence — witness examination',
        judgeName: 'Hon. Justice Ali Raza',
        outcome: HearingOutcome.PENDING,
        notes: 'Client Zahid Hassan to appear with employment records.',
      },
    ],
  });

  await prisma.hearing.createMany({
    data: [
      {
        organizationId: orgId,
        caseId: caseDivorce.id,
        scheduledDate: daysAgo(20),
        actualDate: daysAgo(20),
        purpose: 'Initial hearing',
        outcome: HearingOutcome.ADJOURNED,
        notes: 'Mediation referred to reconciliation committee.',
        nextHearingDate: daysFromNow(7),
      },
      {
        organizationId: orgId,
        caseId: caseDivorce.id,
        scheduledDate: daysFromNow(7),
        purpose: 'Mediation report submission',
        outcome: HearingOutcome.PENDING,
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        scheduledDate: daysAgo(5),
        actualDate: daysAgo(5),
        purpose: 'First bail hearing',
        outcome: HearingOutcome.ADJOURNED,
        notes: 'Prosecution requested time to file reply.',
        nextHearingDate: daysFromNow(3),
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        scheduledDate: daysFromNow(3),
        purpose: 'Bail arguments',
        outcome: HearingOutcome.PENDING,
      },
    ],
  });

  // --- Tasks & agenda (see /diary) ---
  // --- Documents ---
  await prisma.document.createMany({
    data: [
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        uploadedById: clerk.id,
        fileName: 'Employment_Contract_Zahid_Hassan.pdf',
        storageKey: 'https://example.com/docs/employment-contract.pdf',
        fileType: DocumentFileType.PDF,
        mimeType: 'application/pdf',
        fileSize: 245_760,
        category: 'Pleadings',
        description: 'Original employment contract dated 2022',
        tags: ['contract', 'evidence'],
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        uploadedById: clerk.id,
        fileName: 'Termination_Letter_MetroCorp.pdf',
        storageKey: 'https://example.com/docs/termination-letter.pdf',
        fileType: DocumentFileType.PDF,
        mimeType: 'application/pdf',
        fileSize: 89_600,
        category: 'Evidence',
        description: 'Termination letter from Metro Corp HR',
        tags: ['termination', 'evidence'],
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        uploadedById: lawyer.id,
        fileName: 'Salary_Slips_2025.pdf',
        storageKey: 'https://example.com/docs/salary-slips.pdf',
        fileType: DocumentFileType.PDF,
        mimeType: 'application/pdf',
        fileSize: 512_000,
        category: 'Evidence',
        description: 'Salary slips Jan–Dec 2025',
        tags: ['salary', 'evidence'],
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        uploadedById: admin.id,
        fileName: 'Court_Order_Issues_Framed.pdf',
        storageKey: 'https://example.com/docs/court-order.pdf',
        fileType: DocumentFileType.PDF,
        mimeType: 'application/pdf',
        fileSize: 156_000,
        category: 'Court Orders',
        description: 'Order framing issues — 15 May 2026',
        tags: ['court-order'],
      },
      {
        organizationId: orgId,
        caseId: caseDivorce.id,
        uploadedById: clerk.id,
        fileName: 'Khula_Petition_Draft.pdf',
        storageKey: 'https://example.com/docs/khula-petition.pdf',
        fileType: DocumentFileType.PDF,
        mimeType: 'application/pdf',
        fileSize: 198_000,
        category: 'Pleadings',
        description: 'Khula petition filed in Family Court',
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        uploadedById: lawyer.id,
        fileName: 'Bail_Application_497.pdf',
        storageKey: 'https://example.com/docs/bail-application.pdf',
        fileType: DocumentFileType.PDF,
        mimeType: 'application/pdf',
        fileSize: 134_000,
        category: 'Pleadings',
        description: 'Bail application under Section 497 Cr.P.C.',
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        uploadedById: clerk.id,
        fileName: 'FIR_Copy_234_2026.jpg',
        storageKey: 'https://example.com/docs/fir-copy.jpg',
        fileType: DocumentFileType.IMAGE,
        mimeType: 'image/jpeg',
        fileSize: 1_024_000,
        category: 'Evidence',
        description: 'Certified copy of FIR 234/2026',
      },
    ],
  });

  // --- Payments ---
  await prisma.payment.createMany({
    data: [
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        clientId: zahid.id,
        recordedById: admin.id,
        amount: 150_000,
        status: PaymentStatus.PAID,
        method: PaymentMethod.BANK_TRANSFER,
        description: 'Initial retainer fee — corporate dispute',
        referenceNumber: 'TRX-20260115-001',
        paidDate: dateOnly(-115),
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        clientId: zahid.id,
        recordedById: clerk.id,
        amount: 75_000,
        status: PaymentStatus.PAID,
        method: PaymentMethod.JAZZCASH,
        description: 'Hearing appearance fee — March 2026',
        referenceNumber: 'JC-8844221100',
        paidDate: dateOnly(-30),
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        clientId: zahid.id,
        recordedById: admin.id,
        amount: 50_000,
        status: PaymentStatus.PENDING,
        method: PaymentMethod.CASH,
        description: 'Evidence preparation fee — due before next hearing',
        dueDate: daysFromNow(10),
      },
      {
        organizationId: orgId,
        caseId: caseDivorce.id,
        clientId: fatima.id,
        recordedById: admin.id,
        amount: 100_000,
        status: PaymentStatus.PARTIAL,
        method: PaymentMethod.CASH,
        description: 'Family case retainer — 50% paid',
        paidDate: dateOnly(-40),
      },
      {
        organizationId: orgId,
        caseId: caseDivorce.id,
        clientId: fatima.id,
        recordedById: clerk.id,
        amount: 100_000,
        status: PaymentStatus.PENDING,
        method: PaymentMethod.EASYPAISA,
        description: 'Remaining retainer balance',
        dueDate: daysFromNow(14),
      },
      {
        organizationId: orgId,
        caseId: caseProperty.id,
        clientId: ali.id,
        recordedById: admin.id,
        amount: 200_000,
        status: PaymentStatus.PAID,
        method: PaymentMethod.BANK_TRANSFER,
        description: 'Full legal fees — property dispute (closed)',
        referenceNumber: 'TRX-20250520-089',
        paidDate: dateOnly(-35),
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        clientId: hassan.id,
        recordedById: clerk.id,
        amount: 50_000,
        status: PaymentStatus.PAID,
        method: PaymentMethod.CASH,
        description: 'Bail application fee',
        paidDate: dateOnly(-9),
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        clientId: hassan.id,
        recordedById: admin.id,
        amount: 25_000,
        status: PaymentStatus.OVERDUE,
        method: PaymentMethod.CASH,
        description: 'Additional court appearance fee',
        dueDate: daysAgo(2),
      },
    ],
  });

  // --- Expenses ---
  await prisma.expense.createMany({
    data: [
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        recordedById: clerk.id,
        category: ExpenseCategory.COURT_FEES,
        amount: 5_000,
        description: 'Court fee for petition filing',
        expenseDate: dateOnly(-85),
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        recordedById: clerk.id,
        category: ExpenseCategory.PHOTOCOPY,
        amount: 2_500,
        description: 'Document photocopying — 500 pages',
        expenseDate: dateOnly(-84),
      },
      {
        organizationId: orgId,
        caseId: caseMetro.id,
        recordedById: admin.id,
        category: ExpenseCategory.TRAVEL,
        amount: 3_000,
        description: 'Travel to Sindh High Court — hearing date',
        expenseDate: dateOnly(-30),
      },
      {
        organizationId: orgId,
        caseId: caseDivorce.id,
        recordedById: clerk.id,
        category: ExpenseCategory.FILING_FEE,
        amount: 3_500,
        description: 'Family court filing fee',
        expenseDate: dateOnly(-44),
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        recordedById: clerk.id,
        category: ExpenseCategory.COURT_FEES,
        amount: 2_000,
        description: 'Sessions court bail application fee',
        expenseDate: dateOnly(-9),
      },
      {
        organizationId: orgId,
        caseId: caseBail.id,
        recordedById: lawyer.id,
        category: ExpenseCategory.WITNESS_FEE,
        amount: 5_000,
        description: 'Surety witness transportation',
        expenseDate: dateOnly(-5),
      },
      {
        organizationId: orgId,
        caseId: caseProperty.id,
        recordedById: admin.id,
        category: ExpenseCategory.NOTARY,
        amount: 1_500,
        description: 'Notarization of settlement deed',
        expenseDate: dateOnly(-32),
      },
    ],
  });

  // --- Legal Research (library, notes, case references) ---
  const demoPdfBase = process.env.DEMO_PDF_BASE_URL ?? 'http://localhost:3001/demo';
  const demoPdfs = {
    bail: `${demoPdfBase}/pld-2021-sc-1-bail.pdf`,
    constitution: `${demoPdfBase}/constitution-art-10a.pdf`,
    labour: `${demoPdfBase}/ira-2012-labour.pdf`,
  };

  await prisma.caseReference.deleteMany({
    where: { legalNoteId: { in: Object.values(IDS.legalNotes) } },
  });
  await prisma.legalNote.deleteMany({
    where: { id: { in: Object.values(IDS.legalNotes) } },
  });
  await prisma.libraryItem.deleteMany({
    where: { id: { in: Object.values(IDS.library) } },
  });

  await prisma.libraryItem.createMany({
    data: [
      {
        id: IDS.library.systemBail,
        organizationId: null,
        title: 'PLD 2021 SC 1 — Bail in Non-Bailable Offences',
        citation: 'PLD 2021 SC 1',
        court: 'Supreme Court of Pakistan',
        jurisdiction: 'Pakistan',
        year: 2021,
        category: 'Judgment',
        author: 'Supreme Court',
        pdfUrl: demoPdfs.bail,
        totalPages: 1,
        description: 'Demo PDF with copyable bail text — open PDF, highlight paragraph, create note.',
        tags: ['bail', 'criminal', 'supreme-court', 'demo'],
        isSystemDocument: true,
      },
      {
        id: IDS.library.systemConstitution,
        organizationId: null,
        title: 'Constitution of Pakistan — Fundamental Rights (Art. 9–28)',
        citation: 'Constitution of Pakistan, 1973',
        court: '—',
        jurisdiction: 'Pakistan',
        year: 1973,
        category: 'Statute',
        pdfUrl: demoPdfs.constitution,
        totalPages: 1,
        description: 'Demo PDF with Article 10A fair trial text for note-taking practice.',
        tags: ['constitutional', 'fundamental-rights', 'demo'],
        isSystemDocument: true,
      },
      {
        id: IDS.library.orgLabour,
        organizationId: orgId,
        title: 'Industrial Relations Act — Key Provisions',
        citation: 'IRA 2012',
        court: '—',
        jurisdiction: 'Pakistan',
        year: 2012,
        category: 'Statute',
        pdfUrl: demoPdfs.labour,
        totalPages: 1,
        description: 'Demo PDF with labour reinstatement excerpt.',
        tags: ['labour', 'employment', 'industrial', 'demo'],
        isSystemDocument: false,
      },
      {
        id: IDS.library.systemDivorce,
        organizationId: null,
        title: 'PLD 2019 SC 123 — Khula and Dissolution of Marriage',
        citation: 'PLD 2019 SC 123',
        court: 'Supreme Court of Pakistan',
        jurisdiction: 'Pakistan',
        year: 2019,
        category: 'Judgment',
        author: 'Supreme Court',
        pdfUrl: demoPdfs.bail,
        totalPages: 1,
        description: 'Leading authority on khula and wife\'s right to seek dissolution.',
        tags: ['family', 'khula', 'divorce'],
        isSystemDocument: true,
      },
      {
        id: IDS.library.systemProperty,
        organizationId: null,
        title: 'PLD 2018 SC 456 — Specific Performance of Contract',
        citation: 'PLD 2018 SC 456',
        court: 'Supreme Court of Pakistan',
        jurisdiction: 'Pakistan',
        year: 2018,
        category: 'Judgment',
        author: 'Supreme Court',
        pdfUrl: demoPdfs.constitution,
        totalPages: 1,
        description: 'Principles for granting specific performance in property disputes.',
        tags: ['property', 'contract', 'specific-performance'],
        isSystemDocument: true,
      },
      {
        id: IDS.library.orgCpc,
        organizationId: orgId,
        title: 'Code of Civil Procedure — Order XXXIX (Injunctions)',
        citation: 'CPC Order XXXIX',
        court: '—',
        jurisdiction: 'Pakistan',
        year: 1908,
        category: 'Statute',
        pdfUrl: demoPdfs.labour,
        totalPages: 1,
        description: 'Firm quick-reference for temporary injunction applications.',
        tags: ['cpc', 'injunction', 'civil'],
        isSystemDocument: false,
      },
    ],
  });

  await prisma.legalNote.createMany({
    data: [
      {
        id: IDS.legalNotes.fairTrial,
        organizationId: orgId,
        createdById: lawyer.id,
        libraryItemId: IDS.library.systemConstitution,
        pageNumber: 12,
        title: 'Right to fair trial — Article 10A',
        selectedText:
          'For the determination of his civil rights and obligations or in any criminal charge against him a person shall be entitled to a fair trial and due process.',
        personalNote: 'Use in constitutional petitions challenging procedural defects.',
        citation: 'Constitution Art. 10A',
        court: 'Supreme Court of Pakistan',
        tags: ['constitutional', 'fair-trial', 'due-process'],
      },
      {
        id: IDS.legalNotes.bailPrinciple,
        organizationId: orgId,
        createdById: admin.id,
        libraryItemId: IDS.library.systemBail,
        pageNumber: 8,
        title: 'Bail — benefit of doubt at pre-arrest stage',
        selectedText:
          'At the pre-arrest bail stage, the court is required to consider whether the accused has been able to make out a case for further inquiry into his guilt.',
        personalNote: 'Primary authority for Sessions Court bail applications.',
        citation: 'PLD 2021 SC 1',
        court: 'Supreme Court of Pakistan',
        tags: ['bail', 'criminal', 'pre-arrest'],
      },
      {
        id: IDS.legalNotes.labourRights,
        organizationId: orgId,
        createdById: lawyer.id,
        libraryItemId: IDS.library.orgLabour,
        pageNumber: 34,
        title: 'Unfair labour practice — reinstatement remedy',
        selectedText:
          'Where termination is found to be without lawful cause, the Labour Court may direct reinstatement with back benefits.',
        personalNote: 'Applicable to Metro Corp wrongful termination claim.',
        citation: 'IRA 2012, S. 46',
        tags: ['labour', 'reinstatement', 'termination'],
      },
      {
        id: IDS.legalNotes.khulaGrounds,
        organizationId: orgId,
        createdById: lawyer.id,
        libraryItemId: IDS.library.systemDivorce,
        pageNumber: 5,
        title: 'Khula — wife\'s right to dissolution',
        selectedText:
          'The wife is entitled to obtain a decree for dissolution of marriage on the ground of khula if she satisfies the court that she can no longer live with the husband within the limits prescribed by Allah.',
        personalNote: 'Use in Fatima Khan divorce proceedings — CASE-2026-002.',
        citation: 'PLD 2019 SC 123',
        court: 'Supreme Court of Pakistan',
        tags: ['family', 'khula', 'divorce'],
      },
      {
        id: IDS.legalNotes.specificPerformance,
        organizationId: orgId,
        createdById: admin.id,
        libraryItemId: IDS.library.systemProperty,
        pageNumber: 14,
        title: 'Specific performance — readiness and willingness',
        selectedText:
          'The plaintiff must prove that he was always ready and willing to perform his part of the contract and that he has performed or has been ready to perform his obligations thereunder.',
        personalNote: 'Key for property dispute — Ali Hassan case.',
        citation: 'PLD 2018 SC 456',
        court: 'Supreme Court of Pakistan',
        tags: ['property', 'contract', 'specific-performance'],
      },
      {
        id: IDS.legalNotes.limitationPeriod,
        organizationId: orgId,
        createdById: clerk.id,
        libraryItemId: null,
        pageNumber: 1,
        title: 'Limitation Act — three-year period for recovery of immovable property',
        selectedText:
          'No suit for possession of immovable property not hereby otherwise expressly provided for, or for recovery of movable property converted wrongfully to the use of the defendant, shall be brought after the expiration of three years from the date when the cause of action accrued.',
        personalNote: 'Check limitation before filing in inheritance dispute.',
        citation: 'Limitation Act, 1908 — Art. 142',
        tags: ['limitation', 'property', 'civil'],
      },
      {
        id: IDS.legalNotes.injunctionTest,
        organizationId: orgId,
        createdById: lawyer.id,
        libraryItemId: IDS.library.orgCpc,
        pageNumber: 3,
        title: 'Temporary injunction — prima facie case test',
        selectedText:
          'The court must be satisfied that there is a prima facie case in favour of the applicant, that the balance of convenience lies in favour of granting the injunction, and that irreparable loss would result if the injunction is not granted.',
        personalNote: 'Standard three-part test for Order XXXIX applications.',
        citation: 'CPC Order XXXIX, Rule 1',
        tags: ['injunction', 'cpc', 'civil'],
      },
    ],
    skipDuplicates: true,
  });

  await prisma.caseReference.createMany({
    data: [
      {
        caseId: caseBail.id,
        legalNoteId: IDS.legalNotes.bailPrinciple,
        attachedById: lawyer.id,
      },
      {
        caseId: caseMetro.id,
        legalNoteId: IDS.legalNotes.labourRights,
        attachedById: admin.id,
      },
      {
        caseId: caseMetro.id,
        legalNoteId: IDS.legalNotes.fairTrial,
        attachedById: lawyer.id,
      },
      {
        caseId: caseDivorce.id,
        legalNoteId: IDS.legalNotes.khulaGrounds,
        attachedById: lawyer.id,
      },
      {
        caseId: caseProperty.id,
        legalNoteId: IDS.legalNotes.specificPerformance,
        attachedById: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  // --- Activity Logs ---
  await prisma.activityLog.createMany({
    data: [
      {
        organizationId: orgId,
        userId: admin.id,
        activityType: ActivityType.CREATE,
        entityType: 'Case',
        entityId: caseMetro.id,
        description: 'Created case CASE-2026-001 — Zahid Hassan vs. Metro Corp',
      },
      {
        organizationId: orgId,
        userId: lawyer.id,
        activityType: ActivityType.UPDATE,
        entityType: 'Hearing',
        description: 'Updated hearing outcome — issues framed',
      },
      {
        organizationId: orgId,
        userId: clerk.id,
        activityType: ActivityType.UPLOAD,
        entityType: 'Document',
        description: 'Uploaded Employment Contract for CASE-2026-001',
      },
      {
        organizationId: orgId,
        userId: admin.id,
        activityType: ActivityType.PAYMENT_RECORDED,
        entityType: 'Payment',
        description: 'Recorded retainer payment PKR 150,000 for CASE-2026-001',
      },
      {
        organizationId: orgId,
        userId: lawyer.id,
        activityType: ActivityType.CREATE,
        entityType: 'Task',
        description: 'Scheduled task — Prepare Written Arguments',
      },
    ],
  });

  console.log('Seed completed successfully!\n');
  console.log('══════════════════════════════════════════════════');
  console.log('  Organization:', organization.name);
  console.log('  Slug:        ', organization.slug);
  console.log('──────────────────────────────────────────────────');
  console.log('  Login credentials (all use Password123!):');
  console.log('    Admin:   ', ADMIN.email);
  console.log('    Lawyer:   lawyer@legalease.pk');
  console.log('    Clerk:    clerk@legalease.pk');
  console.log('──────────────────────────────────────────────────');
  console.log('  Demo data created:');
  console.log('    Clients:     5');
  console.log('    Cases:       6 (1 closed, 2 open, 3 in progress)');
  console.log('    Hearings:    includes 5 cases TODAY for Diary agenda');
  console.log('    Tasks:       agenda items for today + upcoming days');
  console.log('    Documents:   7');
  console.log('    Payments:    8');
  console.log('    Expenses:    7');
  console.log('    Legal Lib:   6 documents (4 system + 2 firm)');
  console.log('    Legal Notes: 7 with 5 case references');
  console.log('──────────────────────────────────────────────────');
  console.log('  Diary agenda (today): 5 hearings + tasks');
  console.log('    Open /diary to see combined timeline');
  console.log('──────────────────────────────────────────────────');
  console.log('  Featured case for UI testing:');
  console.log('    CASE-2026-001 — Zahid Hassan vs. Metro Corp Ltd.');
  console.log('    CASE-2026-004 — Bail application (has legal references)');
  console.log('  Legal Research: /legal-research');
  console.log('  Demo PDFs (copy text to create notes):');
  console.log('   ', demoPdfs.bail);
  console.log('   ', demoPdfs.constitution);
  console.log('   ', demoPdfs.labour);
  console.log('══════════════════════════════════════════════════\n');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
