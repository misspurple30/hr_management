import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(helmet());
const allowedOrigins = [
  /http:\/\/localhost:\d+/,
  process.env.FRONTEND_URL,
].filter(Boolean) as (string | RegExp)[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((allowed) =>
        allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
      );
      callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
    },
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);

// TEMPORAIRE — à retirer après le premier seed confirmé en production
app.get('/api/admin/seed', async (req, res) => {
  if (req.query.key !== process.env.SEED_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const { execSync } = await import('child_process');
    // 2>&1 fusionne stderr dans stdout : toute erreur silencieuse de prisma/ts-node devient visible
    const migrateOutput = execSync('npx prisma migrate deploy 2>&1', { encoding: 'utf-8' });
    const seedOutput = execSync('npx ts-node prisma/seed.ts 2>&1', { encoding: 'utf-8' });

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const userCount = await prisma.user.count();
    await prisma.$disconnect();

    return res.json({ success: true, migrateOutput, seedOutput, userCount });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      output: error.stdout?.toString() || error.stderr?.toString(),
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HR Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      employees: '/api/employees',
      departments: '/api/departments',
      dashboard: '/api/dashboard',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
