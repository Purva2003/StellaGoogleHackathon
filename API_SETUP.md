# Stella AI Extension - API Integration Setup Guide

This guide will help you set up all the required API keys for the Stella AI extension.

## Overview

The extension uses three Google APIs:
1. **Google Gemini API** - For AI-powered text summarization
2. **YouTube Data API v3** - For searching relevant videos
3. **Google Custom Search API** - For finding related web pages

## Step-by-Step Setup

### Prerequisites
- A Google account
- Basic understanding of API keys
- Chrome browser for testing

---

## 1. Set Up Google Gemini API

### Get Your API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"** or **"Get API Key"**
3. Select your Google Cloud project (or create a new one)
4. Copy the generated API key
5. Save it securely - you'll need it for the `.env` file

### Free Tier Limits
- **60 requests per minute** (RPM)
- Generous monthly quota for development

---

## 2. Set Up YouTube Data API v3

### Enable the API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (same as Gemini API)
3. Navigate to **APIs & Services** > **Library**
4. Search for **"YouTube Data API v3"**
5. Click on it and press **"Enable"**

### Create API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **"API key"**
3. Copy the generated API key
4. (Optional) Click **"Restrict Key"** to add security:
   - Application restrictions: **HTTP referrers** (for websites)
   - API restrictions: Select **YouTube Data API v3** only

### Free Tier Limits
- **10,000 quota units per day**
- A search request costs ~100 units
- That's about 100 searches per day

---

## 3. Set Up Google Custom Search API

### Enable the API
1. In [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** > **Library**
3. Search for **"Custom Search API"**
4. Click **"Enable"**

### You Can Use the Same API Key
The Custom Search API can use the **same API key** as YouTube Data API. No need to create a new one!

### Create a Custom Search Engine
1. Visit [Programmable Search Engine](https://programmablesearchengine.google.com/controlpanel/all)
2. Click **"Add"** to create a new search engine
3. Configure your search engine:
   - **Sites to search**: Enter `www.google.com` (or leave blank)
   - **Name**: `Stella AI Search Engine`
   - Enable **"Search the entire web"** toggle
4. Click **"Create"**
5. On the next page, click **"Customize"**
6. Find and copy your **Search Engine ID** (starts with a long alphanumeric string)

### Free Tier Limits
- **100 search queries per day** (free)
- After that, you can upgrade or wait until next day

---

## 4. Configure Environment Variables

### Create the .env File
1. In your project root, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your API keys:
   ```env
   VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_YOUTUBE_API_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
   VITE_CUSTOM_SEARCH_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
   VITE_SEARCH_ENGINE_ID=012345678901234567890:abcdefghijk
   ```

### Security Checklist
- ✅ .env file is in `.gitignore`
- ✅ Never commit API keys to Git
- ✅ Use different keys for development and production
- ✅ Set up API key restrictions in Google Cloud Console

---

## 5. Test Your Setup

### Run the Development Server
```bash
npm install
npm run dev
```

### Test Each API
1. Open the extension in Chrome
2. Try searching for something simple like **"React hooks"**
3. Check the browser console for any errors
4. Verify you see:
   - ✅ AI summary from Gemini
   - ✅ YouTube videos
   - ✅ Web search results

### Common Issues

#### "API key not configured"
- Make sure your `.env` file exists
- Check that all keys are filled in
- Restart the dev server after adding keys

#### "403 Forbidden" or "API not enabled"
- Verify the API is enabled in Google Cloud Console
- Check that billing is enabled (required even for free tier)
- Wait a few minutes for changes to propagate

#### "Quota exceeded"
- You've hit the daily limit
- Wait until tomorrow or upgrade to paid tier
- Check your usage in Google Cloud Console

#### "Invalid API key"
- Double-check you copied the key correctly
- Make sure there are no extra spaces
- Regenerate the key if needed

---

## 6. API Key Restrictions (Recommended)

### For Production
1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under **Application restrictions**:
   - Select **Chrome extensions**
   - Add your extension ID once published
4. Under **API restrictions**:
   - Select **Restrict key**
   - Choose: Gemini API, YouTube Data API v3, Custom Search API
5. Click **"Save"**

### For Development
- Use unrestricted keys for easier testing
- Create separate keys for dev and production
- Never share your API keys publicly

---

## 7. Monitor Your Usage

### Check API Usage
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** > **Dashboard**
3. Click on each API to see usage statistics
4. Set up billing alerts if needed

### Daily Limits Summary
| API | Free Limit | Cost After |
|-----|-----------|------------|
| Gemini API | 60 RPM | Free (generous quota) |
| YouTube Data API | 10,000 units/day | $0 (free tier sufficient) |
| Custom Search API | 100 queries/day | $5 per 1000 queries |

---

## 8. Troubleshooting

### Enable Billing (Required)
Even for free tier APIs, you need to enable billing:
1. Go to [Billing](https://console.cloud.google.com/billing)
2. Link a payment method
3. **Don't worry** - you won't be charged unless you exceed free limits
4. Set up budget alerts to be safe

### API Quota Errors
If you see quota errors:
```javascript
// The extension will show user-friendly messages
"Daily quota exceeded. Please try again tomorrow."
```

### Debug Mode
To see detailed API responses in console:
```javascript
// APIs automatically log errors to console
// Check browser DevTools > Console tab
```

---

## 9. Best Practices

### Development
- ✅ Use `.env.local` for local overrides
- ✅ Keep development and production keys separate
- ✅ Test with small queries first
- ✅ Monitor your quota usage regularly

### Security
- ❌ Never commit `.env` to Git
- ❌ Never share API keys in screenshots
- ❌ Never expose keys in client-side code (we use VITE_ prefix for build-time injection)
- ✅ Rotate keys if compromised
- ✅ Use API restrictions in production

### Performance
- The extension caches results to save API calls
- Multiple API calls run in parallel for speed
- Graceful degradation if one API fails

---

## 10. Next Steps

Once your APIs are set up:

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

3. **Test thoroughly**:
   - Try different search queries
   - Check all three result types appear
   - Monitor for errors

4. **Prepare for production**:
   - Set up restricted API keys
   - Add extension ID to restrictions
   - Monitor usage and costs

---

## Support & Resources

### Official Documentation
- [Gemini API Docs](https://ai.google.dev/docs)
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Custom Search API Docs](https://developers.google.com/custom-search/v1/introduction)

### Helpful Links
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Dashboard](https://console.cloud.google.com/apis/dashboard)
- [Billing Settings](https://console.cloud.google.com/billing)

### Getting Help
- Check browser console for error messages
- Review API quotas in Cloud Console
- Ensure all APIs are enabled
- Verify billing is set up

---

**You're all set!** 🚀

Start the dev server and begin testing your Stella AI extension with real API integrations.
