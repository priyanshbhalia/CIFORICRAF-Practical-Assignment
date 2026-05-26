import * as dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`[Server]: Tree Monitoring API running on http://localhost:${PORT}`);
});

// Handle unhandled rejections and exceptions to make the server resilient
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
