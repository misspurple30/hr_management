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

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/departments
 * @desc    Get all departments
 * @access  Private
 */
router.get('/', departmentController.findAll);

/**
 * @route   GET /api/departments/:id
 * @desc    Get department by ID
 * @access  Private
 */
router.get('/:id', validate(getDepartmentValidator), departmentController.findById);

/**
 * @route   POST /api/departments
 * @desc    Create new department
 * @access  Private (HR_MANAGER, ADMIN)
 */
router.post(
  '/',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(createDepartmentValidator),
  departmentController.create
);

/**
 * @route   PUT /api/departments/:id
 * @desc    Update department
 * @access  Private (HR_MANAGER, ADMIN)
 */
router.put(
  '/:id',
  authorize('HR_MANAGER', 'ADMIN'),
  validate(updateDepartmentValidator),
  departmentController.update
);

/**
 * @route   DELETE /api/departments/:id
 * @desc    Delete department
 * @access  Private (ADMIN)
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(getDepartmentValidator),
  departmentController.delete
);

export default router;
