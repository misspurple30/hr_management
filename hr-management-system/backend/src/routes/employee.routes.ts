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

/**
 * @route   GET /api/employees/stats
 * @desc    Get employee statistics
 * @access  Private (HR_MANAGER, ADMIN)
 */
router.get(
  '/stats',
  authorize('HR_MANAGER', 'ADMIN'),
  employeeController.getStats
);

/**
 * @route   GET /api/employees
 * @desc    Get all employees with filters
 * @access  Private
 */
router.get('/', validate(listEmployeesValidator), employeeController.findAll);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Private
 */
router.get('/:id', validate(getEmployeeValidator), employeeController.findById);

/**
 * @route   POST /api/employees
 * @desc    Create new employee
 * @access  Private (HR_MANAGER, ADMIN)
 */
router.post(
  '/',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(createEmployeeValidator),
  employeeController.create
);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee
 * @access  Private (HR_MANAGER, ADMIN)
 */
router.put(
  '/:id',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(updateEmployeeValidator),
  employeeController.update
);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee
 * @access  Private (ADMIN)
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(getEmployeeValidator),
  employeeController.delete
);

export default router;
