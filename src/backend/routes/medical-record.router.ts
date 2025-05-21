import { Router } from 'express';
import { BaseRouter } from './base.router';
import { MedicalRecordController } from '../controllers/medical-record.controller';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';
import { IMedicalRecord } from '../models/medical-record.model';

// Validation schemas
const patientQuerySchema = z.object({
  query: z.object({
    type: z.string().optional(),
    status: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

const typeQuerySchema = z.object({
  query: z.object({
    patientId: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

export class MedicalRecordRouter extends BaseRouter<IMedicalRecord> {
  constructor() {
    super(new MedicalRecordController());
  }

  protected initializeRoutes(): void {
    // Base CRUD routes
    super.initializeRoutes();

    // Medical record-specific routes
    const controller = this.controller as MedicalRecordController;

    // Get medical records by patient
    this.router.get(
      '/patient/:patientId',
      validate(patientQuerySchema),
      controller.getByPatient
    );

    // Get medical records by encounter
    this.router.get(
      '/encounter/:encounterId',
      controller.getByEncounter
    );

    // Get medical records by type
    this.router.get(
      '/type/:type',
      validate(typeQuerySchema),
      controller.getByType
    );

    // Get related medical records
    this.router.get(
      '/:id/related',
      controller.getRelated
    );
  }
}

// Create and export router instance
const router = new MedicalRecordRouter();
export const medicalRecordRouter = router.router; 