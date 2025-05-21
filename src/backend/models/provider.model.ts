import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IProvider extends Document {
  identifier: {
    system: string;
    value: string;
  }[];
  active: boolean;
  name: {
    use: string;
    family: string;
    given: string[];
    prefix?: string[];
    suffix?: string[];
  }[];
  telecom: {
    system: string;
    value: string;
    use?: string;
  }[];
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: Date;
  address: {
    use?: string;
    type?: string;
    text?: string;
    line?: string[];
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }[];
  qualification: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    period: {
      start: Date;
      end?: Date;
    };
    issuer: {
      reference: string;
      display?: string;
    };
  }[];
  specialty: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    primary: boolean;
  }[];
  communication: {
    language: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
    preferred: boolean;
  }[];
  availability: {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    availableStartTime: string; // HH:mm format
    availableEndTime: string; // HH:mm format
    slotDuration: number; // in minutes
    breakStartTime?: string; // HH:mm format
    breakEndTime?: string; // HH:mm format
  }[];
  organization: {
    reference: string;
    display?: string;
  };
  role: 'doctor' | 'nurse' | 'specialist' | 'therapist' | 'pharmacist';
  status: 'active' | 'inactive' | 'on_leave';
  password: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ProviderSchema = new Schema<IProvider>({
  identifier: [{
    system: { type: String, required: true },
    value: { type: String, required: true }
  }],
  active: { type: Boolean, default: true },
  name: [{
    use: { type: String, required: true },
    family: { type: String, required: true },
    given: [{ type: String, required: true }],
    prefix: [String],
    suffix: [String]
  }],
  telecom: [{
    system: { type: String, required: true },
    value: { type: String, required: true },
    use: String
  }],
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'unknown'],
    required: true
  },
  birthDate: { type: Date, required: true },
  address: [{
    use: String,
    type: String,
    text: String,
    line: [String],
    city: String,
    district: String,
    state: String,
    postalCode: String,
    country: String
  }],
  qualification: [{
    code: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    period: {
      start: { type: Date, required: true },
      end: Date
    },
    issuer: {
      reference: { type: String, required: true },
      display: String
    }
  }],
  specialty: [{
    code: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    primary: { type: Boolean, default: false }
  }],
  communication: [{
    language: {
      coding: [{
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }]
    },
    preferred: { type: Boolean, default: false }
  }],
  availability: [{
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    availableStartTime: { type: String, required: true },
    availableEndTime: { type: String, required: true },
    slotDuration: { type: Number, required: true, default: 30 },
    breakStartTime: String,
    breakEndTime: String
  }],
  organization: {
    reference: { type: String, required: true },
    display: String
  },
  role: {
    type: String,
    enum: ['doctor', 'nurse', 'specialist', 'therapist', 'pharmacist'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  password: { type: String, required: true },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: String,
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
ProviderSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
ProviderSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add indexes for common queries
ProviderSchema.index({ 'identifier.value': 1 });
ProviderSchema.index({ 'name.family': 1, 'name.given': 1 });
ProviderSchema.index({ 'specialty.code.code': 1 });
ProviderSchema.index({ role: 1 });
ProviderSchema.index({ status: 1 });

export const Provider = mongoose.model<IProvider>('Provider', ProviderSchema); 