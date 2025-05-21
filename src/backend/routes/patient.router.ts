import { Router } from 'express';
import { BaseRouter } from './base.router';
import { PatientController } from '../controllers/patient.controller';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { IPatient } from '../models/patient.model';

// Validation schemas
const identifierSchema = z.object({
  query: z.object({
    system: z.string(),
    value: z.string()
  })
});

const searchSchema = z.object({
  query: z.object({
    query: z.string(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

const statusSchema = z.object({
  body: z.object({
    active: z.boolean()
  })
});

export class PatientRouter extends BaseRouter<IPatient> {
  constructor() {
    super(new PatientController());
  }

  protected initializeRoutes(): void {
    // Base CRUD routes
    super.initializeRoutes();

    // Patient-specific routes
    const controller = this.controller as PatientController;
    
    this.router.get(
      '/identifier',
      validate(identifierSchema),
      controller.getByIdentifier
    );

    this.router.get(
      '/search',
      validate(searchSchema),
      controller.search
    );

    this.router.patch(
      '/:id/status',
      validate(statusSchema),
      controller.updateStatus
    );

    this.router.get(
      '/:id/medical-history',
      controller.getMedicalHistory
    );
  }
}

// Create and export router instance
const router = new PatientRouter();
export const patientRouter = router.router; 