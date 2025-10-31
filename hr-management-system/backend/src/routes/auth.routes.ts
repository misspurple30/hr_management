import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerValidator), authController.register);

router.post('/login', validate(loginValidator), authController.login);

router.get('/me', authenticate, authController.getCurrentUser);

router.post('/refresh', authController.refreshToken);

export default router;