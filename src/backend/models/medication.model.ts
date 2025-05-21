import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication extends Document {
  patient: mongoose.Types.ObjectId;
  prescriber: mongoose.Types.ObjectId;
  medication: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    manufacturer?: string;
    form?: string;
    strength?: string;
    batch?: string;
    expirationDate?: Date;
  };
  status: 'active' | 'discontinued' | 'completed' | 'on-hold';
  prescription: {
    identifier: string;
    dateWritten: Date;
    validityPeriod?: {
      start: Date;
      end: Date;
    };
    numberOfRepeats?: number;
    repeatsRemaining?: number;
    notes?: string;
  };
  dosage: {
    text: string;
    timing: {
      frequency: number;
      period: number;
      periodUnit: string;
      timeOfDay?: string[];
      dayOfWeek?: number[];
      asNeeded?: boolean;
      asNeededCondition?: string;
    };
    route?: string;
    method?: string;
    maxDosePerPeriod?: {
      numerator: {
        value: number;
        unit: string;
      };
      denominator: {
        value: number;
        unit: string;
      };
    };
  };
  dispense: {
    quantity: {
      value: number;
      unit: string;
    };
    expectedSupplyDuration?: {
      value: number;
      unit: string;
    };
    validityPeriod?: {
      start: Date;
      end: Date;
    };
    numberOfRepeats?: number;
    repeatsRemaining?: number;
  };
  reason?: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    text?: string;
  };
  sideEffects?: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    severity: 'mild' | 'moderate' | 'severe';
    onsetDate: Date;
    status: 'active' | 'resolved';
    notes?: string;
  }[];
  interactions?: {
    medication: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    management?: string;
  }[];
  adherence: {
    status: 'compliant' | 'partial' | 'non-compliant';
    lastTaken?: Date;
    nextDue?: Date;
    history: {
      date: Date;
      status: 'taken' | 'missed' | 'skipped';
      notes?: string;
    }[];
  };
  reminders: {
    enabled: boolean;
    method: 'email' | 'sms' | 'push' | 'all';
    timeBeforeDose: number; // in minutes
    lastSent?: Date;
    status: 'pending' | 'sent' | 'failed';
  };
  pharmacy?: {
    reference: string;
    display?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema<IMedication>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  prescriber: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  medication: {
    code: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    manufacturer: String,
    form: String,
    strength: String,
    batch: String,
    expirationDate: Date
  },
  status: {
    type: String,
    enum: ['active', 'discontinued', 'completed', 'on-hold'],
    default: 'active',
    required: true
  },
  prescription: {
    identifier: { type: String, required: true },
    dateWritten: { type: Date, required: true },
    validityPeriod: {
      start: Date,
      end: Date
    },
    numberOfRepeats: Number,
    repeatsRemaining: Number,
    notes: String
  },
  dosage: {
    text: { type: String, required: true },
    timing: {
      frequency: { type: Number, required: true },
      period: { type: Number, required: true },
      periodUnit: { type: String, required: true },
      timeOfDay: [String],
      dayOfWeek: [Number],
      asNeeded: Boolean,
      asNeededCondition: String
    },
    route: String,
    method: String,
    maxDosePerPeriod: {
      numerator: {
        value: Number,
        unit: String
      },
      denominator: {
        value: Number,
        unit: String
      }
    }
  },
  dispense: {
    quantity: {
      value: { type: Number, required: true },
      unit: { type: String, required: true }
    },
    expectedSupplyDuration: {
      value: Number,
      unit: String
    },
    validityPeriod: {
      start: Date,
      end: Date
    },
    numberOfRepeats: Number,
    repeatsRemaining: Number
  },
  reason: {
    code: {
      system: String,
      code: String,
      display: String
    },
    text: String
  },
  sideEffects: [{
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
    onsetDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active'
    },
    notes: String
  }],
  interactions: [{
    medication: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      required: true
    },
    description: { type: String, required: true },
    management: String
  }],
  adherence: {
    status: {
      type: String,
      enum: ['compliant', 'partial', 'non-compliant'],
      default: 'compliant'
    },
    lastTaken: Date,
    nextDue: Date,
    history: [{
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ['taken', 'missed', 'skipped'],
        required: true
      },
      notes: String
    }]
  },
  reminders: {
    enabled: { type: Boolean, default: true },
    method: {
      type: String,
      enum: ['email', 'sms', 'push', 'all'],
      default: 'all'
    },
    timeBeforeDose: { type: Number, default: 30 }, // 30 minutes by default
    lastSent: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending'
    }
  },
  pharmacy: {
    reference: String,
    display: String
  },
  notes: String
}, {
  timestamps: true
});

// Add indexes for common queries
MedicationSchema.index({ patient: 1 });
MedicationSchema.index({ prescriber: 1 });
MedicationSchema.index({ 'medication.code.code': 1 });
MedicationSchema.index({ status: 1 });
MedicationSchema.index({ 'adherence.nextDue': 1 });

// Calculate next due date based on last taken and dosage timing
MedicationSchema.pre('save', function(next) {
  if (this.isModified('adherence.lastTaken') && this.adherence.lastTaken) {
    const lastTaken = new Date(this.adherence.lastTaken);
    const { frequency, period, periodUnit } = this.dosage.timing;
    
    let nextDue = new Date(lastTaken);
    switch (periodUnit) {
      case 'h':
        nextDue.setHours(nextDue.getHours() + (period / frequency));
        break;
      case 'd':
        nextDue.setDate(nextDue.getDate() + (period / frequency));
        break;
      case 'wk':
        nextDue.setDate(nextDue.getDate() + (period * 7 / frequency));
        break;
      case 'mo':
        nextDue.setMonth(nextDue.getMonth() + (period / frequency));
        break;
    }
    
    this.adherence.nextDue = nextDue;
  }
  next();
});

export const Medication = mongoose.model<IMedication>('Medication', MedicationSchema); 