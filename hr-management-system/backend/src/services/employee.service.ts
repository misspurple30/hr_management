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
    // Verify department exists
    const department = await this.departmentRepository.findById(data.departmentId);
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Check if email already exists
    if (await this.employeeRepository.existsByEmail(data.email)) {
      throw new AppError('Employee with this email already exists', 400);
    }

    // Generate employee ID
    const employeeId = await this.employeeRepository.generateEmployeeId();

    // Create user account
    const hashedPassword = await PasswordUtil.hash(data.password);
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'USER',
    });

    // Create employee
    const { password, ...employeeData } = data;
    const employee = await this.employeeRepository.create({
      ...employeeData,
      userId: user.id,
      employeeId,
    });

    // Update department head count
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
    // Verify employee exists
    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new AppError('Employee not found', 404);
    }

    // If department is being changed, verify it exists
    if (data.departmentId) {
      const department = await this.departmentRepository.findById(data.departmentId);
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }

    // Check if email is being changed and already exists
    if (data.email && data.email !== existingEmployee.email) {
      if (await this.employeeRepository.existsByEmail(data.email, id)) {
        throw new AppError('Employee with this email already exists', 400);
      }
    }

    const oldDepartmentId = existingEmployee.departmentId;
    const employee = await this.employeeRepository.update(id, data);

    // Update department head counts if department changed
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

    // Update department head count
    await this.departmentRepository.updateHeadCount(employee.departmentId);

    return { message: 'Employee deleted successfully' };
  }

  async getStats() {
    return this.employeeRepository.getStats();
  }
}
