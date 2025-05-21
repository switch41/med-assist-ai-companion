import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Configuration schema
const configSchema = z.object({
  // Server
  port: z.number().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  
  // Security
  jwtSecret: z.string().min(32),
  jwtExpiresIn: z.string().default('1d'),
  corsOrigin: z.string().default('http://localhost:5173'),
  
  // Database
  mongoUri: z.string().url(),
  
  // Azure
  azureTenantId: z.string(),
  azureClientId: z.string(),
  azureClientSecret: z.string(),
  
  // OpenAI
  openaiApiKey: z.string(),
  
  // FHIR
  fhirServerUrl: z.string().url(),
  
  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Parse and validate configuration
const config = configSchema.parse({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  corsOrigin: process.env.CORS_ORIGIN,
  mongoUri: process.env.MONGODB_URI,
  azureTenantId: process.env.AZURE_TENANT_ID,
  azureClientId: process.env.AZURE_CLIENT_ID,
  azureClientSecret: process.env.AZURE_CLIENT_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  fhirServerUrl: process.env.FHIR_SERVER_URL,
  logLevel: process.env.LOG_LEVEL,
});

export { config };