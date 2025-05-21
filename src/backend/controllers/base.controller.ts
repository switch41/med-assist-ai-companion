import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';

export class BaseController<T extends Document> {
  constructor(private model: Model<T>) {}

  // Create a new document
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = new this.model(req.body);
      const savedDocument = await document.save();
      res.status(201).json(savedDocument);
    } catch (error) {
      next(error);
    }
  };

  // Get all documents with pagination and filtering
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Build filter from query parameters
      const filter: any = {};
      Object.keys(req.query).forEach(key => {
        if (!['page', 'limit', 'sort'].includes(key)) {
          filter[key] = req.query[key];
        }
      });

      // Build sort object
      const sort: any = {};
      if (req.query.sort) {
        const sortFields = (req.query.sort as string).split(',');
        sortFields.forEach(field => {
          const order = field.startsWith('-') ? -1 : 1;
          const fieldName = field.startsWith('-') ? field.substring(1) : field;
          sort[fieldName] = order;
        });
      }

      const [documents, total] = await Promise.all([
        this.model
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.model.countDocuments(filter)
      ]);

      res.json({
        data: documents,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
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
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(document);
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
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      next(error);
    }
  };

  // Delete a document
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.model.findByIdAndDelete(req.params.id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
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
        { status: 'deleted' },
        { new: true }
      );
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      next(error);
    }
  };

  // Restore a soft-deleted document
  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.model.findByIdAndUpdate(
        req.params.id,
        { status: 'active' },
        { new: true }
      );
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(document);
    } catch (error) {
      next(error);
    }
  };
} 