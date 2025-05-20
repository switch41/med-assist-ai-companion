import { Router } from 'express';
import {
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
  searchPatients,
} from '../controllers/patient.controller';
import { authorize } from '../middleware/security';

const router = Router();

// Apply authorization middleware to all routes
router.use(authorize('admin', 'provider', 'nurse'));

// Patient routes
router.route('/')
  .get(searchPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatient)
  .patch(updatePatient)
  .delete(authorize('admin'), deletePatient);

export default router; 