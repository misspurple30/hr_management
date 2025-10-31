import { Prisma, Schedule, ScheduleType } from '@prisma/client';
import prisma from '../config/database';

export interface CreateScheduleData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: ScheduleType;
  employeeId: string;
}

export interface UpdateScheduleData {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  type?: ScheduleType;
  employeeId?: string;
}

export interface ScheduleFilters {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export class ScheduleRepository {
  async create(data: CreateScheduleData): Promise<Schedule> {
    return prisma.schedule.create({
      data,
      include: { employee: true },
    });
  }

  async findById(id: string): Promise<Schedule | null> {
    return prisma.schedule.findUnique({
      where: { id },
      include: { employee: true },
    });
  }

  async findAll(filters: ScheduleFilters): Promise<Schedule[]> {
    const { employeeId, startDate, endDate } = filters;
    
    const where: Prisma.ScheduleWhereInput = {
      ...(employeeId && { employeeId }),
      ...(startDate && { startTime: { gte: new Date(startDate) } }),
      ...(endDate && { endTime: { lte: new Date(endDate) } }),
    };

    return prisma.schedule.findMany({
      where,
      include: {
        employee: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async update(id: string, data: UpdateScheduleData): Promise<Schedule> {
    return prisma.schedule.update({
      where: { id },
      data,
      include: { employee: true },
    });
  }

  async delete(id: string): Promise<Schedule> {
    return prisma.schedule.delete({
      where: { id },
    });
  }

  async findConflicts(
    employeeId: string,
    startTime: Date,
    endTime: Date,
    excludeScheduleId?: string
  ): Promise<boolean> {
    const conflicts = await prisma.schedule.count({
      where: {
        employeeId,
        id: {
          not: excludeScheduleId,
        },
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });
    return conflicts > 0;
  }
}