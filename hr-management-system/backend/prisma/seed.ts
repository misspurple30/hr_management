import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  await prisma.schedule.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.talentRequest.deleteMany();
  await prisma.jobPosition.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  const hashedPassword = await bcrypt.hash('Password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@wehr.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Human Resources',
        description: 'Managing employee relations and recruitment',
        color: '#FF6B6B',
      },
    }),
    prisma.department.create({
      data: {
        name: 'IT Department',
        description: 'Technology and infrastructure management',
        color: '#4ECDC4',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Marketing',
        description: 'Brand management and marketing strategies',
        color: '#45B7D1',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Finance',
        description: 'Financial planning and accounting',
        color: '#96CEB4',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Operations',
        description: 'Daily operations and logistics',
        color: '#FFEAA7',
      },
    }),
  ]);

  console.log('✅ Created departments');

  const employeesData = [
    {
      firstName: 'Admira',
      lastName: 'John',
      email: 'admira.john@wehr.com',
      position: 'HR Manager',
      departmentName: 'Human Resources',
      role: 'HR_MANAGER',
      salary: 75000,
    },
    {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@wehr.com',
      position: 'Senior Developer',
      departmentName: 'IT Department',
      role: 'USER',
      salary: 85000,
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@wehr.com',
      position: 'Marketing Director',
      departmentName: 'Marketing',
      role: 'USER',
      salary: 80000,
    },
    {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@wehr.com',
      position: 'Financial Analyst',
      departmentName: 'Finance',
      role: 'USER',
      salary: 65000,
    },
    {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@wehr.com',
      position: 'Operations Manager',
      departmentName: 'Operations',
      role: 'USER',
      salary: 70000,
    },
    {
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'lisa.anderson@wehr.com',
      position: 'UX Designer',
      departmentName: 'IT Department',
      role: 'USER',
      salary: 68000,
    },
    {
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@wehr.com',
      position: 'HR Specialist',
      departmentName: 'Human Resources',
      role: 'USER',
      salary: 55000,
    },
    {
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'jennifer.martinez@wehr.com',
      position: 'Marketing Specialist',
      departmentName: 'Marketing',
      role: 'USER',
      salary: 58000,
    },
  ];

  for (let i = 0; i < employeesData.length; i++) {
    const empData = employeesData[i];
    const department = departments.find((d) => d.name === empData.departmentName);

    if (!department) continue;

    const user = await prisma.user.create({
      data: {
        email: empData.email,
        password: hashedPassword,
        firstName: empData.firstName,
        lastName: empData.lastName,
        role: empData.role as any,
      },
    });

    await prisma.employee.create({
      data: {
        userId: user.id,
        employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
        firstName: empData.firstName,
        lastName: empData.lastName,
        email: empData.email,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        position: empData.position,
        salary: empData.salary,
        hireDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        departmentId: department.id,
        status: 'ACTIVE',
      },
    });
  }

  console.log('✅ Created employees');

  for (const dept of departments) {
    const count = await prisma.employee.count({
      where: { departmentId: dept.id },
    });
    await prisma.department.update({
      where: { id: dept.id },
      data: { headCount: count },
    });
  }

  await prisma.jobPosition.createMany({
    data: [
      {
        title: 'UX/UI Designer',
        department: 'IT Department',
        type: 'FULL_TIME',
        urgency: 'URGENT',
        status: 'OPEN',
        activeHiring: 2,
        description: 'Looking for creative UX/UI designers',
      },
      {
        title: 'Backend Developer',
        department: 'IT Department',
        type: 'FULL_TIME',
        urgency: 'URGENT',
        status: 'OPEN',
        activeHiring: 3,
        description: 'Need experienced backend developers',
      },
      {
        title: 'Marketing Coordinator',
        department: 'Marketing',
        type: 'FULL_TIME',
        urgency: 'NORMAL',
        status: 'OPEN',
        activeHiring: 1,
      },
      {
        title: 'HR Assistant',
        department: 'Human Resources',
        type: 'PART_TIME',
        urgency: 'NORMAL',
        status: 'OPEN',
        activeHiring: 1,
      },
    ],
  });

  await prisma.talentRequest.createMany({
    data: [
      {
        department: 'IT Department',
        position: 'Senior Developer',
        quantity: 2,
        priority: 'HIGH',
        status: 'PENDING',
      },
      {
        department: 'Marketing',
        position: 'Content Writer',
        quantity: 1,
        priority: 'NORMAL',
        status: 'PENDING',
      },
      {
        department: 'Finance',
        position: 'Accountant',
        quantity: 1,
        priority: 'HIGH',
        status: 'APPROVED',
      },
    ],
  });


  const firstEmployee = await prisma.employee.findFirst();

  if (firstEmployee) {
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Outing schedule for every departement',
          description: 'Team building activities scheduled for next month',
          priority: 'NORMAL',
          isPinned: true,
          authorId: firstEmployee.id,
        },
        {
          title: 'Meeting HR Department',
          description: 'Quarterly HR meeting to discuss policies',
          priority: 'NORMAL',
          authorId: firstEmployee.id,
        },
        {
          title: 'IT Department need two more talents for UX/UI Designer position',
          description: 'Urgent hiring for UX/UI positions',
          priority: 'HIGH',
          isPinned: true,
          authorId: firstEmployee.id,
        },
      ],
    });

    const today = new Date();
    await prisma.schedule.createMany({
      data: [
        {
          title: 'Review candidate applications',
          description: 'Review and shortlist candidates for developer position',
          startTime: new Date(today.getTime() + 2 * 60 * 60 * 1000), 
          endTime: new Date(today.getTime() + 3 * 60 * 60 * 1000),
          type: 'REVIEW',
          employeeId: firstEmployee.id,
        },
        {
          title: 'Interview with candidates',
          description: 'Technical interview with shortlisted candidates',
          startTime: new Date(today.getTime() + 5 * 60 * 60 * 1000), 
          endTime: new Date(today.getTime() + 6 * 60 * 60 * 1000),
          type: 'INTERVIEW',
          employeeId: firstEmployee.id,
        },
        {
          title: 'Short meeting with product designer from IT Department',
          description: 'Discuss new UI/UX improvements',
          startTime: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8 hours from now
          endTime: new Date(today.getTime() + 9 * 60 * 60 * 1000),
          type: 'MEETING',
          employeeId: firstEmployee.id,
        },
      ],
    });

    console.log('✅ Created schedules');
  }

  console.log('🎉 Database seeded successfully!');
  console.log('\n📧 Login credentials:');
  console.log('Admin: admin@wehr.com / Password123');
  console.log('HR Manager: admira.john@wehr.com / Password123');
  console.log('Employee: sarah.williams@wehr.com / Password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });