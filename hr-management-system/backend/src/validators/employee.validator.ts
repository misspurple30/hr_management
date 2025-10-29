import { body, param, query } from 'express-validator';

export const createEmployeeValidator = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid phone number'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required'),
  body('departmentId')
    .notEmpty()
    .withMessage('Department is required')
    .isUUID()
    .withMessage('Invalid department ID'),
  body('hireDate')
    .notEmpty()
    .withMessage('Hire date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'])
    .withMessage('Invalid status'),
];

export const updateEmployeeValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid employee ID'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid phone number'),
  body('position')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Position cannot be empty'),
  body('departmentId')
    .optional()
    .isUUID()
    .withMessage('Invalid department ID'),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'])
    .withMessage('Invalid status'),
];

export const getEmployeeValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid employee ID'),
];

export const listEmployeesValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim(),
  query('departmentId')
    .optional()
    .isUUID()
    .withMessage('Invalid department ID'),
  query('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'])
    .withMessage('Invalid status'),
  query('sortBy')
    .optional()
    .isIn(['firstName', 'lastName', 'email', 'position', 'hireDate', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];
