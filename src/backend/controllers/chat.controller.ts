
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { Chat, IChat } from '../models/chat.model';
import { ChatService } from '../services/chat.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class ChatController extends BaseController<IChat> {
  private chatService: ChatService;

  constructor() {
    super(Chat);
    this.chatService = new ChatService();
  }

  // Override create to handle initial message
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { initialMessage, type = 'symptom_assessment' } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      // Create chat with initial message
      const chatData = {
        patient: userId,
        type,
        status: 'active',
        messages: initialMessage ? [{
          role: 'user' as const,
          content: initialMessage,
          timestamp: new Date(),
        }] : [],
        lastMessageAt: new Date(),
      };

      const chat = await this.chatService.createChat(chatData);

      // If there's an initial message, add AI response
      if (initialMessage) {
        await this.chatService.addMessage(chat._id.toString(), {
          role: 'user',
          content: initialMessage,
          timestamp: new Date(),
        });
      }

      res.status(201).json({
        status: 'success',
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  // Add message to existing chat
  addMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const chatId = req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const message = {
        role: 'user' as const,
        content,
        timestamp: new Date(),
      };

      const updatedChat = await this.chatService.addMessage(chatId, message);

      res.json({
        status: 'success',
        data: updatedChat,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user's chat history
  getPatientHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const chats = await this.chatService.getPatientHistory(userId, req.query);
      
      res.json({
        status: 'success',
        results: chats.length,
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  };
}
