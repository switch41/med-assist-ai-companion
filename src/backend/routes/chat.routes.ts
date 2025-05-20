import { Router } from 'express';
import {
  createChat,
  getChat,
  addMessage,
  updateChatStatus,
} from '../controllers/chat.controller';
import { authorize } from '../middleware/security';

const router = Router();

// Patient routes
router.route('/')
  .post(authorize('patient'), createChat);

router.route('/:id')
  .get(authorize('patient', 'provider', 'nurse'), getChat)
  .post(authorize('patient'), addMessage)
  .patch(authorize('provider', 'nurse'), updateChatStatus);

export default router; 