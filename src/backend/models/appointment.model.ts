import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  status: 'scheduled' | 'confirmed' | 'arrived' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'initial' | 'follow-up' | 'emergency' | 'routine' | 'specialist';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  reason: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    text?: string;
  };
  priority: 'routine' | 'urgent' | 'asap' | 'stat';
  location: {
    reference: string;
    display?: string;
  };
  slot: {
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
  };
  participants: {
    actor: {
      reference: string;
      display?: string;
    };
    status: 'accepted' | 'declined' | 'tentative' | 'needs-action';
    required: boolean;
    type: 'patient' | 'provider' | 'location' | 'device';
  }[];
  reminder: {
    enabled: boolean;
    method: 'email' | 'sms' | 'push' | 'all';
    timeBeforeAppointment: number; // in minutes
    lastSent?: Date;
    status: 'pending' | 'sent' | 'failed';
  };
  notes?: string;
  cancellationReason?: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    text?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'arrived', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
    required: true
  },
  type: {
    type: String,
    enum: ['initial', 'follow-up', 'emergency', 'routine', 'specialist'],
    required: true
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  reason: {
    code: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    text: String
  },
  priority: {
    type: String,
    enum: ['routine', 'urgent', 'asap', 'stat'],
    default: 'routine'
  },
  location: {
    reference: { type: String, required: true },
    display: String
  },
  slot: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 }
  },
  participants: [{
    actor: {
      reference: { type: String, required: true },
      display: String
    },
    status: {
      type: String,
      enum: ['accepted', 'declined', 'tentative', 'needs-action'],
      default: 'needs-action'
    },
    required: { type: Boolean, default: true },
    type: {
      type: String,
      enum: ['patient', 'provider', 'location', 'device'],
      required: true
    }
  }],
  reminder: {
    enabled: { type: Boolean, default: true },
    method: {
      type: String,
      enum: ['email', 'sms', 'push', 'all'],
      default: 'all'
    },
    timeBeforeAppointment: { type: Number, default: 60 }, // 60 minutes by default
    lastSent: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    }
  },
  notes: String,
  cancellationReason: {
    code: {
      system: String,
      code: String,
      display: String
    },
    text: String
  }
}, {
  timestamps: true
});

// Add indexes for common queries
AppointmentSchema.index({ patient: 1 });
AppointmentSchema.index({ provider: 1 });
AppointmentSchema.index({ startTime: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ type: 1 });
AppointmentSchema.index({ 'slot.dayOfWeek': 1, 'slot.startTime': 1 });

// Validate endTime is after startTime
AppointmentSchema.pre('save', function(next) {
  if (this.startTime >= this.endTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Calculate duration before saving
AppointmentSchema.pre('save', function(next) {
  if (this.isModified('startTime') || this.isModified('endTime')) {
    this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  }
  next();
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema); 