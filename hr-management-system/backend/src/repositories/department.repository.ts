import { Department} from '@prisma/client';
import prisma from '../config/database';

export interface CreateDepartmentData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateDepartmentData {
  name?: string;
  description?: string;
  color?: string;
}

export class DepartmentRepository {
  async create(data: CreateDepartmentData): Promise<Department> {
    return prisma.department.create({
      data,
    });
  }

  // CORRECTION: Le type de retour ": Promise<Department | null>" a été supprimé
  async findById(id: string) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });
  }

  async findAll() {
    return prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: UpdateDepartmentData): Promise<Department> {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Department> {
    return prisma.department.delete({
      where: { id },
    });
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.department.count({
      where: {
        name,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return count > 0;
  }

  async updateHeadCount(id: string): Promise<void> {
    const count = await prisma.employee.count({
      where: { departmentId: id },
    });

    await prisma.department.update({
      where: { id },
      data: { headCount: count },
    });
  }
}