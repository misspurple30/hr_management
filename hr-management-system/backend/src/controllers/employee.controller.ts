import { EmployeeService } from '../services/employee.service';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await this.employeeService.create(req.body);
      return ResponseUtil.success(
        res,
        employee,
        'Employee created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.findById(id);
      return ResponseUtil.success(res, employee);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        search: req.query.search as string,
        departmentId: req.query.departmentId as string,
        status: req.query.status as any,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await this.employeeService.findAll(filters);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.update(id, req.body);
      return ResponseUtil.success(res, employee, 'Employee updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.employeeService.delete(id);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.employeeService.getStats();
      return ResponseUtil.success(res, stats);
    } catch (error) {
      next(error);
    }
  };
}