import {
  ScheduleRepository,
  CreateScheduleData,
  UpdateScheduleData,
  ScheduleFilters,
} from '../repositories/schedule.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../types'; 

export class ScheduleService {
  private scheduleRepository: ScheduleRepository;
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.scheduleRepository = new ScheduleRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  async create(data: CreateScheduleData) {
    const employee = await this.employeeRepository.findById(data.employeeId);
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    const hasConflict = await this.scheduleRepository.findConflicts(
      data.employeeId,
      new Date(data.startTime),
      new Date(data.endTime)
    );
    if (hasConflict) {
      throw new AppError('Schedule conflict detected for this employee', 400);
    }

    return this.scheduleRepository.create(data);
  }

  async findById(id: string) {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }
    return schedule;
  }

  async findAll(filters: ScheduleFilters) {
    return this.scheduleRepository.findAll(filters);
  }

  async update(id: string, data: UpdateScheduleData) {
    const existingSchedule = await this.scheduleRepository.findById(id);
    if (!existingSchedule) {
      throw new AppError('Schedule not found', 404);
    }

    if (data.employeeId && data.employeeId !== existingSchedule.employeeId) {
      const employee = await this.employeeRepository.findById(data.employeeId);
      if (!employee) {
        throw new AppError('New employee not found', 404);
      }
    }

    // Vérifier les conflits
    const employeeId = data.employeeId || existingSchedule.employeeId;
    const startTime = new Date(data.startTime || existingSchedule.startTime);
    const endTime = new Date(data.endTime || existingSchedule.endTime);

    const hasConflict = await this.scheduleRepository.findConflicts(
      employeeId,
      startTime,
      endTime,
      id 
    );
    if (hasConflict) {
      throw new AppError('Schedule conflict detected for this employee', 400);
    }

    return this.scheduleRepository.update(id, data);
  }

  async delete(id: string) {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }
    
    await this.scheduleRepository.delete(id);
    return { message: 'Schedule deleted successfully' };
  }

  async findForUser(req: AuthRequest) {
    const user = req.user;
    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    if (user.role === 'ADMIN' || user.role === 'HR_MANAGER') {
      return this.scheduleRepository.findAll(req.query as ScheduleFilters);
    }

    const employee = await this.employeeRepository.findByUserId(user.id);
    if (!employee) {
      throw new AppError('Employee profile not found for this user', 404);
    }

    return this.scheduleRepository.findAll({
      ...req.query,
      employeeId: employee.id,
    });
  }
}