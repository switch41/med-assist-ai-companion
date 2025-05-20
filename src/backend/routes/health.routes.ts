import { Router } from 'express';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };

  try {
    res.send(healthcheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).send();
  }
});

export default router; 