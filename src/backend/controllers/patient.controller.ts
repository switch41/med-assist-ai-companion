import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { Patient, IPatient } from '../models/patient.model';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Validation schemas
const patientSchema = z.object({
  identifier: z.array(z.object({
    system: z.string(),
    value: z.string()
  })),
  active: z.boolean().default(true),
  name: z.array(z.object({
    use: z.string(),
    family: z.string(),
    given: z.array(z.string()),
    prefix: z.array(z.string()).optional(),
    suffix: z.array(z.string()).optional()
  })),
  telecom: z.array(z.object({
    system: z.string(),
    value: z.string(),
    use: z.string().optional()
  })),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  birthDate: z.date(),
  address: z.array(z.object({
    use: z.string().optional(),
    type: z.string().optional(),
    text: z.string().optional(),
    line: z.array(z.string()).optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  })),
  maritalStatus: z.object({
    coding: z.array(z.object({
      system: z.string(),
      code: z.string(),
      display: z.string()
    }))
  }).optional(),
  communication: z.array(z.object({
    language: z.object({
      coding: z.array(z.object({
        system: z.string(),
        code: z.string(),
        display: z.string()
      }))
    }),
    preferred: z.boolean().default(false)
  })).optional(),
  managingOrganization: z.object({
    reference: z.string(),
    display: z.string().optional()
  }).optional(),
  password: z.string().min(8),
  mfaEnabled: z.boolean().default(false),
  mfaSecret: z.string().optional()
});

export class PatientController extends BaseController<IPatient> {
  constructor() {
    super(Patient);
  }

  // Override create method to handle password hashing
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = patientSchema.parse(req.body);
      const patient = new Patient(validatedData);
      const savedPatient = await patient.save();
      res.status(201).json(savedPatient);
    } catch (error) {
      next(error);
    }
  };

  // Override update method to handle password hashing
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = patientSchema.partial().parse(req.body);
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
      );
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      next(error);
    }
  };

  // Get patient by identifier
  getByIdentifier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { system, value } = req.query;
      const patient = await Patient.findOne({
        'identifier': { $elemMatch: { system, value } }
      });
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      next(error);
    }
  };

  // Search patients
  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const searchQuery = {
        $or: [
          { 'name.family': { $regex: query, $options: 'i' } },
          { 'name.given': { $regex: query, $options: 'i' } },
          { 'identifier.value': { $regex: query, $options: 'i' } }
        ]
      };

      const [patients, total] = await Promise.all([
        Patient.find(searchQuery)
          .skip(skip)
          .limit(Number(limit))
          .exec(),
        Patient.countDocuments(searchQuery)
      ]);

      res.json({
        data: patients,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Update patient status
  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { active } = req.body;
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        { active },
        { new: true }
      );
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      next(error);
    }
  };

  // Get patient's medical history
  getMedicalHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patient = await Patient.findById(req.params.id)
        .populate('medicalRecords')
        .populate('appointments')
        .populate('medications');
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      res.json({
        patient: {
          id: patient._id,
          name: patient.name,
          identifier: patient.identifier
        },
        medicalHistory: {
          records: patient.medicalRecords,
          appointments: patient.appointments,
          medications: patient.medications
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export const getPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      throw new AppError(404, 'Patient not found');
    }

    res.status(200).json({
      status: 'success',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      throw new AppError(404, 'Patient not found');
    }

    logger.info('Patient deleted:', { patientId: req.params.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const searchPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, birthDate, gender } = req.query;
    const query: any = {};

    if (name) {
      query['name.family'] = { $regex: name, $options: 'i' };
    }
    if (birthDate) {
      query.birthDate = birthDate;
    }
    if (gender) {
      query.gender = gender;
    }

    const patients = await Patient.find(query);
    
    res.status(200).json({
      status: 'success',
      results: patients.length,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
}; 