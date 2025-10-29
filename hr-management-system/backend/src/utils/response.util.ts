import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtil {
  static success<T>(res: Response, data?: T, message?: string, statusCode = 200) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode = 400, errors?: any) {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static serverError(res: Response, message = 'Internal server error') {
    return this.error(res, message, 500);
  }
}
