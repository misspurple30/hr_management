import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Security middleware
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

// Body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);

// Root route
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
