import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const commonSchemas = {
  id: {
    params: {
      id: /^[0-9a-fA-F]{24}$/,
    },
  },
  pagination: {
    query: {
      page: /^\d+$/,
      limit: /^\d+$/,
      sort: /^[a-zA-Z0-9_,-]+$/,
    },
  },
  dateRange: {
    query: {
      startDate: /^\d{4}-\d{2}-\d{2}$/,
      endDate: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
};

// Error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: error.message,
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
    });
  }

  if (error.name === 'MongoError' && (error as any).code === 11000) {
    return res.status(409).json({
      message: 'Duplicate key error',
    });
  }

  res.status(500).json({
    message: 'Internal server error',
  });
}; 