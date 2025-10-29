import { DepartmentService } from '../services/department.service';

export class DepartmentController {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const department = await this.departmentService.create(req.body);
      return ResponseUtil.success(
        res,
        department,
        'Department created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const department = await this.departmentService.findById(id);
      return ResponseUtil.success(res, department);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const departments = await this.departmentService.findAll();
      return ResponseUtil.success(res, departments);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const department = await this.departmentService.update(id, req.body);
      return ResponseUtil.success(res, department, 'Department updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.departmentService.delete(id);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}
