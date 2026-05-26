import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import treeRoutes from './routes/treeRoutes';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/errors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();

// 1. Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// 2. Base Routes
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Tree Monitoring API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Swagger Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/trees', treeRoutes);

// 3. 404 Route handler
app.all('*', (req, _res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// 4. Global Error Handler
app.use(errorHandler);

export default app;
