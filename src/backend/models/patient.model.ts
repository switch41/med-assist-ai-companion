import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IPatient extends Document {
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
  maritalStatus?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
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
  managingOrganization?: {
    reference: string;
    display?: string;
  };
  password: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastLogin?: Date;
  medicalRecords?: mongoose.Types.ObjectId[];
  appointments?: mongoose.Types.ObjectId[];
  medications?: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const PatientSchema = new Schema<IPatient>({
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
  maritalStatus: {
    coding: [{
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    }]
  },
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
  managingOrganization: {
    reference: String,
    display: String
  },
  password: { type: String, required: true },
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: String,
  lastLogin: Date,
  medicalRecords: [{ type: Schema.Types.ObjectId, ref: 'MedicalRecord' }],
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  medications: [{ type: Schema.Types.ObjectId, ref: 'Medication' }]
}, {
  timestamps: true
});

// Hash password before saving
PatientSchema.pre('save', async function(next) {
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
PatientSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema);
