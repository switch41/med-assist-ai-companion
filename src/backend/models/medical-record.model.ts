import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId;
  conditions: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    onsetDate: Date;
    severity?: string;
    status: 'active' | 'inactive' | 'resolved';
    notes?: string;
  }[];
  medications: {
    medication: {
      code: {
        system: string;
        code: string;
        display: string;
      };
      manufacturer?: string;
      form?: string;
      strength?: string;
    };
    status: 'active' | 'discontinued' | 'completed';
    startDate: Date;
    endDate?: Date;
    dosage: {
      text: string;
      timing: {
        frequency: number;
        period: number;
        periodUnit: string;
      };
      route?: string;
      method?: string;
    };
    reason?: string;
    notes?: string;
  }[];
  allergies: {
    substance: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    type: 'allergy' | 'intolerance';
    category?: string[];
    criticality?: 'low' | 'high' | 'unable-to-assess';
    onsetDate?: Date;
    reaction?: {
      manifestation: {
        code: {
          system: string;
          code: string;
          display: string;
        };
      };
      severity: 'mild' | 'moderate' | 'severe';
    }[];
    notes?: string;
  }[];
  vitals: {
    type: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    value: number;
    unit: string;
    date: Date;
    source: 'device' | 'manual' | 'system';
    notes?: string;
  }[];
  immunizations: {
    vaccine: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    date: Date;
    lotNumber?: string;
    manufacturer?: string;
    expirationDate?: Date;
    site?: string;
    route?: string;
    doseQuantity?: {
      value: number;
      unit: string;
    };
    notes?: string;
  }[];
  labResults: {
    test: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    date: Date;
    value: {
      value: number;
      unit: string;
      referenceRange?: {
        low?: number;
        high?: number;
        text?: string;
      };
    };
    status: 'preliminary' | 'final' | 'amended' | 'corrected';
    notes?: string;
  }[];
  procedures: {
    code: {
      system: string;
      code: string;
      display: string;
    };
    date: Date;
    status: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed' | 'entered-in-error' | 'unknown';
    performer?: {
      reference: string;
      display?: string;
    };
    notes?: string;
  }[];
  familyHistory: {
    relationship: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    condition: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    onsetAge?: {
      value: number;
      unit: string;
    };
    notes?: string;
  }[];
  socialHistory: {
    category: 'tobacco' | 'alcohol' | 'drug' | 'exercise' | 'diet' | 'other';
    value: {
      code: {
        system: string;
        code: string;
        display: string;
      };
    };
    startDate?: Date;
    endDate?: Date;
    notes?: string;
  }[];
}

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  conditions: [{
    code: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    onsetDate: { type: Date, required: true },
    severity: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'resolved'],
      required: true
    },
    notes: String
  }],
  medications: [{
    medication: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      },
      manufacturer: String,
      form: String,
      strength: String
    },
    status: {
      type: String,
      enum: ['active', 'discontinued', 'completed'],
      required: true
    },
    startDate: { type: Date, required: true },
    endDate: Date,
    dosage: {
      text: { type: String, required: true },
      timing: {
        frequency: { type: Number, required: true },
        period: { type: Number, required: true },
        periodUnit: { type: String, required: true }
      },
      route: String,
      method: String
    },
    reason: String,
    notes: String
  }],
  allergies: [{
    substance: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    type: {
      type: String,
      enum: ['allergy', 'intolerance'],
      required: true
    },
    category: [String],
    criticality: {
      type: String,
      enum: ['low', 'high', 'unable-to-assess']
    },
    onsetDate: Date,
    reaction: [{
      manifestation: {
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
      }
    }],
    notes: String
  }],
  vitals: [{
    type: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: Date, required: true },
    source: {
      type: String,
      enum: ['device', 'manual', 'system'],
      required: true
    },
    notes: String
  }],
  immunizations: [{
    vaccine: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    date: { type: Date, required: true },
    lotNumber: String,
    manufacturer: String,
    expirationDate: Date,
    site: String,
    route: String,
    doseQuantity: {
      value: Number,
      unit: String
    },
    notes: String
  }],
  labResults: [{
    test: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    date: { type: Date, required: true },
    value: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
      referenceRange: {
        low: Number,
        high: Number,
        text: String
      }
    },
    status: {
      type: String,
      enum: ['preliminary', 'final', 'amended', 'corrected'],
      required: true
    },
    notes: String
  }],
  procedures: [{
    code: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['preparation', 'in-progress', 'not-done', 'on-hold', 'stopped', 'completed', 'entered-in-error', 'unknown'],
      required: true
    },
    performer: {
      reference: String,
      display: String
    },
    notes: String
  }],
  familyHistory: [{
    relationship: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    condition: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    onsetAge: {
      value: Number,
      unit: String
    },
    notes: String
  }],
  socialHistory: [{
    category: {
      type: String,
      enum: ['tobacco', 'alcohol', 'drug', 'exercise', 'diet', 'other'],
      required: true
    },
    value: {
      code: {
        system: { type: String, required: true },
        code: { type: String, required: true },
        display: { type: String, required: true }
      }
    },
    startDate: Date,
    endDate: Date,
    notes: String
  }]
}, {
  timestamps: true
});

// Add indexes for common queries
MedicalRecordSchema.index({ patient: 1 });
MedicalRecordSchema.index({ 'conditions.code.code': 1 });
MedicalRecordSchema.index({ 'medications.medication.code.code': 1 });
MedicalRecordSchema.index({ 'allergies.substance.code.code': 1 });
MedicalRecordSchema.index({ 'vitals.date': 1 });
MedicalRecordSchema.index({ 'labResults.date': 1 });

export const MedicalRecord = mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema); 