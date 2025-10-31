import { body, param, query } from 'express-validator';
import { ScheduleType } from '@prisma/client';

const scheduleTypes = Object.values(ScheduleType);

export const createScheduleValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Invalid start time format'),
  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .isISO8601()
    .withMessage('Invalid end time format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startTime)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  body('type')
    .optional()
    .isIn(scheduleTypes)
    .withMessage(`Invalid schedule type. Must be one of: ${scheduleTypes.join(', ')}`),
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required')
    .isUUID()
    .withMessage('Invalid employee ID'),
];

export const updateScheduleValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid schedule ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('startTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid start time format'),
  body('endTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid end time format')
    .custom((value, { req }) => {
      const startTime = req.body.startTime || (req as any).schedule?.startTime;
      if (startTime && new Date(value) <= new Date(startTime)) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  body('type')
    .optional()
    .isIn(scheduleTypes)
    .withMessage(`Invalid schedule type. Must be one of: ${scheduleTypes.join(', ')}`),
  body('employeeId')
    .optional()
    .isUUID()
    .withMessage('Invalid employee ID'),
];

export const getScheduleValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid schedule ID'),
];

export const listSchedulesValidator = [
  query('employeeId')
    .optional()
    .isUUID()
    .withMessage('Invalid employee ID'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
];