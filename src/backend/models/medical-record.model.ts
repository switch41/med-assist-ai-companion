
import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId;
  type: 'encounter' | 'condition' | 'procedure' | 'observation' | 'immunization' | 'allergy';
  status: 'active' | 'inactive' | 'resolved' | 'error';
  category: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
  code: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  subject: {
    reference: string;
    display?: string;
  };
  encounter?: {
    reference: string;
    display?: string;
  };
  effectiveDateTime: Date;
  issued: Date;
  performer?: {
    reference: string;
    display?: string;
  }[];
  valueQuantity?: {
    value: number;
    unit: string;
    system?: string;
    code?: string;
  };
  valueCodeableConcept?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  valueString?: string;
  valueBoolean?: boolean;
  valueDateTime?: Date;
  interpretation?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
  note?: {
    text: string;
    time?: Date;
    author?: {
      reference: string;
      display?: string;
    };
  }[];
  related?: {
    type: string;
    target: {
      reference: string;
      display?: string;
    };
  }[];
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: {
    type: String,
    enum: ['encounter', 'condition', 'procedure', 'observation', 'immunization', 'allergy'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'resolved', 'error'],
    required: true
  },
  category: [{
    coding: [{
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    }]
  }],
  code: {
    coding: [{
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    }]
  },
  subject: {
    reference: { type: String, required: true },
    display: String
  },
  encounter: {
    reference: String,
    display: String
  },
  effectiveDateTime: { type: Date, required: true },
  issued: { type: Date, required: true },
  performer: [{
    reference: String,
    display: String
  }],
  valueQuantity: {
    value: Number,
    unit: String,
    system: String,
    code: String
  },
  valueCodeableConcept: {
    coding: [{
      system: String,
      code: String,
      display: String
    }]
  },
  valueString: String,
  valueBoolean: Boolean,
  valueDateTime: Date,
  interpretation: [{
    coding: [{
      system: String,
      code: String,
      display: String
    }]
  }],
  note: [{
    text: String,
    time: Date,
    author: {
      reference: String,
      display: String
    }
  }],
  related: [{
    type: { type: String, required: true },
    target: {
      reference: { type: String, required: true },
      display: String
    }
  }]
}, {
  timestamps: true
});

// Add indexes for common queries
MedicalRecordSchema.index({ patient: 1 });
MedicalRecordSchema.index({ type: 1 });
MedicalRecordSchema.index({ status: 1 });
MedicalRecordSchema.index({ effectiveDateTime: 1 });

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
