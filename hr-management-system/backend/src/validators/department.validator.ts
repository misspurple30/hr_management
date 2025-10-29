import { body as deptBody, param as deptParam } from 'express-validator';

export const createDepartmentValidator = [
  deptBody('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters'),
  deptBody('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  deptBody('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
];

export const updateDepartmentValidator = [
  deptParam('id')
    .isUUID()
    .withMessage('Invalid department ID'),
  deptBody('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters'),
  deptBody('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  deptBody('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
];

export const getDepartmentValidator = [
  deptParam('id')
    .isUUID()
    .withMessage('Invalid department ID'),
];