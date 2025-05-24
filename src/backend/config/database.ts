
import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

export const setupDatabase = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);

    // Connect to MongoDB
    await mongoose.connect(config.mongoUri, {
      // Remove deprecated options
    });

    logger.info('Database connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('Database connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Database disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Database reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Database connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};
