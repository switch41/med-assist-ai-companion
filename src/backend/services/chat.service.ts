import { Chat, IChat, IMessage } from '../models/chat.model';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// System prompt for medical assistant
const SYSTEM_PROMPT = `You are MediAssist, a HIPAA-compliant AI healthcare assistant. Your role is to:
1. Assess patient symptoms and concerns
2. Provide evidence-based medical information
3. Triage cases based on severity
4. Guide patients through self-care when appropriate
5. Escalate to human providers when necessary

Always:
- Maintain patient privacy and confidentiality
- Be clear about your limitations
- Recommend professional medical care for serious conditions
- Document all interactions for medical records
- Follow established medical protocols`;

export class ChatService {
  // Create a new chat
  async createChat(data: Partial<IChat>): Promise<IChat> {
    try {
      const chat = new Chat(data);
      await chat.save();
      logger.info('Chat created:', { chatId: chat._id });
      return chat;
    } catch (error) {
      logger.error('Error creating chat:', error);
      throw new AppError(500, 'Failed to create chat');
    }
  }

  // Get chat by ID
  async getChatById(id: string): Promise<IChat> {
    try {
      const chat = await Chat.findById(id);
      if (!chat) {
        throw new AppError(404, 'Chat not found');
      }
      return chat;
    } catch (error) {
      logger.error('Error getting chat:', error);
      throw error;
    }
  }

  // Update chat
  async updateChat(id: string, data: Partial<IChat>): Promise<IChat> {
    try {
      const chat = await Chat.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!chat) {
        throw new AppError(404, 'Chat not found');
      }
      return chat;
    } catch (error) {
      logger.error('Error updating chat:', error);
      throw error;
    }
  }

  // Delete chat
  async deleteChat(id: string): Promise<void> {
    try {
      const chat = await Chat.findByIdAndDelete(id);
      if (!chat) {
        throw new AppError(404, 'Chat not found');
      }
    } catch (error) {
      logger.error('Error deleting chat:', error);
      throw error;
    }
  }

  // Add message to chat
  async addMessage(chatId: string, message: IMessage): Promise<IChat> {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new AppError(404, 'Chat not found');
      }

      chat.messages.push(message);
      await chat.save();

      // If the message is from the user, generate an AI response
      if (message.role === 'user') {
        const aiResponse = await this.generateAIResponse(chat.messages);
        chat.messages.push(aiResponse);
        await chat.save();
      }

      return chat;
    } catch (error) {
      logger.error('Error adding message:', error);
      throw error;
    }
  }

  // Get chat history for a patient
  async getPatientHistory(patientId: string, filters: any = {}): Promise<IChat[]> {
    try {
      const query = { patient: patientId, ...filters };
      return await Chat.find(query)
        .sort({ lastMessageAt: -1 })
        .exec();
    } catch (error) {
      logger.error('Error getting patient history:', error);
      throw error;
    }
  }

  // Get chats by type
  async getChatsByType(type: string, filters: any = {}): Promise<IChat[]> {
    try {
      const query = { type, ...filters };
      return await Chat.find(query)
        .sort({ lastMessageAt: -1 })
        .exec();
    } catch (error) {
      logger.error('Error getting chats by type:', error);
      throw error;
    }
  }

  // Get chat analytics for a patient
  async getPatientAnalytics(patientId: string, startDate?: Date, endDate?: Date): Promise<any> {
    try {
      const match: any = { patient: patientId };
      if (startDate || endDate) {
        match.lastMessageAt = {};
        if (startDate) match.lastMessageAt.$gte = startDate;
        if (endDate) match.lastMessageAt.$lte = endDate;
      }

      const analytics = await Chat.aggregate([
        { $match: match },
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

      return analytics;
    } catch (error) {
      logger.error('Error getting patient analytics:', error);
      throw error;
    }
  }

  // Generate AI response
  private async generateAIResponse(messages: IMessage[]): Promise<IMessage> {
    try {
      const openaiMessages = messages
        .filter(msg => msg.role !== 'provider')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }));

      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...openaiMessages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message;
      
      // Parse response for medical metadata
      const metadata = this.extractMedicalMetadata(response.content);

      return {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata,
      };
    } catch (error) {
      logger.error('AI response generation failed:', error);
      throw new AppError(500, 'Failed to generate AI response');
    }
  }

  // Extract medical metadata from AI response
  private extractMedicalMetadata(content: string): any {
    const metadata: any = {};

    // Extract symptoms (simplified)
    const symptomMatches = content.match(/symptoms?:?\s*([^.]+)/i);
    if (symptomMatches) {
      metadata.symptoms = symptomMatches[1]
        .split(',')
        .map((s: string) => s.trim());
    }

    // Extract severity (simplified)
    if (content.toLowerCase().includes('emergency')) {
      metadata.triageLevel = 'emergency';
      metadata.severity = 9;
    } else if (content.toLowerCase().includes('urgent')) {
      metadata.triageLevel = 'urgent';
      metadata.severity = 7;
    } else {
      metadata.triageLevel = 'routine';
      metadata.severity = 3;
    }

    // Extract suggested actions
    const actionMatches = content.match(/recommended actions?:?\s*([^.]+)/i);
    if (actionMatches) {
      metadata.suggestedActions = actionMatches[1]
        .split(',')
        .map((a: string) => a.trim());
    }

    return metadata;
  }
} 