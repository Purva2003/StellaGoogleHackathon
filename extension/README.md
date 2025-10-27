# Stella AI Assistant - Chrome Extension

Chrome extension frontend for Stella AI Assistant.

## Features

- Side panel interface with React
- Search across Vertex AI, YouTube, and Custom Search
- Context menu integration
- Communicates with local Node.js server for Vertex AI queries

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder (in parent directory)

## Development

Run in development mode with hot reload:
```bash
npm run dev
```

## Important

Make sure the Node.js server is running on `http://localhost:3000` before using Vertex AI features.

See the [server README](../server/README.md) for setup instructions.

## Project Structure

```
extension/
├── src/
│   ├── App.tsx              # Main React component
│   ├── main.tsx             # React entry point
│   ├── background/
│   │   └── service-worker.ts # Chrome extension background script
│   ├── services/
│   │   ├── vertexAI.ts      # Vertex AI API client
│   │   ├── youtube.ts       # YouTube API client
│   │   └── customSearch.ts  # Custom Search API client
│   └── types/
│       └── api.ts           # TypeScript interfaces
├── manifest.json            # Chrome extension manifest
├── sidepanel.html          # Side panel HTML
└── icons/                  # Extension icons
```
