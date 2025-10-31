import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

// All routes require authentication
router.use(authenticate);

router.get('/stats', dashboardController.getStats);

export default router;