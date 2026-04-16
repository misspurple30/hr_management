import {
  EmployeeRepository,
  CreateEmployeeData,
  UpdateEmployeeData,
  EmployeeFilters,
} from '../repositories/employee.repository';
import { UserRepository } from '../repositories/user.repository';
import { DepartmentRepository } from '../repositories/department.repository';
import { PasswordUtil } from '../utils/password.util';
import { AppError } from '../middlewares/error.middleware';
import prisma from '../config/database';

export class EmployeeService {
  private employeeRepository: EmployeeRepository;
  private userRepository: UserRepository;
  private departmentRepository: DepartmentRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
    this.userRepository = new UserRepository();
    this.departmentRepository = new DepartmentRepository();
  }

  async create(data: Omit<CreateEmployeeData, 'userId' | 'employeeId'> & { password: string }) {
    const department = await this.departmentRepository.findById(data.departmentId);
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Vérifier l'email dans les deux tables
    if (await this.employeeRepository.existsByEmail(data.email)) {
      throw new AppError('Un employé avec cet email existe déjà', 400);
    }
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Un utilisateur avec cet email existe déjà', 400);
    }

    const employeeId = await this.employeeRepository.generateEmployeeId();
    const hashedPassword = await PasswordUtil.hash(data.password);

    // Transaction pour créer User + Employee ensemble
    const { password, ...employeeData } = data;
    const employee = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'USER',
        },
      });

      return tx.employee.create({
        data: {
          ...employeeData,
          hireDate: new Date(employeeData.hireDate),
          userId: user.id,
          employeeId,
        },
        include: {
          department: true,
        },
      });
    });

    await this.departmentRepository.updateHeadCount(data.departmentId);

    return employee;
  }

  async findById(id: string) {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }
    return employee;
  }

  async findAll(filters: EmployeeFilters) {
    return this.employeeRepository.findAll(filters);
  }

  async update(id: string, data: UpdateEmployeeData) {

    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new AppError('Employee not found', 404);
    }

    if (data.departmentId) {
      const department = await this.departmentRepository.findById(data.departmentId);
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }

    if (data.email && data.email !== existingEmployee.email) {
      if (await this.employeeRepository.existsByEmail(data.email, id)) {
        throw new AppError('Employee with this email already exists', 400);
      }
    }

    const oldDepartmentId = existingEmployee.departmentId;
    const updateData = {
      ...data,
      ...(data.hireDate && { hireDate: new Date(data.hireDate) }),
    };
    const employee = await this.employeeRepository.update(id, updateData);

    if (data.departmentId && data.departmentId !== oldDepartmentId) {
      await Promise.all([
        this.departmentRepository.updateHeadCount(oldDepartmentId),
        this.departmentRepository.updateHeadCount(data.departmentId),
      ]);
    }

    return employee;
  }

  async delete(id: string) {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    await this.employeeRepository.delete(id);

    await this.departmentRepository.updateHeadCount(employee.departmentId);

    return { message: 'Employee deleted successfully' };
  }

  async getStats() {
    return this.employeeRepository.getStats();
  }
}
