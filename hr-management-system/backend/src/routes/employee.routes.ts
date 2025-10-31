import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createEmployeeValidator,
  updateEmployeeValidator,
  getEmployeeValidator,
  listEmployeesValidator,
} from '../validators/employee.validator';

const router = Router();
const employeeController = new EmployeeController();

// All routes require authentication
router.use(authenticate);

router.get(
  '/stats',
  authorize('HR_MANAGER', 'ADMIN'),
  employeeController.getStats
);

router.get('/', validate(listEmployeesValidator), employeeController.findAll);

router.get('/:id', validate(getEmployeeValidator), employeeController.findById);

router.post(
  '/',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(createEmployeeValidator),
  employeeController.create
);

router.put(
  '/:id',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(updateEmployeeValidator),
  employeeController.update
);


router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(getEmployeeValidator),
  employeeController.delete
);

export default router;
