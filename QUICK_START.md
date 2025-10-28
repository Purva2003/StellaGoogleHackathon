# 🚀 Quick Start Guide - Get Running in 10 Minutes

## Prerequisites
- Node.js installed
- Chrome browser
- Google account

---

## Step 1: Get API Keys (5 minutes)

### Gemini API
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### YouTube + Custom Search API
1. Visit: https://console.cloud.google.com/
2. Enable "YouTube Data API v3"
3. Enable "Custom Search API"
4. Go to Credentials → Create API Key
5. Copy the key

### Search Engine ID
1. Visit: https://programmablesearchengine.google.com/
2. Click "Add"
3. Add `www.google.com` as site
4. Enable "Search the entire web"
5. Copy the Search Engine ID

---

## Step 2: Configure (1 minute)

```bash
# Navigate to project
cd /Users/purvasinghgrover/extension/finalBackend/StellaGoogleHackathon

# Copy environment template
cp .env.example .env

# Edit .env file and paste your keys
```

Your `.env` should look like:
```env
VITE_GEMINI_API_KEY=AIzaSy...
VITE_YOUTUBE_API_KEY=AIzaSy...
VITE_CUSTOM_SEARCH_KEY=AIzaSy...  # Same as YouTube key
VITE_SEARCH_ENGINE_ID=0123456789...
```

---

## Step 3: Install & Build (2 minutes)

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

---

## Step 4: Load in Chrome (1 minute)

1. Open Chrome
2. Go to: `chrome://extensions`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select the `dist` folder in your project
6. Done! ✅

---

## Step 5: Test (1 minute)

1. Click the Stella extension icon in Chrome
2. Try searching: **"React hooks"**
3. You should see:
   - ✅ AI summary
   - ✅ YouTube videos
   - ✅ Web results

---

## Troubleshooting

### "API key not configured"
→ Check your `.env` file exists and has all 4 keys filled in

### "403 Forbidden"
→ Enable billing in Google Cloud Console (required even for free tier)

### No results appear
→ Open browser console (F12) and check for errors

---

## Next Steps

- Read [API_SETUP.md](API_SETUP.md) for detailed setup
- Read [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) for full documentation
- Start customizing and building features!

---

**That's it! You're ready to use Stella AI!** 🎉
