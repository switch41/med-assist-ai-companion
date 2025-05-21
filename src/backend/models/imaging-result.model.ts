import mongoose, { Document, Schema } from 'mongoose';

export interface IImagingResult extends Document {
  patient: mongoose.Types.ObjectId;
  order: {
    id: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'failed';
    priority: 'routine' | 'urgent' | 'stat';
    requestedBy: mongoose.Types.ObjectId;
    requestedDate: Date;
    notes?: string;
  };
  study: {
    uid: string;
    type: {
      system: string;
      code: string;
      display: string;
    };
    modality: 'CT' | 'MRI' | 'X-RAY' | 'ULTRASOUND' | 'PET' | 'SPECT' | 'OTHER';
    bodySite: {
      system: string;
      code: string;
      display: string;
    };
    description: string;
    performedDate: Date;
    performedBy: {
      id: mongoose.Types.ObjectId;
      name: string;
      role: string;
    };
    status: 'preliminary' | 'final' | 'amended' | 'cancelled';
    protocol?: string;
    contrast?: {
      type: string;
      amount: number;
      unit: string;
      route: string;
    };
  };
  series: {
    uid: string;
    number: number;
    description: string;
    modality: string;
    bodySite?: {
      system: string;
      code: string;
      display: string;
    };
    images: {
      uid: string;
      number: number;
      type: string;
      url: string;
      format: string;
      size: number;
      hash: string;
      width: number;
      height: number;
      windowCenter?: number;
      windowWidth?: number;
      uploadedAt: Date;
    }[];
  }[];
  report: {
    status: 'draft' | 'preliminary' | 'final' | 'amended' | 'cancelled';
    author: {
      id: mongoose.Types.ObjectId;
      name: string;
      role: string;
    };
    date: Date;
    findings: string;
    impression: string;
    recommendations?: string[];
    comparison?: {
      studyUid: string;
      date: Date;
      findings: string;
    }[];
    attachments?: {
      type: 'document' | 'image' | 'other';
      title: string;
      url: string;
      format: string;
      size: number;
      hash: string;
      uploadedAt: Date;
    }[];
  };
  measurements: {
    type: {
      system: string;
      code: string;
      display: string;
    };
    value: number;
    unit: string;
    location?: {
      x: number;
      y: number;
      z: number;
    };
    imageUid: string;
    notes?: string;
  }[];
  annotations: {
    type: 'point' | 'line' | 'polygon' | 'text' | 'other';
    coordinates: number[][];
    imageUid: string;
    label?: string;
    description?: string;
    color?: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  followUp: {
    required: boolean;
    type?: string;
    timeframe?: string;
    notes?: string;
  };
  metadata: {
    source: string;
    version: string;
    lastUpdated: Date;
    status: 'active' | 'archived' | 'deleted';
    storage: {
      type: 'local' | 'cloud' | 'pacs';
      location: string;
      backup: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ImagingResultSchema = new Schema<IImagingResult>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  order: {
    id: { type: String, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'failed'],
      required: true
    },
    priority: {
      type: String,
      enum: ['routine', 'urgent', 'stat'],
      required: true
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    requestedDate: { type: Date, required: true },
    notes: String
  },
  study: {
    uid: { type: String, required: true, unique: true },
    type: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    modality: {
      type: String,
      enum: ['CT', 'MRI', 'X-RAY', 'ULTRASOUND', 'PET', 'SPECT', 'OTHER'],
      required: true
    },
    bodySite: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    description: { type: String, required: true },
    performedDate: { type: Date, required: true },
    performedBy: {
      id: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
      name: { type: String, required: true },
      role: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ['preliminary', 'final', 'amended', 'cancelled'],
      required: true
    },
    protocol: String,
    contrast: {
      type: String,
      amount: Number,
      unit: String,
      route: String
    }
  },
  series: [{
    uid: { type: String, required: true },
    number: { type: Number, required: true },
    description: { type: String, required: true },
    modality: { type: String, required: true },
    bodySite: {
      system: String,
      code: String,
      display: String
    },
    images: [{
      uid: { type: String, required: true },
      number: { type: Number, required: true },
      type: { type: String, required: true },
      url: { type: String, required: true },
      format: { type: String, required: true },
      size: { type: Number, required: true },
      hash: { type: String, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      windowCenter: Number,
      windowWidth: Number,
      uploadedAt: { type: Date, required: true }
    }]
  }],
  report: {
    status: {
      type: String,
      enum: ['draft', 'preliminary', 'final', 'amended', 'cancelled'],
      required: true
    },
    author: {
      id: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
      name: { type: String, required: true },
      role: { type: String, required: true }
    },
    date: { type: Date, required: true },
    findings: { type: String, required: true },
    impression: { type: String, required: true },
    recommendations: [String],
    comparison: [{
      studyUid: { type: String, required: true },
      date: { type: Date, required: true },
      findings: { type: String, required: true }
    }],
    attachments: [{
      type: {
        type: String,
        enum: ['document', 'image', 'other'],
        required: true
      },
      title: { type: String, required: true },
      url: { type: String, required: true },
      format: { type: String, required: true },
      size: { type: Number, required: true },
      hash: { type: String, required: true },
      uploadedAt: { type: Date, required: true }
    }]
  },
  measurements: [{
    type: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    location: {
      x: Number,
      y: Number,
      z: Number
    },
    imageUid: { type: String, required: true },
    notes: String
  }],
  annotations: [{
    type: {
      type: String,
      enum: ['point', 'line', 'polygon', 'text', 'other'],
      required: true
    },
    coordinates: [[Number]],
    imageUid: { type: String, required: true },
    label: String,
    description: String,
    color: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
    createdAt: { type: Date, required: true }
  }],
  followUp: {
    required: { type: Boolean, default: false },
    type: String,
    timeframe: String,
    notes: String
  },
  metadata: {
    source: { type: String, required: true },
    version: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active'
    },
    storage: {
      type: {
        type: String,
        enum: ['local', 'cloud', 'pacs'],
        required: true
      },
      location: { type: String, required: true },
      backup: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Add indexes for common queries
ImagingResultSchema.index({ patient: 1 });
ImagingResultSchema.index({ 'study.uid': 1 });
ImagingResultSchema.index({ 'study.performedDate': 1 });
ImagingResultSchema.index({ 'study.modality': 1 });
ImagingResultSchema.index({ 'report.status': 1 });
ImagingResultSchema.index({ 'metadata.status': 1 });

// Validate image dimensions
ImagingResultSchema.pre('save', function(next) {
  if (this.isModified('series')) {
    this.series.forEach(series => {
      series.images.forEach(image => {
        if (image.width <= 0 || image.height <= 0) {
          throw new Error('Invalid image dimensions');
        }
      });
    });
  }
  next();
});

export const ImagingResult = mongoose.model<IImagingResult>('ImagingResult', ImagingResultSchema); 