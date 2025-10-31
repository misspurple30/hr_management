import app from './app';
import dotenv from 'dotenv';
import prisma from './config/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to database and start server
const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(` Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(` API available at http://localhost:${PORT}/api`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! ');
  console.error(err.name, err.message);
  process.exit(1);
});
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! ');
  console.error(err.name, err.message);
  process.exit(1);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();