import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system', 'provider']),
  content: z.string(),
  timestamp: z.date().default(() => new Date()),
  metadata: z.object({
    intent: z.string().optional(),
    confidence: z.number().optional(),
    entities: z.array(z.object({
      type: z.string(),
      value: z.string(),
      confidence: z.number()
    })).optional(),
    suggestedActions: z.array(z.object({
      type: z.string(),
      value: z.string(),
      confidence: z.number()
    })).optional()
  }).optional(),
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string(),
    name: z.string(),
    size: z.number(),
    mimeType: z.string()
  })).optional()
});

export const chatSchema = z.object({
  patient: z.string(),
  status: z.enum(['active', 'closed', 'transferred']).default('active'),
  type: z.enum(['symptom_assessment', 'medication_management', 'general_inquiry', 'emergency']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']).default('low'),
  assignedProvider: z.string().optional(),
  messages: z.array(messageSchema),
  context: z.object({
    symptoms: z.array(z.object({
      code: z.object({
        system: z.string(),
        code: z.string(),
        display: z.string()
      }),
      severity: z.enum(['mild', 'moderate', 'severe']),
      onset: z.date(),
      status: z.enum(['active', 'resolved'])
    })).optional(),
    medications: z.array(z.object({
      code: z.object({
        system: z.string(),
        code: z.string(),
        display: z.string()
      }),
      status: z.enum(['active', 'discontinued'])
    })).optional(),
    vitals: z.array(z.object({
      type: z.object({
        system: z.string(),
        code: z.string(),
        display: z.string()
      }),
      value: z.number(),
      unit: z.string(),
      timestamp: z.date()
    })).optional(),
    triageLevel: z.enum(['1', '2', '3', '4', '5']).optional(),
    suggestedActions: z.array(z.object({
      type: z.string(),
      description: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
      status: z.enum(['pending', 'completed', 'cancelled'])
    })).optional()
  }).optional(),
  summary: z.object({
    mainComplaint: z.string(),
    assessment: z.string(),
    recommendations: z.array(z.string()),
    followUpRequired: z.boolean(),
    followUpDate: z.date().optional()
  }).optional()
});

// Mongoose schema
const messageMongooseSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system', 'provider'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    intent: String,
    confidence: Number,
    entities: [{
      type: String,
      value: String,
      confidence: Number
    }],
    suggestedActions: [{
      type: String,
      value: String,
      confidence: Number
    }]
  },
  attachments: [{
    type: String,
    url: String,
    name: String,
    size: Number,
    mimeType: String
  }]
});

const ChatSchema = new Schema<IChat>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  status: {
    type: String,
    enum: ['active', 'closed', 'transferred'],
    default: 'active',
    required: true
  },
  type: {
    type: String,
    enum: ['symptom_assessment', 'medication_management', 'general_inquiry', 'emergency'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'low',
    required: true
  },
  assignedProvider: { type: Schema.Types.ObjectId, ref: 'Provider' },
  messages: [messageMongooseSchema],
  context: {
    symptoms: [{
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      },
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        required: true
      },
      onset: { type: Date, required: true },
      status: {
        type: String,
        enum: ['active', 'resolved'],
        required: true
      }
    }],
    medications: [{
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      },
      status: {
        type: String,
        enum: ['active', 'discontinued'],
        required: true
      }
    }],
    vitals: [{
      type: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      },
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      timestamp: { type: Date, required: true }
    }],
    triageLevel: {
      type: String,
      enum: ['1', '2', '3', '4', '5']
    },
    suggestedActions: [{
      type: { type: String, required: true },
      description: { type: String, required: true },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        required: true
      }
    }]
  },
  summary: {
    mainComplaint: { type: String, required: true },
    assessment: { type: String, required: true },
    recommendations: [{ type: String, required: true }],
    followUpRequired: { type: Boolean, required: true },
    followUpDate: Date
  },
  lastMessageAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add indexes
ChatSchema.index({ patient: 1, lastMessageAt: -1 });
ChatSchema.index({ status: 1 });
ChatSchema.index({ type: 1 });
ChatSchema.index({ priority: 1 });
ChatSchema.index({ assignedProvider: 1 });

// TypeScript interfaces
export interface IMessage {
  role: 'user' | 'assistant' | 'system' | 'provider';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: {
      type: string;
      value: string;
      confidence: number;
    }[];
    suggestedActions?: {
      type: string;
      value: string;
      confidence: number;
    }[];
  };
  attachments?: {
    type: string;
    url: string;
    name: string;
    size: number;
    mimeType: string;
  }[];
}

export interface IChat extends Document {
  patient: mongoose.Types.ObjectId;
  status: 'active' | 'closed' | 'transferred';
  type: 'symptom_assessment' | 'medication_management' | 'general_inquiry' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  assignedProvider?: mongoose.Types.ObjectId;
  messages: IMessage[];
  context: {
    symptoms?: {
      code: {
        system: string;
        code: string;
        display: string;
      };
      severity: 'mild' | 'moderate' | 'severe';
      onset: Date;
      status: 'active' | 'resolved';
    }[];
    medications?: {
      code: {
        system: string;
        code: string;
        display: string;
      };
      status: 'active' | 'discontinued';
    }[];
    vitals?: {
      type: {
        system: string;
        code: string;
        display: string;
      };
      value: number;
      unit: string;
      timestamp: Date;
    }[];
    triageLevel?: '1' | '2' | '3' | '4' | '5';
    suggestedActions?: {
      type: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      status: 'pending' | 'completed' | 'cancelled';
    }[];
  };
  summary?: {
    mainComplaint: string;
    assessment: string;
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}

// Update lastMessageAt before saving
ChatSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema); 