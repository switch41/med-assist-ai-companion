# MedAssist AI Companion - Backend API Documentation

## Overview
The MedAssist AI Companion backend provides a RESTful API for managing medical records, patient-provider interactions, and AI-assisted healthcare services.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## API Endpoints

### Authentication
#### Login
```http
POST /auth/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### Register
```http
POST /auth/register
```
Request body:
```json
{
  "email": "string",
  "password": "string",
  "role": "string"
}
```

#### Logout
```http
POST /auth/logout
```

### Provider Endpoints
#### Get Provider Profile
```http
GET /providers/profile
```
Response:
```json
{
  "id": "string",
  "name": "string",
  "specialization": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  }
}
```

#### Update Provider Profile
```http
PUT /providers/profile
```
Request body:
```json
{
  "name": "string",
  "specialization": "string",
  "contact": {
    "email": "string",
    "phone": "string"
  }
}
```

#### Get Provider's Patients
```http
GET /providers/patients
```
Response:
```json
{
  "patients": [
    {
      "id": "string",
      "name": "string",
      "lastVisit": "date",
      "status": "string"
    }
  ]
}
```

### Patient Endpoints
#### Get Patient Profile
```http
GET /patients/:id
```

#### Update Patient Profile
```http
PUT /patients/:id
```

#### Get Patient Medical Records
```http
GET /patients/:id/records
```

### Chat Endpoints
#### Start New Chat
```http
POST /chat
```
Request body:
```json
{
  "patientId": "string",
  "message": "string"
}
```

#### Get Chat History
```http
GET /chat/:id
```

#### Send Message
```http
POST /chat/:id/messages
```
Request body:
```json
{
  "content": "string",
  "type": "string"
}
```

## Error Handling
The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Rate limit headers are included in the response

## Security
- All endpoints are protected with Helmet.js
- CORS is enabled with configurable origins
- Rate limiting is implemented
- JWT authentication is required for protected routes

## Development
To start the development server:
```bash
npm run dev:backend
```

## Environment Variables
Required environment variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/medassist
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:8080
```

## Dependencies
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Winston for logging
- Helmet for security
- Express Rate Limit for rate limiting

# MedAssist AI Companion

## Project Structure
```
med-assist-ai-companion/
├── src/
│   ├── frontend/                 # Frontend application
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/         # Shared components
│   │   │   ├── layout/         # Layout components
│   │   │   └── features/       # Feature-specific components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions and constants
│   │   ├── styles/             # Global styles and themes
│   │   └── types/              # TypeScript type definitions
│   │
│   ├── backend/                 # Backend application
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   │
│   └── shared/                  # Shared code between frontend and backend
│       ├── constants/          # Shared constants
│       ├── types/              # Shared TypeScript types
│       └── utils/              # Shared utility functions
│
├── public/                      # Static files
├── tests/                       # Test files
│   ├── frontend/               # Frontend tests
│   └── backend/                # Backend tests
│
├── docs/                        # Documentation
│   ├── api/                    # API documentation
│   └── guides/                 # Development guides
│
├── scripts/                     # Build and deployment scripts
├── .github/                     # GitHub configuration
├── .husky/                      # Git hooks
├── .vscode/                     # VS Code configuration
│
├── package.json                 # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend)
- Supabase account (for authentication)

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd med-assist-ai-companion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in root directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers:
```bash
# Start backend server
npm run dev:backend

# Start frontend server
npm run dev
```
