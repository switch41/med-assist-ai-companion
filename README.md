# Switch HealthCare - AI Healthcare Companion

## Overview

**Switch HealthCare** is a comprehensive, production-ready AI healthcare chatbot system designed to revolutionize patient care through intelligent health monitoring, symptom assessment, medication management, and seamless integration with wearable devices and healthcare providers.

> Made with dedication by **Team Switch**

**Live Demo**:  
[https://preview--med-assist-ai-companion.lovable.app/](https://preview--med-assist-ai-companion.lovable.app/)

---

## Key Features

### AI-Powered Healthcare Assistant
- Intelligent symptom assessment using advanced NLP models
- Automated medical triage system based on urgency levels
- Real-time monitoring of vitals and health data
- Emergency condition detection with instant alerts

### Medication Management
- OCR-powered prescription scanning and smart tracking using  Microsoft BioGPT 
- Automated reminders with intelligent notification system
- Real-time drug interaction analysis
- Refill management and pharmacy communication

### Wearable Device Integration
- Supports Apple HealthKit, Google Fit, and Samsung Health
- Hourly sync of health metrics and real-time monitoring
- AI-based anomaly detection for health alerts

### Health Records Management
- FHIR-compliant secure data storage
- Intelligent medical document organization
- Medical timeline and family health history tracking
- Integration with external healthcare providers

### Provider Connectivity
- AI-based smart provider recommendations
- Auto-generated clinical summaries for handoffs
- Built-in telehealth video consultation integration
- Automated appointment scheduling and follow-ups

---

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build optimization
- Tailwind CSS (custom medical theme)
- Shadcn/UI component library
- React Router v6, TanStack Query
- Recharts for data visualization

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT, OAuth 2.0, MFA for authentication
- Helmet.js, CORS, Winston logging, Socket.io

### AI & ML
- Custom medical NLP models
- OCR for prescription processing
- Statistical pattern recognition
- Emergency triage based on ESI

### Integration APIs
- Apple HealthKit, Google Fit API, Samsung Health SDK
- FHIR/HL7 for healthcare interoperability
- Telehealth platform APIs

### Security & Compliance
- HIPAA, GDPR, and SOC 2 Type II compliant
- End-to-end encryption
- Audit trails and role-based access

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB
- Supabase account

### Quick Start

```bash
git clone https://github.com/your-org/mediassist-ai-companion.git
cd mediassist-ai-companion
npm install
```

### Environment Configuration

```bash
cp .env.example .env
# Fill in the environment variables
```

### Start Servers

```bash
npm run dev           # Frontend
npm run dev:backend   # Backend (in a separate terminal)
```

Access:
- Frontend: http://localhost:8080  
- Backend API: http://localhost:3000  
- API Docs: http://localhost:3000/api/docs

---

## Project Structure

```
switch-healthcare/
├── src/
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── chat/
│   │   │   ├── wearable/
│   │   │   └── medical/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── backend/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── shared/
│       ├── types/
│       └── constants/
├── docs/
├── scripts/
├── tests/
```

---

## Wearable Integration Code Samples

### Apple HealthKit

```typescript
const connectAppleHealth = async () => {
  const permissions = {
    read: ['heartRate', 'bloodPressure', 'steps', 'sleepAnalysis'],
    write: ['bodyMass', 'height']
  };
  await HealthKit.requestAuthorization(permissions);
  HealthKit.enableBackgroundDelivery('heartRate', 3600);
};
```

### Google Fit

```typescript
const syncGoogleFitData = async () => {
  const client = new GoogleFit({
    clientId: process.env.GOOGLE_FIT_CLIENT_ID,
    scope: ['fitness.heart_rate.read', 'fitness.activity.read']
  });
  return await client.getHeartRate({
    startTime: Date.now() - 86400000,
    endTime: Date.now()
  });
};
```

### Samsung Health

```typescript
const connectSamsungHealth = async () => {
  const samsungHealth = new SamsungHealthAPI({
    appId: process.env.SAMSUNG_HEALTH_APP_ID
  });
  await samsungHealth.connect(['step_count', 'heart_rate', 'sleep']);
  setInterval(() => samsungHealth.syncData(), 3600000);
};
```

---

## Security & Privacy

### HIPAA Features
- AES-256 encryption
- Role-based access and audit logs
- Real-time breach detection

### Privacy Controls
- Consent-based data sharing
- Full data portability
- User-controlled deletion
- Anonymous analytics

---

## Deployment

### Cloud Deployment Options
- AWS: ECS + RDS + ElastiCache
- Google Cloud: GKE + Cloud SQL + Memorystore
- Azure: AKS + Azure Database + Redis
- Vercel: Frontend deployment

---

## Monitoring & Analytics

### Metrics Dashboard
- System performance: response time, errors, uptime
- User engagement and retention
- Triage and symptom accuracy
- Wearable data quality

### AI Model Analytics
- Symptom prediction accuracy
- Triage outcome effectiveness
- Anomaly detection metrics
- User satisfaction indicators

---

## Testing

```bash
npm run test
npm run test:coverage
npm run test:e2e
npm run test:security
```

Includes:
- Unit Tests
- Integration Tests
- E2E Workflow Tests
- Security Tests
- Performance Benchmarks

---

## API Documentation

### Authentication
```
POST /api/auth/login
POST /api/auth/register
DELETE /api/auth/logout
```

### Patient APIs
```
GET /api/patients/profile
PUT /api/patients/profile
POST /api/patients/vitals
```

### Wearables
```
POST /api/wearables/connect
GET /api/wearables/data
PUT /api/wearables/sync
```

### Chat Sessions
```
POST /api/chat/sessions
GET /api/chat/sessions/:id
POST /api/chat/sessions/:id/messages
```

**Rate Limits**:
- API: 1000 req/hr/user  
- Chat: 100 messages/hr  
- Sync: 24/day  
- Uploads: 50/day

---

## Contributing
* Kushal Parihar ([@switch41](https://github.com/switch41))
* Sara Vasavi ([@vasavisara]((https://github.com/vasavisara))
* Nandikanti Sriya ([@nandikanti09](https://github.com/nandikanti09))

### Guidelines
- Follow ESLint and Prettier configs
- Maintain 90%+ test coverage
- Write documentation
- Ensure HIPAA compliance for features

### How to Contribute

```bash
git fork https://github.com/your-org/mediassist-ai-companion.git
git checkout -b feature/my-feature
npm run test
git push origin feature/my-feature
```

Submit a pull request and tag reviewers.
