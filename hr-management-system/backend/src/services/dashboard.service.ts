import prisma from '../config/database';

export class DashboardService {
  async getStats() {
    const [
      totalEmployees,
      activeEmployees,
      newEmployeesThisMonth,
      jobPositions,
      talentRequests,
      recentAnnouncements,
      upcomingSchedules,
      employeesByDepartment,
      employeesByStatus,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.employee.count({
        where: {
          hireDate: {
            gte: new Date(new Date().setDate(1)), 
          },
        },
      }),
      prisma.jobPosition.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.talentRequest.findMany({
        where: { status: 'PENDING' },
        take: 10,
      }),
      prisma.announcement.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.schedule.findMany({
        where: {
          startTime: {
            gte: new Date(),
          },
        },
        take: 10,
        orderBy: { startTime: 'asc' },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.employee.groupBy({
        by: ['departmentId'],
        _count: true,
      }),
      prisma.employee.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const openPositions = await prisma.jobPosition.count({
      where: { status: 'OPEN' },
    });

    const urgentPositions = await prisma.jobPosition.count({
      where: { status: 'OPEN', urgency: 'URGENT' },
    });

    return {
      overview: {
        totalEmployees,
        activeEmployees,
        newEmployees: newEmployeesThisMonth,
        availablePositions: openPositions,
        urgentlyNeeded: urgentPositions,
        talentRequests: talentRequests.length,
      },
      jobPositions,
      talentRequests,
      announcements: recentAnnouncements,
      upcomingSchedules,
      analytics: {
        employeesByDepartment,
        employeesByStatus,
      },
    };
  }
}