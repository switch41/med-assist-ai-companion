
import mongoose, { Document, Schema } from 'mongoose';

export interface ILabResult extends Document {
  identifier: {
    system: string;
    value: string;
  }[];
  status: 'registered' | 'partial' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'appended' | 'cancelled' | 'entered-in-error' | 'unknown';
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
    text?: string;
  };
  subject: {
    reference: string;
    display?: string;
  };
  encounter?: {
    reference: string;
    display?: string;
  };
  effectiveDateTime?: Date;
  effectivePeriod?: {
    start: Date;
    end?: Date;
  };
  issued?: Date;
  performer: {
    reference: string;
    display?: string;
  }[];
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  valueCodeableConcept?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
    text?: string;
  };
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: {
    low?: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    high?: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
  };
  valueRatio?: {
    numerator: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    denominator: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
  };
  valueSampledData?: {
    origin: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    period: number;
    factor?: number;
    lowerLimit?: number;
    upperLimit?: number;
    dimensions: number;
    data?: string;
  };
  valueTime?: string;
  valueDateTime?: Date;
  valuePeriod?: {
    start: Date;
    end?: Date;
  };
  dataAbsentReason?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
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
    authorReference?: {
      reference: string;
      display?: string;
    };
  }[];
  bodySite?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  method?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  specimen?: {
    reference: string;
    display?: string;
  };
  device?: {
    reference: string;
    display?: string;
  };
  referenceRange?: {
    low?: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    high?: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    type?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
    appliesTo?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    }[];
    age?: {
      low?: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
      high?: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
    };
    text?: string;
  }[];
  hasMember?: {
    reference: string;
    display?: string;
  }[];
  derivedFrom?: {
    reference: string;
    display?: string;
  }[];
  component?: {
    code: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
      text?: string;
    };
    valueQuantity?: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
    valueCodeableConcept?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
      text?: string;
    };
    valueString?: string;
    valueBoolean?: boolean;
    valueInteger?: number;
    valueRange?: {
      low?: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
      high?: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
    };
    valueRatio?: {
      numerator: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
      denominator: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
    };
    valueSampledData?: {
      origin: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
      period: number;
      factor?: number;
      lowerLimit?: number;
      upperLimit?: number;
      dimensions: number;
      data?: string;
    };
    valueTime?: string;
    valueDateTime?: Date;
    valuePeriod?: {
      start: Date;
      end?: Date;
    };
    dataAbsentReason?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
    interpretation?: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    }[];
    referenceRange?: {
      low?: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
      high?: {
        value: number;
        unit: string;
        system: string;
        code: string;
      };
      type?: {
        coding: {
          system: string;
          code: string;
          display: string;
        }[];
      };
      appliesTo?: {
        coding: {
          system: string;
          code: string;
          display: string;
        }[];
      }[];
      age?: {
        low?: {
          value: number;
          unit: string;
          system: string;
          code: string;
        };
        high?: {
          value: number;
          unit: string;
          system: string;
          code: string;
        };
      };
      text?: string;
    }[];
  }[];
}

