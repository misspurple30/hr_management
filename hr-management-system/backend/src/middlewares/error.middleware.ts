import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return ResponseUtil.error(res, err.message, err.statusCode);
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return ResponseUtil.error(res, 'Database error', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseUtil.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseUtil.unauthorized(res, 'Token expired');
  }

  // Default error
  return ResponseUtil.serverError(res, err.message || 'Something went wrong');
};
