# Stella AI Server

Backend Node.js server for Stella AI Assistant Chrome Extension.

## Features

- Express.js REST API server
- Google Vertex AI integration using service account
- OAuth 2.0 token management with caching
- CORS enabled for Chrome extension communication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure `service-account.json` is in this folder

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```

### Vertex AI Query
```
POST /api/vertex-ai
Content-Type: application/json

{
  "prompt": "Your question here"
}
```

Response:
```json
{
  "success": true,
  "data": "AI response text"
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `PROJECT_ID` - Google Cloud project ID
- `LOCATION` - Vertex AI location (default: us-central1)
