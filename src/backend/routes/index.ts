
import { Express } from 'express';
import { authenticate } from '../middleware/security';
import { errorHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Import route modules
import authRoutes from './auth.routes';
import { patientRouter } from './patient.router';
import { medicalRecordRouter } from './medical-record.router';
import providerRoutes from './provider.routes';
import chatRoutes from './chat.routes';
import healthRoutes from './health.routes';

export const setupRoutes = (app: Express) => {
  // Health check endpoint (public)
  app.use('/api/health', healthRoutes);

  // Auth routes (public)
  app.use('/api/auth', authRoutes);

  // Protected routes - require authentication
  app.use('/api/patients', authenticate, patientRouter);
  app.use('/api/medical-records', authenticate, medicalRecordRouter);
  app.use('/api/providers', authenticate, providerRoutes);
  app.use('/api/chat', authenticate, chatRoutes);

  // Global error handler
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });
};
