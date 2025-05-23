
import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { authorize } from '../middleware/security';

const router = Router();
const patientController = new PatientController();

// Apply authorization middleware to all routes
router.use(authorize('admin', 'provider', 'nurse'));

// Patient routes
router.route('/')
  .get(patientController.search)
  .post(patientController.create);

router.route('/:id')
  .get(patientController.getById)
  .patch(patientController.update)
  .delete(authorize('admin'), patientController.delete);

export default router;
