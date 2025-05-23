
import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authorize } from '../middleware/security';

const router = Router();
const chatController = new ChatController();

// Patient routes
router.route('/')
  .post(authorize('patient'), chatController.create);

router.route('/:id')
  .get(authorize('patient', 'provider', 'nurse'), chatController.getById)
  .post(authorize('patient'), chatController.update)
  .patch(authorize('provider', 'nurse'), chatController.update);

export default router;
