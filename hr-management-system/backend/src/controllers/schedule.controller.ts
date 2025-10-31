import { Request, Response, NextFunction } from 'express';
import { ScheduleService } from '../services/schedule.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthRequest } from '../types'; 

export class ScheduleController {
  private scheduleService: ScheduleService;

  constructor() {
    this.scheduleService = new ScheduleService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schedule = await this.scheduleService.create(req.body);
      return ResponseUtil.success(
        res,
        schedule,
        'Schedule created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const schedule = await this.scheduleService.findById(id);
      return ResponseUtil.success(res, schedule);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Utilisez la nouvelle méthode pour filtrer par utilisateur
      const schedules = await this.scheduleService.findForUser(req);
      return ResponseUtil.success(res, schedules);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const schedule = await this.scheduleService.update(id, req.body);
      return ResponseUtil.success(res, schedule, 'Schedule updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.scheduleService.delete(id);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  };
}