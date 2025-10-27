# Stella AI Assistant - Developer Guide

**A Chrome extension that searches Gemini AI, YouTube, and Google Custom Search simultaneously - No backend required!**

---

## Quick Overview

**Tech Stack**: React + TypeScript + Vite + Chrome Extension APIs
**Key Feature**: All API calls are made directly from the browser extension (no server needed)

### Project Structure
```
extension/
├── manifest.json              # Chrome extension config
├── sidepanel.html            # HTML for side panel
├── vite.config.ts            # Vite build config (uses @crxjs/vite-plugin)
├── .env                      # API keys (create from .env.example)
├── src/
│   ├── App.tsx              # Main UI component ⭐
│   ├── App.css              # Styles
│   ├── main.tsx             # React entry point
│   ├── background/
│   │   └── service-worker.ts   # Extension icon & context menu handler
│   ├── services/            # API clients (direct API calls)
│   │   ├── gemini.ts       # Gemini AI API
│   │   ├── youtube.ts      # YouTube Data API
│   │   └── customSearch.ts # Google Custom Search API
│   └── types/
│       └── api.ts          # TypeScript interfaces
└── dist/                    # Build output (load this in Chrome)
```

### How It Works (5 Steps)
1. **User clicks extension icon** → Side panel opens ([service-worker.ts:27](extension/src/background/service-worker.ts#L27))
2. **User types query** → Input updates `query` state ([App.tsx:76](extension/src/App.tsx#L76))
3. **User hits Enter or clicks "Search"** → Three parallel API calls fire ([App.tsx:24-30](extension/src/App.tsx#L24-L30))
4. **APIs respond** → Results populate `results` state
5. **UI renders** → Displays AI answer, videos, and web results ([App.tsx:96-178](extension/src/App.tsx#L96-L178))

---

## UI Components ([App.tsx](extension/src/App.tsx))

### State Management
```typescript
const [query, setQuery] = useState("");              // Search text
const [loading, setLoading] = useState(false);       // Loading state
const [results, setResults] = useState<SearchResults | null>(null); // API responses
```

### Component Breakdown

**1. Header** (Lines 65-68)
```tsx
<h1>Stella AI Assistant</h1>
<p>Search across Gemini AI, YouTube, and the Web</p>
```

**2. Search Input** (Lines 71-79)
```tsx
<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyPress={handleKeyPress}  // Enter key triggers search
  disabled={loading}
/>
```

**3. Search Button** (Lines 80-86)
```tsx
<button onClick={handleSearch} disabled={loading || !query.trim()}>
  {loading ? "Searching..." : "Search"}
</button>
```

**4. Loading Spinner** (Lines 89-94)
Visible when `loading === true`

**5. Results Container** (Lines 96-178)
Three sections when `results && !loading`:
- **Gemini AI Answer** - Plain text response
- **YouTube Videos** - Thumbnail, title (link), channel, description
- **Web Search Results** - Title (link), URL, snippet

---

## User Interaction Flow

### Opening the Extension

**Extension Icon Click** ([service-worker.ts:27-31](extension/src/background/service-worker.ts#L27-L31))
```typescript
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});
```

**Context Menu** ([service-worker.ts:10-24](extension/src/background/service-worker.ts#L10-L24))
```typescript
chrome.contextMenus.create({
  id: 'stella-ai',
  title: 'Ask Stella AI',
  contexts: ['selection']
});
```
Right-click selected text → "Ask Stella AI" → Panel opens

### Search Workflow ([App.tsx:13-55](extension/src/App.tsx#L13-L55))

```typescript
const handleSearch = async () => {
  if (!query.trim()) return;

  setLoading(true);

  // Call all 3 APIs in parallel
  const [geminiResult, youtubeResult, customSearchResult] =
    await Promise.allSettled([
      searchGemini(query),
      searchYouTube(query),
      searchCustomSearch(query)
    ]);

  // Process results (fulfilled or rejected)
  // Update results state
  setLoading(false);
};
```

**Why `Promise.allSettled()`?**
- Calls APIs in parallel (faster)
- If one fails, others continue
- Each has `.status` ("fulfilled" or "rejected")

---

## API Integration (No Backend!)

All APIs called directly from extension using API keys from `.env` file.

### 1. Gemini AI ([gemini.ts](extension/src/services/gemini.ts))

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

**Request**:
```json
{
  "contents": [{ "parts": [{ "text": "user query" }] }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 2048,
    "topP": 0.95,
    "topK": 40
  }
}
```

**Returns**: Plain text string

**Customization**:
- Change model: Replace `gemini-2.5-flash` (line 23)
- Adjust creativity: Modify `temperature` (0.0-1.0)
- Longer responses: Increase `maxOutputTokens`

### 2. YouTube ([youtube.ts](extension/src/services/youtube.ts))

**Endpoint**: `https://www.googleapis.com/youtube/v3/search`

**Params**: `q` (query), `maxResults=5`, `type=video`, `part=snippet`

**Returns**: Array of videos with `id.videoId`, `snippet` (title, description, thumbnails, channel)

**Customization**:
- More videos: Change `maxResults` (line 15)
- Filter by date: Add `publishedAfter`

### 3. Custom Search ([customSearch.ts](extension/src/services/customSearch.ts))

**Endpoint**: `https://www.googleapis.com/customsearch/v1`

**Params**: `q` (query), `num=5`, `cx` (engine ID), `key` (API key)

**Returns**: Array of results with `title`, `link`, `snippet`, `displayLink`

**Customization**:
- More results: Change `num` (max 10, line 16)
- Filter by site: Add `siteSearch` param
- Safe search: Add `safe=active`

---

## Setup & Development

### 1. Install & Configure

```bash
cd extension
npm install

# Copy environment file
cp .env.example .env
```

Edit `.env` with your API keys:
```
VITE_GEMINI_API_KEY=your_key_here
VITE_YOUTUBE_API_KEY=your_key_here
VITE_CUSTOM_SEARCH_API_KEY=your_key_here
VITE_CUSTOM_SEARCH_ENGINE_ID=your_id_here
```

**Get API Keys**:
- Gemini: https://aistudio.google.com/app/apikey
- YouTube: https://console.cloud.google.com/apis/credentials
- Custom Search: https://console.cloud.google.com/apis/credentials + https://programmablesearchengine.google.com/

### 2. Build & Load

```bash
npm run build
```

Load in Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

### 3. Development Mode

```bash
npm run dev
```
Hot reload enabled.

---

## Common Modifications

### Add a New API (e.g., Wikipedia)

**1. Create service**: `src/services/wikipedia.ts`
```typescript
export async function searchWikipedia(query: string) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;
  const response = await fetch(url);
  const data = await response.json();
  return data.query.search;
}
```

**2. Add type**: `src/types/api.ts`
```typescript
export interface SearchResults {
  gemini: string | null;
  youtube: YouTubeVideo[];
  customSearch: CustomSearchResult[];
  wikipedia: WikiResult[];  // Add
  errors: { ..., wikipedia?: string };  // Add
}
```

**3. Update App.tsx**:
```typescript
import { searchWikipedia } from "./services/wikipedia";

const [geminiResult, youtubeResult, customSearchResult, wikiResult] =
  await Promise.allSettled([
    searchGemini(query),
    searchYouTube(query),
    searchCustomSearch(query),
    searchWikipedia(query)  // Add
  ]);

// Add UI section for Wikipedia results
```

### Change Results Layout

**Side-by-side grid**: Edit [App.css:95-99](extension/src/App.css#L95-L99)
```css
.results-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
```

### Add Tabs

```typescript
const [activeTab, setActiveTab] = useState<'ai' | 'videos' | 'web'>('ai');

<button onClick={() => setActiveTab('ai')}>AI</button>
<button onClick={() => setActiveTab('videos')}>Videos</button>
<button onClick={() => setActiveTab('web')}>Web</button>

{activeTab === 'ai' && <section>Gemini results</section>}
{activeTab === 'videos' && <section>YouTube results</section>}
{activeTab === 'web' && <section>Web results</section>}
```

### Cache Results

```typescript
const [cache, setCache] = useState<Record<string, SearchResults>>({});

const handleSearch = async () => {
  if (cache[query]) {
    setResults(cache[query]);
    return;
  }
  // ... normal search
  setCache(prev => ({ ...prev, [query]: searchResults }));
};
```

### Save Search History

```typescript
const [history, setHistory] = useState<string[]>([]);

const handleSearch = async () => {
  // ... existing code
  setHistory(prev => [query, ...prev].slice(0, 10));
};

<ul>
  {history.map(h => <li onClick={() => setQuery(h)}>{h}</li>)}
</ul>
```

---

## Data Flow Diagram

```
User Input
    ↓
Search Input → query state
    ↓
Enter/Click → handleSearch()
    ↓
loading = true → Spinner shows
    ↓
Promise.allSettled([
  searchGemini(query)      → Gemini API → string
  searchYouTube(query)     → YouTube API → YouTubeVideo[]
  searchCustomSearch(query) → Custom Search API → CustomSearchResult[]
])
    ↓
Process results & errors
    ↓
results state updated
    ↓
loading = false → Results render
```

---

## Type Definitions ([api.ts](extension/src/types/api.ts))

```typescript
interface SearchResults {
  gemini: string | null;
  youtube: YouTubeVideo[];
  customSearch: CustomSearchResult[];
  errors: {
    gemini?: string;
    youtube?: string;
    customSearch?: string;
  };
}

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { default: { url: string }, medium?: { url: string } };
    channelTitle: string;
    publishedAt: string;
  };
}

interface CustomSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}
```

---

## Debugging

**View console**: Right-click side panel → Inspect → Console tab

**Log API responses**:
```typescript
console.log("Gemini:", geminiResult);
console.log("YouTube:", youtubeResult);
console.log("Custom Search:", customSearchResult);
```

**Test without API**:
```typescript
// In gemini.ts
export async function searchGemini(query: string): Promise<string> {
  return `Mock response for: ${query}`;
}
```

---

## Quick Reference

| Task | File | Line |
|------|------|------|
| Change AI model | [gemini.ts](extension/src/services/gemini.ts) | 23 |
| Number of videos | [youtube.ts](extension/src/services/youtube.ts) | 15 |
| Number of web results | [customSearch.ts](extension/src/services/customSearch.ts) | 16 |
| Search logic | [App.tsx](extension/src/App.tsx) | 13-55 |
| UI rendering | [App.tsx](extension/src/App.tsx) | 96-178 |
| Styles | [App.css](extension/src/App.css) | - |
| Icon click handler | [service-worker.ts](extension/src/background/service-worker.ts) | 27-31 |
| Context menu | [service-worker.ts](extension/src/background/service-worker.ts) | 10-24 |

---

## Key Architecture Notes

**No Backend**: All API calls go directly from extension to Google APIs using environment variables.

**Security Note**: API keys are bundled in the built extension. Use API key restrictions in Google Cloud Console to limit usage.

**Parallel API Calls**: `Promise.allSettled()` ensures fast results and resilience (if one fails, others work).

**State-Driven UI**: React state (`query`, `loading`, `results`) controls all UI rendering.

**Modular Services**: Each API is isolated in its own file for easy modification.

---

## Manifest Configuration ([manifest.json](extension/manifest.json))

```json
{
  "manifest_version": 3,
  "permissions": ["sidePanel", "contextMenus", "activeTab", "storage"],
  "host_permissions": ["https://*/*", "https://generativelanguage.googleapis.com/*"],
  "background": { "service_worker": "src/background/service-worker.ts" },
  "side_panel": { "default_path": "sidepanel.html" }
}
```

---

Happy coding! 🚀
