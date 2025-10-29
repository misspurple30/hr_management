import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getStats();
      return ResponseUtil.success(res, stats);
    } catch (error) {
      next(error);
    }
  };
}