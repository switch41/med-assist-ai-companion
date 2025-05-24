
import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system' | 'provider';
  content: string;
  timestamp: Date;
  metadata?: {
    symptoms?: string[];
    severity?: number;
    triageLevel?: 'emergency' | 'urgent' | 'routine';
    suggestedActions?: string[];
    confidence?: number;
    medicalCodes?: {
      system: string;
      code: string;
      display: string;
    }[];
  };
}

export interface IChat extends Document {
  patient: mongoose.Types.ObjectId;
  provider?: mongoose.Types.ObjectId;
  type: 'symptom_assessment' | 'medication_query' | 'general_health' | 'emergency_triage' | 'follow_up';
  status: 'active' | 'completed' | 'escalated' | 'archived';
  messages: IMessage[];
  lastMessageAt: Date;
  escalatedAt?: Date;
  escalationReason?: string;
  summary?: string;
  diagnosis?: {
    primary?: string;
    secondary?: string[];
    confidence: number;
  };
  triageLevel?: 'emergency' | 'urgent' | 'routine';
  followUpRequired?: boolean;
  followUpDate?: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system', 'provider'],
    required: true
  },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  metadata: {
    symptoms: [String],
    severity: { type: Number, min: 1, max: 10 },
    triageLevel: {
      type: String,
      enum: ['emergency', 'urgent', 'routine']
    },
    suggestedActions: [String],
    confidence: { type: Number, min: 0, max: 1 },
    medicalCodes: [{
      system: String,
      code: String,
      display: String
    }]
  }
});

const ChatSchema = new Schema<IChat>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
  type: {
    type: String,
    enum: ['symptom_assessment', 'medication_query', 'general_health', 'emergency_triage', 'follow_up'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'escalated', 'archived'],
    default: 'active'
  },
  messages: [MessageSchema],
  lastMessageAt: { type: Date, required: true, default: Date.now },
  escalatedAt: Date,
  escalationReason: String,
  summary: String,
  diagnosis: {
    primary: String,
    secondary: [String],
    confidence: { type: Number, min: 0, max: 1 }
  },
  triageLevel: {
    type: String,
    enum: ['emergency', 'urgent', 'routine']
  },
  followUpRequired: { type: Boolean, default: false },
  followUpDate: Date
}, {
  timestamps: true
});

// Add indexes for performance
ChatSchema.index({ patient: 1, lastMessageAt: -1 });
ChatSchema.index({ type: 1, status: 1 });
ChatSchema.index({ triageLevel: 1, status: 1 });

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
