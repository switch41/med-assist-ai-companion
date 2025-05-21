import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { MedicalRecord, IMedicalRecord } from '../models/medical-record.model';
import { z } from 'zod';

// Validation schemas
const medicalRecordSchema = z.object({
  patient: z.string(),
  type: z.enum(['encounter', 'condition', 'procedure', 'observation', 'immunization', 'allergy']),
  status: z.enum(['active', 'inactive', 'resolved', 'error']),
  category: z.array(z.object({
    coding: z.array(z.object({
      system: z.string(),
      code: z.string(),
      display: z.string()
    }))
  })),
  code: z.object({
    coding: z.array(z.object({
      system: z.string(),
      code: z.string(),
      display: z.string()
    }))
  }),
  subject: z.object({
    reference: z.string(),
    display: z.string().optional()
  }),
  encounter: z.object({
    reference: z.string(),
    display: z.string().optional()
  }).optional(),
  effectiveDateTime: z.date(),
  issued: z.date(),
  performer: z.array(z.object({
    reference: z.string(),
    display: z.string().optional()
  })).optional(),
  valueQuantity: z.object({
    value: z.number(),
    unit: z.string(),
    system: z.string().optional(),
    code: z.string().optional()
  }).optional(),
  valueCodeableConcept: z.object({
    coding: z.array(z.object({
      system: z.string(),
      code: z.string(),
      display: z.string()
    }))
  }).optional(),
  valueString: z.string().optional(),
  valueBoolean: z.boolean().optional(),
  valueDateTime: z.date().optional(),
  interpretation: z.array(z.object({
    coding: z.array(z.object({
      system: z.string(),
      code: z.string(),
      display: z.string()
    }))
  })).optional(),
  note: z.array(z.object({
    text: z.string(),
    time: z.date().optional(),
    author: z.object({
      reference: z.string(),
      display: z.string().optional()
    }).optional()
  })).optional(),
  related: z.array(z.object({
    type: z.string(),
    target: z.object({
      reference: z.string(),
      display: z.string().optional()
    })
  })).optional()
});

export class MedicalRecordController extends BaseController<IMedicalRecord> {
  constructor() {
    super(MedicalRecord);
  }

  // Override create method to handle validation
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = medicalRecordSchema.parse(req.body);
      const medicalRecord = new MedicalRecord(validatedData);
      const savedRecord = await medicalRecord.save();
      res.status(201).json(savedRecord);
    } catch (error) {
      next(error);
    }
  };

  // Override update method to handle validation
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = medicalRecordSchema.partial().parse(req.body);
      const medicalRecord = await MedicalRecord.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
      );
      if (!medicalRecord) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json(medicalRecord);
    } catch (error) {
      next(error);
    }
  };

  // Get medical records by patient
  getByPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const { type, status, startDate, endDate } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: any = { patient: patientId };
      if (type) filter.type = type;
      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.effectiveDateTime = {};
        if (startDate) filter.effectiveDateTime.$gte = new Date(startDate as string);
        if (endDate) filter.effectiveDateTime.$lte = new Date(endDate as string);
      }

      const [records, total] = await Promise.all([
        MedicalRecord.find(filter)
          .sort({ effectiveDateTime: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        MedicalRecord.countDocuments(filter)
      ]);

      res.json({
        data: records,
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

  // Get medical records by encounter
  getByEncounter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { encounterId } = req.params;
      const records = await MedicalRecord.find({ 'encounter.reference': encounterId })
        .sort({ effectiveDateTime: -1 });
      res.json(records);
    } catch (error) {
      next(error);
    }
  };

  // Get medical records by type
  getByType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const { patientId } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: any = { type };
      if (patientId) filter.patient = patientId;

      const [records, total] = await Promise.all([
        MedicalRecord.find(filter)
          .sort({ effectiveDateTime: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        MedicalRecord.countDocuments(filter)
      ]);

      res.json({
        data: records,
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

  // Get related medical records
  getRelated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const record = await MedicalRecord.findById(id);
      if (!record) {
        return res.status(404).json({ message: 'Medical record not found' });
      }

      const relatedRecords = await MedicalRecord.find({
        $or: [
          { 'related.target.reference': record._id },
          { _id: { $in: record.related?.map(r => r.target.reference) || [] } }
        ]
      });

      res.json(relatedRecords);
    } catch (error) {
      next(error);
    }
  };
} 