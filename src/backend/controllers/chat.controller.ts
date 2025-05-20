import { Request, Response, NextFunction } from 'express';
import { Chat, messageSchema, chatSchema } from '../models/chat.model';
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

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId, initialMessage } = req.body;
    
    const validatedData = chatSchema.parse({
      patientId,
      messages: [{
        role: 'user',
        content: initialMessage,
      }],
      metadata: {
        initialComplaint: initialMessage,
      },
    });

    const chat = await Chat.create(validatedData);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(chat.messages);
    
    // Add AI response to chat
    chat.messages.push(aiResponse);
    await chat.save();

    logger.info('Chat created:', { chatId: chat._id });
    res.status(201).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

export const getChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      throw new AppError(404, 'Chat not found');
    }

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

export const addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      throw new AppError(404, 'Chat not found');
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    chat.messages.push(userMessage);

    // Generate AI response
    const aiResponse = await generateAIResponse(chat.messages);
    chat.messages.push(aiResponse);

    // Update chat status if necessary
    if (aiResponse.metadata?.triageLevel === 'emergency') {
      chat.status = 'escalated';
    }

    await chat.save();

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

export const updateChatStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, providerNotes } = req.body;
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      throw new AppError(404, 'Chat not found');
    }

    chat.status = status;
    if (providerNotes) {
      chat.metadata.providerNotes = providerNotes;
    }

    await chat.save();

    res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

async function generateAIResponse(messages: any[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message;
    
    // Parse response for medical metadata
    const metadata = extractMedicalMetadata(response.content);

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

function extractMedicalMetadata(content: string) {
  // This is a simplified example. In production, you would want to use
  // more sophisticated NLP techniques to extract medical information
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