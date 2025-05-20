import { Request, Response, NextFunction } from 'express';
import { Patient, patientSchema } from '../models/patient.model';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = patientSchema.parse(req.body);
    const patient = await Patient.create(validatedData);
    
    logger.info('Patient created:', { patientId: patient._id });
    res.status(201).json({
      status: 'success',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

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

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = patientSchema.parse(req.body);
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      throw new AppError(404, 'Patient not found');
    }

    logger.info('Patient updated:', { patientId: patient._id });
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