
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { MedicalRecord, IMedicalRecord } from '../models/medical-record.model';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class MedicalRecordController extends BaseController<IMedicalRecord> {
  constructor() {
    super(MedicalRecord);
  }

  // Get medical records by patient
  getByPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const { type, status, startDate, endDate, page = 1, limit = 10 } = req.query;
      
      const query: any = { patient: patientId };
      
      if (type) query.type = type;
      if (status) query.status = status;
      if (startDate || endDate) {
        query.effectiveDateTime = {};
        if (startDate) query.effectiveDateTime.$gte = new Date(startDate as string);
        if (endDate) query.effectiveDateTime.$lte = new Date(endDate as string);
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [records, total] = await Promise.all([
        MedicalRecord.find(query)
          .sort({ effectiveDateTime: -1 })
          .skip(skip)
          .limit(Number(limit))
          .exec(),
        MedicalRecord.countDocuments(query)
      ]);

      res.json({
        status: 'success',
        results: records.length,
        data: records,
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

  // Get medical records by encounter
  getByEncounter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { encounterId } = req.params;
      const records = await MedicalRecord.find({
        'encounter.reference': `Encounter/${encounterId}`
      }).sort({ effectiveDateTime: -1 });

      res.json({
        status: 'success',
        results: records.length,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get medical records by type
  getByType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const { patientId, page = 1, limit = 10 } = req.query;
      
      const query: any = { type };
      if (patientId) query.patient = patientId;

      const skip = (Number(page) - 1) * Number(limit);

      const [records, total] = await Promise.all([
        MedicalRecord.find(query)
          .sort({ effectiveDateTime: -1 })
          .skip(skip)
          .limit(Number(limit))
          .exec(),
        MedicalRecord.countDocuments(query)
      ]);

      res.json({
        status: 'success',
        results: records.length,
        data: records,
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

  // Get related medical records
  getRelated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordId = req.params.id;
      const records = await MedicalRecord.find({
        'related.target.reference': `MedicalRecord/${recordId}`
      }).sort({ effectiveDateTime: -1 });

      res.json({
        status: 'success',
        results: records.length,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };
}
