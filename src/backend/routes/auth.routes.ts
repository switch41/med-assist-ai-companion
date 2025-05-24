
import { Router } from 'express';
import { Patient } from '../models/patient.model';
import { AppError } from '../middleware/errorHandler';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';

const router = Router();

// Register route
router.post('/register', async (req, res, next) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      birthDate,
      phone
    } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({
      'telecom.value': email
    });

    if (existingPatient) {
      throw new AppError(409, 'Patient with this email already exists');
    }

    // Create new patient
    const patientData = {
      identifier: [{
        system: 'email',
        value: email
      }],
      active: true,
      name: [{
        use: 'official',
        family: lastName,
        given: [firstName]
      }],
      telecom: [
        {
          system: 'email',
          value: email,
          use: 'home'
        }
      ],
      gender,
      birthDate: new Date(birthDate),
      address: [],
      communication: [{
        language: {
          coding: [{
            system: 'urn:ietf:bcp:47',
            code: 'en-US',
            display: 'English (United States)'
          }]
        },
        preferred: true
      }],
      password
    };

    if (phone) {
      patientData.telecom.push({
        system: 'phone',
        value: phone,
        use: 'mobile'
      });
    }

    const patient = new Patient(patientData);
    await patient.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: patient._id,
        email: email,
        role: 'patient'
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    logger.info('Patient registered successfully:', { patientId: patient._id });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        patient: {
          id: patient._id,
          name: patient.name[0],
          email: email
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    // Find patient by email
    const patient = await Patient.findOne({
      'telecom.value': email
    }).select('+password');

    if (!patient || !(await patient.comparePassword(password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Update last login
    patient.lastLogin = new Date();
    await patient.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: patient._id,
        email: email,
        role: 'patient'
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    logger.info('Patient logged in successfully:', { patientId: patient._id });

    res.json({
      status: 'success',
      token,
      data: {
        patient: {
          id: patient._id,
          name: patient.name[0],
          email: email
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as any;

    const patient = await Patient.findById(decoded.id);
    if (!patient) {
      throw new AppError(404, 'Patient not found');
    }

    res.json({
      status: 'success',
      data: {
        patient: {
          id: patient._id,
          name: patient.name[0],
          email: patient.telecom.find(t => t.system === 'email')?.value
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
