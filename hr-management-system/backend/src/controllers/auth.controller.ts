import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthRequest } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      return ResponseUtil.success(
        res,
        result,
        'User registered successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      return ResponseUtil.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }
      const user = await this.authService.getCurrentUser(req.user.id);
      return ResponseUtil.success(res, user);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }
      const { firstName, lastName } = req.body;
      const user = await this.authService.updateProfile(req.user.id, { firstName, lastName });
      return ResponseUtil.success(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseUtil.unauthorized(res);
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return ResponseUtil.error(res, 'Current password and new password are required', 400);
      }
      const result = await this.authService.changePassword(req.user.id, currentPassword, newPassword);
      return ResponseUtil.success(res, result, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return ResponseUtil.error(res, 'Refresh token is required', 400);
      }
      const result = await this.authService.refreshToken(refreshToken);
      return ResponseUtil.success(res, result, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  };
}      