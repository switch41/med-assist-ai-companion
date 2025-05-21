import { Router, Request, Response, NextFunction } from 'express';
import { BaseController } from '../controllers/base.controller';
import { Document } from 'mongoose';

export class BaseRouter<T extends Document> {
  public router: Router;
  protected controller: BaseController<T>;

  constructor(controller: BaseController<T>) {
    this.router = Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    // Create a new document
    this.router.post('/', this.validateCreate.bind(this), this.controller.create);

    // Get all documents with pagination and filtering
    this.router.get('/', this.validateQuery.bind(this), this.controller.getAll);

    // Get a single document by ID
    this.router.get('/:id', this.validateId.bind(this), this.controller.getById);

    // Update a document
    this.router.put('/:id', this.validateId.bind(this), this.validateUpdate.bind(this), this.controller.update);

    // Delete a document
    this.router.delete('/:id', this.validateId.bind(this), this.controller.delete);

    // Soft delete a document
    this.router.patch('/:id/soft-delete', this.validateId.bind(this), this.controller.softDelete);

    // Restore a soft-deleted document
    this.router.patch('/:id/restore', this.validateId.bind(this), this.controller.restore);
  }

  // Validation middleware
  protected validateCreate(req: Request, res: Response, next: NextFunction) {
    // Override in child classes to implement specific validation
    next();
  }

  protected validateUpdate(req: Request, res: Response, next: NextFunction) {
    // Override in child classes to implement specific validation
    next();
  }

  protected validateQuery(req: Request, res: Response, next: NextFunction) {
    // Validate query parameters
    const { page, limit, sort } = req.query;

    if (page && isNaN(Number(page))) {
      return res.status(400).json({ message: 'Invalid page number' });
    }

    if (limit && isNaN(Number(limit))) {
      return res.status(400).json({ message: 'Invalid limit value' });
    }

    if (sort && typeof sort !== 'string') {
      return res.status(400).json({ message: 'Invalid sort parameter' });
    }

    next();
  }

  protected validateId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    
    // Check if id is a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    next();
  }
} 