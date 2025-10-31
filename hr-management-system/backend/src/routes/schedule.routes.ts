import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createScheduleValidator,
  updateScheduleValidator,
  getScheduleValidator,
  listSchedulesValidator,
} from '../validators/schedule.validator';
import { AuthRequest } from '../types'; 

const router = Router();
const scheduleController = new ScheduleController();

router.use(authenticate);
router.get(
  '/',
  validate(listSchedulesValidator),
  (req, res, next) => scheduleController.findAll(req as AuthRequest, res, next)
);

router.get('/:id', validate(getScheduleValidator), scheduleController.findById);

router.post(
  '/',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(createScheduleValidator),
  scheduleController.create
);

router.put(
  '/:id',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(updateScheduleValidator),
  scheduleController.update
);

router.delete(
  '/:id',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(getScheduleValidator),
  scheduleController.delete
);

export default router;