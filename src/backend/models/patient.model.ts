import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const patientSchema = z.object({
  identifier: z.array(z.object({
    system: z.string(),
    value: z.string(),
  })),
  active: z.boolean().default(true),
  name: z.array(z.object({
    use: z.string(),
    family: z.string(),
    given: z.array(z.string()),
  })),
  telecom: z.array(z.object({
    system: z.enum(['phone', 'email', 'fax']),
    value: z.string(),
    use: z.string().optional(),
  })),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  birthDate: z.string(),
  address: z.array(z.object({
    use: z.string(),
    type: z.string(),
    text: z.string(),
    line: z.array(z.string()),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  })),
  maritalStatus: z.object({
    coding: z.array(z.object({
      system: z.string(),
      code: z.string(),
      display: z.string(),
    })),
  }),
  communication: z.array(z.object({
    language: z.object({
      coding: z.array(z.object({
        system: z.string(),
        code: z.string(),
        display: z.string(),
      })),
    }),
    preferred: z.boolean(),
  })),
  managingOrganization: z.object({
    reference: z.string(),
    display: z.string(),
  }),
});

// Mongoose schema
const patientMongooseSchema = new Schema({
  identifier: [{
    system: String,
    value: String,
  }],
  active: {
    type: Boolean,
    default: true,
  },
  name: [{
    use: String,
    family: String,
    given: [String],
  }],
  telecom: [{
    system: {
      type: String,
      enum: ['phone', 'email', 'fax'],
    },
    value: String,
    use: String,
  }],
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'unknown'],
  },
  birthDate: String,
  address: [{
    use: String,
    type: String,
    text: String,
    line: [String],
    city: String,
    state: String,
    postalCode: String,
    country: String,
  }],
  maritalStatus: {
    coding: [{
      system: String,
      code: String,
      display: String,
    }],
  },
  communication: [{
    language: {
      coding: [{
        system: String,
        code: String,
        display: String,
      }],
    },
    preferred: Boolean,
  }],
  managingOrganization: {
    reference: String,
    display: String,
  },
}, {
  timestamps: true,
});

// Add indexes
patientMongooseSchema.index({ 'identifier.value': 1 });
patientMongooseSchema.index({ 'name.family': 1, 'name.given': 1 });
patientMongooseSchema.index({ birthDate: 1 });

// TypeScript interface
export interface IPatient extends Document {
  identifier: Array<{
    system: string;
    value: string;
  }>;
  active: boolean;
  name: Array<{
    use: string;
    family: string;
    given: string[];
  }>;
  telecom: Array<{
    system: 'phone' | 'email' | 'fax';
    value: string;
    use?: string;
  }>;
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
  address: Array<{
    use: string;
    type: string;
    text: string;
    line: string[];
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  maritalStatus: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  communication: Array<{
    language: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
    preferred: boolean;
  }>;
  managingOrganization: {
    reference: string;
    display: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const Patient = mongoose.model<IPatient>('Patient', patientMongooseSchema); 