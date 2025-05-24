
import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class BaseController<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // Create a new document
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = new this.model(req.body);
      const savedDocument = await document.save();
      res.status(201).json({
        status: 'success',
        data: savedDocument,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all documents with pagination and filtering
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, sort = '-createdAt', ...filters } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [documents, total] = await Promise.all([
        this.model
          .find(filters)
          .sort(sort as string)
          .skip(skip)
          .limit(Number(limit))
          .exec(),
        this.model.countDocuments(filters)
      ]);

      res.json({
        status: 'success',
        results: documents.length,
        data: documents,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Get a single document by ID
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.model.findById(req.params.id);
      if (!document) {
        throw new AppError(404, 'Document not found');
      }
      res.json({
        status: 'success',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update a document
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!document) {
        throw new AppError(404, 'Document not found');
      }
      res.json({
        status: 'success',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete a document
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.model.findByIdAndDelete(req.params.id);
      if (!document) {
        throw new AppError(404, 'Document not found');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Soft delete a document (if the model supports it)
  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.model.findByIdAndUpdate(
        req.params.id,
        { deletedAt: new Date() },
        { new: true }
      );
      if (!document) {
        throw new AppError(404, 'Document not found');
      }
      res.json({
        status: 'success',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  };

  // Restore a soft-deleted document
  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.model.findByIdAndUpdate(
        req.params.id,
        { $unset: { deletedAt: 1 } },
        { new: true }
      );
      if (!document) {
        throw new AppError(404, 'Document not found');
      }
      res.json({
        status: 'success',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  };
}
