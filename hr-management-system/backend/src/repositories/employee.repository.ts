import { Employee, EmployeeStatus, Prisma } from '@prisma/client';
import prisma from '../config/database';

export interface CreateEmployeeData {
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  position: string;
  salary?: number;
  hireDate: Date;
  departmentId: string;
  status?: EmployeeStatus;
}

export interface UpdateEmployeeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  position?: string;
  salary?: number;
  hireDate?: Date;
  departmentId?: string;
  status?: EmployeeStatus;
}

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class EmployeeRepository {
  async create(data: CreateEmployeeData): Promise<Employee> {
    return prisma.employee.create({
      data,
      include: {
        department: true,
      },
    });
  }

async findByUserId(userId: string): Promise<Employee | null> {
  return prisma.employee.findUnique({
    where: { userId },
  });
}
  async findById(id: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { email },
      include: {
        department: true,
      },
    });
  }

  async findAll(filters: EmployeeFilters) {
    const {
      search,
      departmentId,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.EmployeeWhereInput = {
      ...(departmentId && { departmentId }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { position: { contains: search, mode: 'insensitive' } },
          { employeeId: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          department: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    return prisma.employee.update({
      where: { id },
      data,
      include: {
        department: true,
      },
    });
  }

  async delete(id: string): Promise<Employee> {
    return prisma.employee.delete({
      where: { id },
    });
  }

  async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.employee.count({
      where: {
        email,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return count > 0;
  }

  async existsByEmployeeId(employeeId: string): Promise<boolean> {
    const count = await prisma.employee.count({
      where: { employeeId },
    });
    return count > 0;
  }

  async getStats() {
    const [total, byStatus, byDepartment, recentHires] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.employee.groupBy({
        by: ['departmentId'],
        _count: true,
      }),
      prisma.employee.count({
        where: {
          hireDate: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      }),
    ]);

    return {
      total,
      byStatus,
      byDepartment,
      recentHires,
    };
  }

  async generateEmployeeId(): Promise<string> {
    const lastEmployee = await prisma.employee.findFirst({
      orderBy: { employeeId: 'desc' },
      select: { employeeId: true },
    });

    if (!lastEmployee) {
      return 'EMP001';
    }

    const lastNumber = parseInt(lastEmployee.employeeId.replace('EMP', ''));
    const newNumber = lastNumber + 1;
    return `EMP${newNumber.toString().padStart(3, '0')}`;
  }
}
