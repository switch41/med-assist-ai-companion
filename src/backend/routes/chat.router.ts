
import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/security';

const router = Router();
const chatController = new ChatController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Chat routes
router.route('/')
  .get(chatController.getAll)
  .post(chatController.create);

router.route('/:id')
  .get(chatController.getById)
  .patch(chatController.update)
  .delete(chatController.delete);

export default router;
