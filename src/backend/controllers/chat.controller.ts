import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { Chat, IChat, messageSchema, chatSchema } from '../models/chat.model';
import { z } from 'zod';

export class ChatController extends BaseController<IChat> {
  constructor() {
    super(Chat);
  }

  // Override create method to handle validation
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = chatSchema.parse(req.body);
      const chat = new Chat(validatedData);
      const savedChat = await chat.save();
      res.status(201).json(savedChat);
    } catch (error) {
      next(error);
    }
  };

  // Override update method to handle validation
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = chatSchema.partial().parse(req.body);
      const chat = await Chat.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
      );
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
      res.json(chat);
    } catch (error) {
      next(error);
    }
  };

  // Add message to chat
  addMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedMessage = messageSchema.parse(req.body);
      
      const chat = await Chat.findByIdAndUpdate(
        id,
        { 
          $push: { messages: validatedMessage },
          $set: { lastMessageAt: new Date() }
        },
        { new: true, runValidators: true }
      );

      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      res.json(chat);
    } catch (error) {
      next(error);
    }
  };

  // Get chat history
  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const { type, status, startDate, endDate } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: any = { patient: patientId };
      if (type) filter.type = type;
      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.lastMessageAt = {};
        if (startDate) filter.lastMessageAt.$gte = new Date(startDate as string);
        if (endDate) filter.lastMessageAt.$lte = new Date(endDate as string);
      }

      const [chats, total] = await Promise.all([
        Chat.find(filter)
          .sort({ lastMessageAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Chat.countDocuments(filter)
      ]);

      res.json({
        data: chats,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Get chat by type
  getByType = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const { patientId } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: any = { type };
      if (patientId) filter.patient = patientId;

      const [chats, total] = await Promise.all([
        Chat.find(filter)
          .sort({ lastMessageAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Chat.countDocuments(filter)
      ]);

      res.json({
        data: chats,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Get chat analytics
  getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;
      const { startDate, endDate } = req.query;

      const filter: any = { patient: patientId };
      if (startDate || endDate) {
        filter.lastMessageAt = {};
        if (startDate) filter.lastMessageAt.$gte = new Date(startDate as string);
        if (endDate) filter.lastMessageAt.$lte = new Date(endDate as string);
      }

      const analytics = await Chat.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              type: '$type',
              date: { $dateToString: { format: '%Y-%m-%d', date: '$lastMessageAt' } }
            },
            count: { $sum: 1 },
            messageCount: { $sum: { $size: '$messages' } },
            avgResponseTime: {
              $avg: {
                $subtract: [
                  { $arrayElemAt: ['$messages.timestamp', -1] },
                  { $arrayElemAt: ['$messages.timestamp', 0] }
                ]
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id.type',
            dailyStats: {
              $push: {
                date: '$_id.date',
                count: '$count',
                messageCount: '$messageCount',
                avgResponseTime: '$avgResponseTime'
              }
            },
            totalChats: { $sum: '$count' },
            totalMessages: { $sum: '$messageCount' },
            avgResponseTime: { $avg: '$avgResponseTime' }
          }
        }
      ]);

      res.json(analytics);
    } catch (error) {
      next(error);
    }
  };
} 