import mongoose, { Document, Schema } from 'mongoose';

export interface IWearableData extends Document {
  patient: mongoose.Types.ObjectId;
  device: {
    identifier: string;
    type: 'fitness_tracker' | 'smart_watch' | 'medical_device' | 'other';
    manufacturer: string;
    model: string;
    firmware?: string;
    batteryLevel?: number;
    lastSync: Date;
  };
  vitals: {
    type: {
      system: string;
      code: string;
      display: string;
    };
    value: number;
    unit: string;
    timestamp: Date;
    confidence?: number;
    source: 'device' | 'manual' | 'calculated';
    notes?: string;
  }[];
  activity: {
    type: {
      system: string;
      code: string;
      display: string;
    };
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    intensity?: 'light' | 'moderate' | 'vigorous';
    calories?: number;
    distance?: number;
    steps?: number;
    heartRate?: {
      min: number;
      max: number;
      avg: number;
    };
    location?: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    notes?: string;
  }[];
  sleep: {
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    stages: {
      deep: number; // in minutes
      light: number; // in minutes
      rem: number; // in minutes
      awake: number; // in minutes
    };
    heartRate?: {
      min: number;
      max: number;
      avg: number;
    };
    oxygenSaturation?: {
      min: number;
      max: number;
      avg: number;
    };
    interruptions?: {
      count: number;
      totalDuration: number; // in minutes
    };
    notes?: string;
  }[];
  nutrition: {
    type: {
      system: string;
      code: string;
      display: string;
    };
    timestamp: Date;
    amount: {
      value: number;
      unit: string;
    };
    calories?: number;
    macronutrients?: {
      protein: number;
      carbohydrates: number;
      fat: number;
    };
    notes?: string;
  }[];
  alerts: {
    type: {
      system: string;
      code: string;
      display: string;
    };
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
    value?: number;
    threshold?: number;
    status: 'active' | 'acknowledged' | 'resolved';
    notes?: string;
  }[];
  metadata: {
    syncMethod: 'automatic' | 'manual' | 'scheduled';
    syncStatus: 'success' | 'partial' | 'failed';
    errorMessage?: string;
    dataQuality: 'high' | 'medium' | 'low';
    processingStatus: 'raw' | 'processed' | 'analyzed';
  };
  createdAt: Date;
  updatedAt: Date;
}

const WearableDataSchema = new Schema<IWearableData>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  device: {
    identifier: { type: String, required: true },
    type: {
      type: String,
      enum: ['fitness_tracker', 'smart_watch', 'medical_device', 'other'],
      required: true
    },
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    firmware: String,
    batteryLevel: Number,
    lastSync: { type: Date, required: true }
  },
  vitals: [{
    type: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    timestamp: { type: Date, required: true },
    confidence: Number,
    source: {
      type: String,
      enum: ['device', 'manual', 'calculated'],
      required: true
    },
    notes: String
  }],
  activity: [{
    type: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    intensity: {
      type: String,
      enum: ['light', 'moderate', 'vigorous']
    },
    calories: Number,
    distance: Number,
    steps: Number,
    heartRate: {
      min: Number,
      max: Number,
      avg: Number
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    notes: String
  }],
  sleep: [{
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    quality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      required: true
    },
    stages: {
      deep: { type: Number, required: true },
      light: { type: Number, required: true },
      rem: { type: Number, required: true },
      awake: { type: Number, required: true }
    },
    heartRate: {
      min: Number,
      max: Number,
      avg: Number
    },
    oxygenSaturation: {
      min: Number,
      max: Number,
      avg: Number
    },
    interruptions: {
      count: Number,
      totalDuration: Number
    },
    notes: String
  }],
  nutrition: [{
    type: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    timestamp: { type: Date, required: true },
    amount: {
      value: { type: Number, required: true },
      unit: { type: String, required: true }
    },
    calories: Number,
    macronutrients: {
      protein: Number,
      carbohydrates: Number,
      fat: Number
    },
    notes: String
  }],
  alerts: [{
    type: {
      system: { type: String, required: true },
      code: { type: String, required: true },
      display: { type: String, required: true }
    },
    timestamp: { type: Date, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    value: Number,
    threshold: Number,
    status: {
      type: String,
      enum: ['active', 'acknowledged', 'resolved'],
      default: 'active'
    },
    notes: String
  }],
  metadata: {
    syncMethod: {
      type: String,
      enum: ['automatic', 'manual', 'scheduled'],
      required: true
    },
    syncStatus: {
      type: String,
      enum: ['success', 'partial', 'failed'],
      required: true
    },
    errorMessage: String,
    dataQuality: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    processingStatus: {
      type: String,
      enum: ['raw', 'processed', 'analyzed'],
      default: 'raw'
    }
  }
}, {
  timestamps: true
});

// Add indexes for common queries
WearableDataSchema.index({ patient: 1 });
WearableDataSchema.index({ 'device.identifier': 1 });
WearableDataSchema.index({ 'vitals.timestamp': 1 });
WearableDataSchema.index({ 'activity.startTime': 1 });
WearableDataSchema.index({ 'sleep.startTime': 1 });
WearableDataSchema.index({ 'alerts.timestamp': 1 });
WearableDataSchema.index({ 'metadata.processingStatus': 1 });

// Add geospatial index for activity locations
WearableDataSchema.index({ 'activity.location': '2dsphere' });

// Calculate duration for activity and sleep records
WearableDataSchema.pre('save', function(next) {
  if (this.isModified('activity')) {
    this.activity.forEach(activity => {
      activity.duration = Math.round(
        (activity.endTime.getTime() - activity.startTime.getTime()) / (1000 * 60)
      );
    });
  }
  
  if (this.isModified('sleep')) {
    this.sleep.forEach(sleep => {
      sleep.duration = Math.round(
        (sleep.endTime.getTime() - sleep.startTime.getTime()) / (1000 * 60)
      );
    });
  }
  
  next();
});

export const WearableData = mongoose.model<IWearableData>('WearableData', WearableDataSchema); 