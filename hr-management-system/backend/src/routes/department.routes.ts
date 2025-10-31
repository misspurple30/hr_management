import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createDepartmentValidator,
  updateDepartmentValidator,
  getDepartmentValidator,
} from '../validators/department.validator';

const router = Router();
const departmentController = new DepartmentController();

router.use(authenticate);

router.get('/', departmentController.findAll);

router.get('/:id', validate(getDepartmentValidator), departmentController.findById);

router.post(
  '/',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(createDepartmentValidator),
  departmentController.create
);

router.put(
  '/:id',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(updateDepartmentValidator),
  departmentController.update
);

router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(getDepartmentValidator),
  departmentController.delete
);

export default router;