const LabResultSchema = new Schema<ILabResult>({
  identifier: [{
    system: { type: String, required: true },
    value: { type: String, required: true }
  }],
  status: {
    type: String,
    enum: ['registered', 'partial', 'preliminary', 'final', 'amended', 'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown'],
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
    }],
    text: String
  },
  subject: {
    reference: { type: String, required: true },
    display: String
  },
  encounter: {
    reference: String,
    display: String
  },
  effectiveDateTime: Date,
  effectivePeriod: {
    start: Date,
    end: Date
  },
  issued: Date,
  performer: [{
    reference: { type: String, required: true },
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
    }],
    text: String
  },
  valueString: String,
  valueBoolean: Boolean,
  valueInteger: Number,
  valueRange: {
    low: {
      value: Number,
      unit: String,
      system: String,
      code: String
    },
    high: {
      value: Number,
      unit: String,
      system: String,
      code: String
    }
  },
  valueRatio: {
    numerator: {
      value: Number,
      unit: String,
      system: String,
      code: String
    },
    denominator: {
      value: Number,
      unit: String,
      system: String,
      code: String
    }
  },
  valueSampledData: {
    origin: {
      value: Number,
      unit: String,
      system: String,
      code: String
    },
    period: Number,
    factor: Number,
    lowerLimit: Number,
    upperLimit: Number,
    dimensions: Number,
    data: String
  },
  valueTime: String,
  valueDateTime: Date,
  valuePeriod: {
    start: Date,
    end: Date
  },
  dataAbsentReason: {
    coding: [{
      system: String,
      code: String,
      display: String
    }]
  },
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
    authorReference: {
      reference: String,
      display: String
    }
  }],
  bodySite: {
    coding: [{
      system: String,
      code: String,
      display: String
    }]
  },
  method: {
    coding: [{
      system: String,
      code: String,
      display: String
    }]
  },
  specimen: {
    reference: String,
    display: String
  },
  device: {
    reference: String,
    display: String
  },
  referenceRange: [{
    low: {
      value: Number,
      unit: String,
      system: String,
      code: String
    },
    high: {
      value: Number,
      unit: String,
      system: String,
      code: String
    },
    type: {
      coding: [{
        system: String,
        code: String,
        display: String
      }]
    },
    appliesTo: [{
      coding: [{
        system: String,
        code: String,
        display: String
      }]
    }],
    age: {
      low: {
        value: Number,
        unit: String,
        system: String,
        code: String
      },
      high: {
        value: Number,
        unit: String,
        system: String,
        code: String
      }
    },
    text: String
  }],
  hasMember: [{
    reference: String,
    display: String
  }],
  derivedFrom: [{
    reference: String,
    display: String
  }],
  component: [{
    code: {
      coding: [{
        system: String,
        code: String,
        display: String
      }],
      text: String
    },
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
      }],
      text: String
    },
    valueString: String,
    valueBoolean: Boolean,
    valueInteger: Number,
    valueRange: {
      low: {
        value: Number,
        unit: String,
        system: String,
        code: String
      },
      high: {
        value: Number,
        unit: String,
        system: String,
        code: String
      }
    },
    valueRatio: {
      numerator: {
        value: Number,
        unit: String,
        system: String,
        code: String
      },
      denominator: {
        value: Number,
        unit: String,
        system: String,
        code: String
      }
    },
    valueSampledData: {
      origin: {
        value: Number,
        unit: String,
        system: String,
        code: String
      },
      period: Number,
      factor: Number,
      lowerLimit: Number,
      upperLimit: Number,
      dimensions: Number,
      data: String
    },
    valueTime: String,
    valueDateTime: Date,
    valuePeriod: {
      start: Date,
      end: Date
    },
    dataAbsentReason: {
      coding: [{
        system: String,
        code: String,
        display: String
      }]
    },
    interpretation: [{
      coding: [{
        system: String,
        code: String,
        display: String
      }]
    }],
    referenceRange: [{
      low: {
        value: Number,
        unit: String,
        system: String,
        code: String
      },
      high: {
        value: Number,
        unit: String,
        system: String,
        code: String
      },
      type: {
        coding: [{
          system: String,
          code: String,
          display: String
        }]
      },
      appliesTo: [{
        coding: [{
          system: String,
          code: String,
          display: String
        }]
      }],
      age: {
        low: {
          value: Number,
          unit: String,
          system: String,
          code: String
        },
        high: {
          value: Number,
          unit: String,
          system: String,
          code: String
        }
      },
      text: String
    }]
  }]
}, {
  timestamps: true
});

// Add indexes for common queries
LabResultSchema.index({ 'subject.reference': 1 });
LabResultSchema.index({ 'encounter.reference': 1 });
LabResultSchema.index({ status: 1 });
LabResultSchema.index({ effectiveDateTime: 1 });
LabResultSchema.index({ 'code.coding.code': 1 });

export const LabResult = mongoose.model<ILabResult>('LabResult', LabResultSchema);
