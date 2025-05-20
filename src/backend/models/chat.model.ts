import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date().default(() => new Date()),
  metadata: z.object({
    symptoms: z.array(z.string()).optional(),
    severity: z.number().min(0).max(10).optional(),
    triageLevel: z.enum(['emergency', 'urgent', 'routine']).optional(),
    suggestedActions: z.array(z.string()).optional(),
  }).optional(),
});

export const chatSchema = z.object({
  patientId: z.string(),
  messages: z.array(messageSchema),
  status: z.enum(['active', 'resolved', 'escalated']).default('active'),
  lastUpdated: z.date().default(() => new Date()),
  metadata: z.object({
    initialComplaint: z.string(),
    finalDiagnosis: z.string().optional(),
    providerNotes: z.string().optional(),
    followUpRequired: z.boolean().default(false),
    followUpDate: z.date().optional(),
  }),
});

// Mongoose schema
const messageMongooseSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
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
    symptoms: [String],
    severity: {
      type: Number,
      min: 0,
      max: 10,
    },
    triageLevel: {
      type: String,
      enum: ['emergency', 'urgent', 'routine'],
    },
    suggestedActions: [String],
  },
});

const chatMongooseSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  messages: [messageMongooseSchema],
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated'],
    default: 'active',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    initialComplaint: {
      type: String,
      required: true,
    },
    finalDiagnosis: String,
    providerNotes: String,
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
  },
}, {
  timestamps: true,
});

// Add indexes
chatMongooseSchema.index({ patientId: 1, lastUpdated: -1 });
chatMongooseSchema.index({ status: 1 });

// TypeScript interfaces
export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    symptoms?: string[];
    severity?: number;
    triageLevel?: 'emergency' | 'urgent' | 'routine';
    suggestedActions?: string[];
  };
}

export interface IChat extends Document {
  patientId: mongoose.Types.ObjectId;
  messages: IMessage[];
  status: 'active' | 'resolved' | 'escalated';
  lastUpdated: Date;
  metadata: {
    initialComplaint: string;
    finalDiagnosis?: string;
    providerNotes?: string;
    followUpRequired: boolean;
    followUpDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const Chat = mongoose.model<IChat>('Chat', chatMongooseSchema); 