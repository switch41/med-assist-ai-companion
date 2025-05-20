import { Express } from 'express';
import { authenticate } from '../middleware/security';
import { logger } from '../utils/logger';

// Import route modules
import authRoutes from './auth.routes';
import patientRoutes from './patient.routes';
import providerRoutes from './provider.routes';
import chatRoutes from './chat.routes';
import healthRoutes from './health.routes';

export const setupRoutes = (app: Express) => {
  // Health check endpoint
  app.use('/api/health', healthRoutes);

  // Auth routes (public)
  app.use('/api/auth', authRoutes);

  // Protected routes
  app.use('/api/patients', authenticate, patientRoutes);
  app.use('/api/providers', authenticate, providerRoutes);
  app.use('/api/chat', authenticate, chatRoutes);

  // 404 handler
  app.use((req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });
}; 