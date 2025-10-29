import {
  DepartmentRepository,
  CreateDepartmentData,
  UpdateDepartmentData,
} from '../repositories/department.repository';

export class DepartmentService {
  private departmentRepository: DepartmentRepository;

  constructor() {
    this.departmentRepository = new DepartmentRepository();
  }

  async create(data: CreateDepartmentData) {
    // Check if department name already exists
    if (await this.departmentRepository.existsByName(data.name)) {
      throw new AppError('Department with this name already exists', 400);
    }

    return this.departmentRepository.create(data);
  }

  async findById(id: string) {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    return department;
  }

  async findAll() {
    return this.departmentRepository.findAll();
  }

  async update(id: string, data: UpdateDepartmentData) {
    // Verify department exists
    const existingDepartment = await this.departmentRepository.findById(id);
    if (!existingDepartment) {
      throw new AppError('Department not found', 404);
    }

    // Check if new name already exists
    if (data.name && data.name !== existingDepartment.name) {
      if (await this.departmentRepository.existsByName(data.name, id)) {
        throw new AppError('Department with this name already exists', 400);
      }
    }

    return this.departmentRepository.update(id, data);
  }

  async delete(id: string) {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Check if department has employees
    if (department._count && department._count.employees > 0) {
      throw new AppError(
        'Cannot delete department with active employees. Please reassign employees first.',
        400
      );
    }

    await this.departmentRepository.delete(id);
    return { message: 'Department deleted successfully' };
  }
}
