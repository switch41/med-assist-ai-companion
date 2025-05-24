
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mediassist',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  encryptionKey: process.env.ENCRYPTION_KEY || 'change-this-in-production',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  emailService: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  fhir: {
    serverUrl: process.env.FHIR_SERVER_URL || 'http://localhost:8080/fhir',
    clientId: process.env.FHIR_CLIENT_ID || '',
    clientSecret: process.env.FHIR_CLIENT_SECRET || '',
  },
  hipaa: {
    auditLogLevel: process.env.AUDIT_LOG_LEVEL || 'info',
    encryptionAtRest: process.env.ENCRYPTION_AT_REST === 'true',
    accessLogRetention: parseInt(process.env.ACCESS_LOG_RETENTION || '2555', 10), // 7 years in days
  }
};
