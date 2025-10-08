# Stella Browser Extension - 2-Week Development Plan (2 Frontend Developers)

## Project Overview

Students and researchers spend significant time reading and comprehending dense, technical, or multi-lingual web content. The manual process of summarizing text, finding relevant videos, or performing additional research is inefficient and breaks focus. Stella is a browser extension that uses Google's AI technologies to streamline the learning process. By simply highlighting text, users can instantly access an AI-generated summary, find relevant YouTube videos, request deeper explanations, and discover related web pages—all within a convenient side panel.

---

## Team Reality Check ⚠️

**Current Situation**: Both developers are frontend-focused with limited backend experience.

**Strategy Shift**: Minimize backend complexity by leveraging:
- **Client-side API calls** directly from extension (simpler, no Cloud Functions initially)
- **Serverless platforms with generous free tiers** (Firebase, Vercel Edge Functions)
- **Pre-built services** instead of custom infrastructure
- **Pair programming** for backend learning curve

---

## Revised Tech Stack (Frontend-Friendly)

### Frontend (Extension) - Your Comfort Zone ✅
- **Manifest V3** - Chrome's latest extension standard
- **React + TypeScript** - Familiar territory
- **Tailwind CSS** - Rapid styling
- **Vite** - Fast build tooling
- **Chrome Extension APIs** - Selection, side panel, context menus

### Backend - Simplified Approach 🎯
**Option A: Direct API Calls (Recommended for Week 1)**
- Call Gemini, YouTube, and Custom Search APIs **directly from extension**
- Store API keys in **environment variables** (never in code)
- Use Chrome extension's **background service worker** as lightweight backend
- Implement **chrome.storage** for caching

**Option B: Vercel Edge Functions (If you need proxying)**
- Much simpler than Google Cloud Functions
- Deploy with `vercel deploy` (similar to deploying a React app)
- Automatic HTTPS and global CDN
- Easy environment variable management

**Why This Works**:
- Google's APIs support **CORS** - you can call them from browser
- Extension environment is secure (not a public website)
- Eliminates Cloud Functions learning curve
- Can add backend layer later if needed

### Infrastructure - Keep It Simple
- **Vercel** (free tier) - If you need any backend proxying
- **GitHub** - Version control and CI/CD
- **Chrome Web Store** - Extension hosting
- **No GCP initially** - Avoid infrastructure complexity

---

## Team Structure & Roles

### Developer A: Core Extension & Text Features
**Focus**: Extension architecture, text selection, summarization UI

**Why This Assignment**: 
- Builds foundation that Developer B depends on
- More React-heavy (comfortable territory)

### Developer B: Integration & Discovery Features  
**Focus**: API integrations, YouTube search, related pages

**Why This Assignment**:
- Learns API integration patterns from Developer A
- Can work somewhat independently once extension shell is ready

---

## Two-Week Sprint Plan (Frontend Developer Friendly)

### **Week 1: Build MVP with Direct API Calls**

#### **Day 1: Setup & Learning Day**

**Morning: Both Developers (Pair Programming)**
- [ ] **Watch together**: "Chrome Extensions Manifest V3 Tutorial" (30 min)
- [ ] **Read together**: Gemini API Quickstart (30 min)
- [ ] Initialize Vite + React + TypeScript project
- [ ] Set up basic Manifest V3 configuration
- [ ] Create `.env` file for API keys (NEVER commit this)
- [ ] Test a simple Gemini API call from React

**Afternoon: Split Tasks**

**Developer A**
- [ ] Create project folder structure:
  ```
  /src
    /components   # React components
    /content      # Content script for text selection
    /background   # Service worker
    /sidepanel    # Side panel React app
    /utils        # API helpers
    /types        # TypeScript interfaces
  ```
- [ ] Set up Tailwind CSS
- [ ] Create basic side panel HTML + React mount point
- [ ] Build simple "Hello Stella" side panel

**Developer B**
- [ ] Research Gemini API documentation
- [ ] Create API key for Gemini, YouTube, Custom Search
- [ ] Write utility function for Gemini API calls with error handling
- [ ] Test API calls in a simple HTML file
- [ ] Document API response structures

**End-of-Day Sync**: 
- Developer B shows Developer A how to call Gemini API
- Developer A shows Developer B the extension structure

---

#### **Day 2: Text Selection & First API Integration**

**Developer A - Text Selection**
- [ ] Create content script (`content.js`)
- [ ] Detect text selection with `window.getSelection()`
- [ ] Add context menu item: "Summarize with Stella"
- [ ] Send selected text to background script using `chrome.runtime.sendMessage`
- [ ] Open side panel when context menu clicked
- [ ] Handle edge cases (no text selected, images selected)

**Developer B - Summarization Logic (Pair with A for 1 hour)**
- [ ] Create `api/gemini.ts` utility file
- [ ] Write `summarizeText()` function that calls Gemini API
- [ ] Add loading states and error handling
- [ ] Test with various text lengths
- [ ] Document the function for Developer A to use

**Together (Last Hour)**
- [ ] Integrate: text selection → API call → display in side panel
- [ ] Test end-to-end flow
- [ ] Fix any bugs together

**Learning Goal**: Both developers now understand the full data flow

---

#### **Day 3: Summarization UI & Polish**

**Developer A - Summary Display**
- [ ] Create `Summary.tsx` component
- [ ] Display summary with nice formatting
- [ ] Add copy-to-clipboard button
- [ ] Show word count and reading time
- [ ] Add "Regenerate" button
- [ ] Create loading skeleton component
- [ ] Add error state UI (friendly error messages)

**Developer B - Enhanced Summarization**
- [ ] Add prompt engineering for better summaries:
  ```typescript
  const prompt = `Summarize the following text in 100-150 words.
  Keep it clear and concise:
  
  ${selectedText}`;
  ```
- [ ] Add summary length options (Short / Medium / Detailed)
- [ ] Implement basic caching with `chrome.storage.local`:
  ```typescript
  // Cache key: hash of selected text
  await chrome.storage.local.set({ [textHash]: summary });
  ```
- [ ] Add rate limiting (max 10 calls per minute)

**End-of-Day**: Test summarization on Wikipedia, news articles, research papers

---

#### **Day 4: YouTube Integration (Pair Programming Day)**

**Morning: Together (Learning)**
- [ ] **Read together**: YouTube Data API v3 documentation (45 min)
- [ ] Create YouTube API key
- [ ] Test API call in browser console
- [ ] Understand quota system (10,000 units/day free)

**Afternoon: Split with Check-ins**

**Developer A - YouTube UI**
- [ ] Create `VideoCard.tsx` component
- [ ] Display video thumbnail, title, channel
- [ ] Add embedded YouTube player
- [ ] Create video list with scrolling
- [ ] Add "Watch on YouTube" button
- [ ] Style with Tailwind

**Developer B - YouTube Search**
- [ ] Create `api/youtube.ts` utility
- [ ] Write `searchVideos()` function:
  ```typescript
  async function searchVideos(query: string) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${query}&type=video&maxResults=5&key=${API_KEY}`
    );
    return response.json();
  }
  ```
- [ ] Extract keywords from selected text for better search
- [ ] Handle API errors and quota limits
- [ ] Cache results for 24 hours

**Together (Last Hour)**
- [ ] Integrate video search with UI
- [ ] Test with various topics
- [ ] Optimize search query generation

---

#### **Day 5: Related Pages Search**

**Developer A - Related Pages UI**
- [ ] Create `RelatedPage.tsx` component
- [ ] Display page title, URL, snippet
- [ ] Add "Open in new tab" button
- [ ] Create tabbed interface: Summary | Videos | Related Pages
- [ ] Add smooth tab transitions
- [ ] Handle empty states

**Developer B - Custom Search Integration**
- [ ] Create `api/customSearch.ts` utility
- [ ] Implement Google Custom Search API:
  ```typescript
  async function searchRelatedPages(query: string) {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?` +
      `key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}`
    );
    return response.json();
  }
  ```
- [ ] Set up Custom Search Engine at google.com/cse
- [ ] Generate good search queries from selected text
- [ ] Filter out current page from results
- [ ] Cache results

**End-of-Day**: Test all three features working together

---

#### **Days 6-7: Core Features & User Experience**

**Developer A - UI/UX Polish**
- [ ] Create settings panel:
  - Summary length preference
  - Dark/light mode toggle
  - Keyboard shortcut preferences
- [ ] Add keyboard shortcut (Alt+S for summarize)
- [ ] Implement history panel (last 10 summaries)
- [ ] Add loading animations
- [ ] Create onboarding tooltip
- [ ] Add empty states with helpful messages
- [ ] Test on 10+ different websites

**Developer B - "Explain" Feature**
- [ ] Add "Explain Like I'm 5" button
- [ ] Add "Technical Deep Dive" button
- [ ] Create different prompts for each:
  ```typescript
  const eli5Prompt = `Explain this like I'm 5 years old: ${text}`;
  const technicalPrompt = `Provide a detailed technical explanation: ${text}`;
  ```
- [ ] Implement streaming responses (show text as it generates)
- [ ] Add language detection
- [ ] Handle multi-language content
- [ ] Test with technical and non-technical content

**Weekend Checkpoint**: All core features should be working!

---

### **Week 2: Polish, Test, Deploy**

#### **Day 8: Error Handling & Edge Cases**

**Developer A - Robust Error Handling**
- [ ] Handle text selection edge cases:
  - Very long text (> 10,000 characters)
  - Special characters and emojis
  - Code snippets
  - Tables and structured content
- [ ] Add user-friendly error messages
- [ ] Implement retry logic for failed requests
- [ ] Add offline detection
- [ ] Test on dynamic websites (SPAs)

**Developer B - API Reliability**
- [ ] Add comprehensive error handling for all APIs
- [ ] Implement exponential backoff for retries
- [ ] Handle API quota exhaustion:
  ```typescript
  if (error.code === 429) {
    showMessage("Daily quota reached. Try again tomorrow!");
  }
  ```
- [ ] Add fallback messages when APIs fail
- [ ] Test with intentionally broken API keys
- [ ] Add timeout handling (30 second max)

---

#### **Day 9: Performance & Optimization**

**Developer A - Frontend Performance**
- [ ] Optimize bundle size:
  - Run `npm run build` and check size
  - Remove unused dependencies
  - Lazy load components
  - Target: < 500KB total
- [ ] Add React.memo for expensive components
- [ ] Implement debouncing for rapid selections
- [ ] Optimize re-renders
- [ ] Profile with Chrome DevTools

**Developer B - Data & Caching**
- [ ] Improve caching strategy:
  ```typescript
  // Cache structure
  {
    summaries: { [textHash]: { text, timestamp } },
    videos: { [query]: { results, timestamp } },
    pages: { [query]: { results, timestamp } }
  }
  ```
- [ ] Add cache expiration (summaries: 7 days, videos: 1 day)
- [ ] Implement cache size limits (max 100 items)
- [ ] Add "Clear cache" option in settings
- [ ] Test cache performance

---

#### **Day 10: Testing Day (Pair Programming)**

**Morning: Functional Testing (Together)**
- [ ] Test on 20+ diverse websites:
  - Wikipedia
  - Research papers (arXiv, PubMed)
  - News sites (NY Times, BBC)
  - Technical blogs (Medium, Dev.to)
  - Documentation sites
  - Social media
  - Reddit threads
  - Product pages
- [ ] Test with different text lengths
- [ ] Test multi-language content (Spanish, French, German, Japanese)
- [ ] Test all keyboard shortcuts
- [ ] Test all buttons and interactions

**Afternoon: Bug Fixing Sprint**
- [ ] Create shared bug list
- [ ] Prioritize: P0 (blocking) → P1 (important) → P2 (nice-to-fix)
- [ ] Divide and conquer bug fixes
- [ ] Re-test fixed bugs together

---

#### **Day 11: UI Polish & Accessibility**

**Developer A - Visual Design**
- [ ] Create professional icon set:
  - Design in Figma or use icon generator
  - Export: 16x16, 32x32, 48x48, 128x128
- [ ] Add smooth animations:
  - Side panel slide-in
  - Tab transitions
  - Button hover effects
  - Loading states
- [ ] Ensure consistent spacing
- [ ] Add visual feedback for all actions
- [ ] Take screenshots for Chrome Web Store

**Developer B - Accessibility**
- [ ] Add keyboard navigation for all features
- [ ] Add ARIA labels:
  ```tsx
  <button aria-label="Copy summary to clipboard">
  ```
- [ ] Ensure proper focus management
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Check color contrast (WCAG AA standard)
- [ ] Add alt text to all images
- [ ] Test with keyboard-only navigation

---

#### **Day 12: Settings & Preferences**

**Developer A - Settings UI**
- [ ] Create settings modal with tabs:
  - General (language, theme)
  - Preferences (summary length, auto-open)
  - About (version, credits)
- [ ] Add keyboard shortcut customization
- [ ] Create "Export settings" feature
- [ ] Add "Reset to defaults" button
- [ ] Style settings panel nicely

**Developer B - Settings Logic**
- [ ] Implement settings storage with `chrome.storage.sync`:
  ```typescript
  await chrome.storage.sync.set({ 
    theme: 'dark',
    summaryLength: 'medium',
    language: 'en'
  });
  ```
- [ ] Apply settings across all components
- [ ] Add settings migration for updates
- [ ] Add usage statistics:
  - Total summaries generated
  - Videos watched
  - Pages opened
- [ ] Sync settings across devices (Chrome sync)

---

#### **Day 13: Documentation & Store Prep**

**Developer A - Chrome Web Store Listing**
- [ ] Create developer account ($5 one-time fee)
- [ ] Write compelling description:
  ```
  Stella - AI-Powered Learning Assistant
  
  Instantly understand any text with AI summaries, 
  relevant videos, and deep explanations. Perfect for 
  students, researchers, and curious minds.
  ```
- [ ] Prepare screenshots (5-6 high-quality images)
- [ ] Create promotional tile (440x280)
- [ ] Record demo video (optional but recommended)
- [ ] Write privacy policy (use template from Chrome docs)
- [ ] List all permissions and explain why needed

**Developer B - Technical Documentation**
- [ ] Write comprehensive README:
  - What it does
  - How to install for development
  - How to build
  - Troubleshooting
- [ ] Document all API keys needed
- [ ] Create user guide with screenshots
- [ ] Write FAQ document
- [ ] Add license (MIT recommended)
- [ ] Document known limitations

**Together (Evening)**
- [ ] Review store listing together
- [ ] Review all documentation
- [ ] Create launch checklist

---

#### **Day 14: Launch Day 🚀**

**Morning: Final Testing (Both)**
- [ ] Fresh install test (uninstall, reinstall, test)
- [ ] Test in incognito mode
- [ ] Test with different Chrome versions
- [ ] Final bug sweep
- [ ] Performance check

**Afternoon: Deployment**

**Developer A - Build & Package**
- [ ] Create production `.env` with real API keys
- [ ] Run production build: `npm run build`
- [ ] Test production build locally
- [ ] Create manifest.json with proper version (1.0.0)
- [ ] Package as .zip: `cd dist && zip -r stella-v1.0.0.zip *`
- [ ] Verify .zip contents

**Developer B - Store Submission**
- [ ] Upload .zip to Chrome Web Store
- [ ] Fill in all store details
- [ ] Set pricing (free)
- [ ] Select distribution (public)
- [ ] Submit for review
- [ ] Monitor review status

**Together: Launch Preparation**
- [ ] Create GitHub repository (if not already)
- [ ] Push all code (remember .gitignore for API keys!)
- [ ] Tag release: `git tag v1.0.0`
- [ ] Write launch announcement
- [ ] Share with friends for initial testing
- [ ] Celebrate! 🎉

**Note**: Chrome Web Store review takes 1-3 days. Don't panic if it's not instant!

---

## Backend Learning Path (Optional - Post Launch)

If you want to add a backend layer later (for features like user accounts, analytics, or to hide API keys from tech-savvy users):

### Week 3-4: Learn Backend Gradually
1. **Start with Vercel Functions**:
   - Create a Next.js project
   - Add API routes (similar to React components)
   - Deploy with `vercel deploy`
   
2. **Move API calls server-side**:
   - Extension calls your Vercel API
   - Vercel API calls Gemini/YouTube/etc
   - Protects your API keys

3. **Add simple database**:
   - Use Vercel Postgres or Firebase Firestore
   - Store user preferences
   - Track usage analytics

### Learning Resources
- **Vercel Functions**: vercel.com/docs/functions
- **Firebase for frontend devs**: firebase.google.com/docs/web/setup
- **Next.js API routes**: nextjs.org/docs/api-routes/introduction

---

## Simplified Architecture (Direct API Calls)

```
┌─────────────────────────────────────┐
│         Chrome Extension            │
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │   Content   │  │  Side Panel  │ │
│  │   Script    │→ │   (React)    │ │
│  └─────────────┘  └──────┬───────┘ │
│                          │         │
│  ┌──────────────────────┘         │
│  │    Background Service Worker    │
│  │      (API Call Manager)         │
│  └──────────┬─────────┬────────┬──┘
│             │         │        │   │
└─────────────┼─────────┼────────┼───┘
              │         │        │
              ▼         ▼        ▼
         ┌─────────┐ ┌─────┐ ┌────────┐
         │ Gemini  │ │YouTube│ │Custom │
         │   API   │ │  API  │ │Search│
         └─────────┘ └─────┘ └────────┘
```

**Why This Works for Frontend Devs**:
- No server infrastructure to manage
- All code is JavaScript/TypeScript (familiar)
- Chrome extension environment is secure
- Can add backend later without rewriting

---

## Critical Rules for API Key Safety

### ⚠️ NEVER Commit API Keys to GitHub

**Before First Commit:**
```bash
# Create .env file
echo "VITE_GEMINI_API_KEY=your_key_here" > .env
echo "VITE_YOUTUBE_API_KEY=your_key_here" >> .env
echo "VITE_CUSTOM_SEARCH_KEY=your_key_here" >> .env

# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

**In Code:**
```typescript
// Access API keys
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

**For Production:**
- Use separate API keys for dev and production
- Set up API key restrictions in Google Cloud Console
- Limit to specific domains/IPs if possible

---

## Cost Management (Both Developers Should Monitor)

### Free Tier Limits
| Service | Free Limit | What Happens When Exceeded |
|---------|-----------|----------------------------|
| Gemini API | 15 RPM | Show "Please wait" message |
| YouTube API | 10,000 units/day | Show cached results |
| Custom Search | 100 queries/day | Disable related pages temporarily |

### Daily Monitoring Dashboard
Create a simple HTML page to check usage:
```typescript
// Track API calls in chrome.storage
await chrome.storage.local.get('apiUsage');
// Display: Today's calls, % of quota used
```

### If You Hit Limits
1. Implement aggressive caching
2. Add user rate limiting (10 requests/hour)
3. Consider adding backend with API key pooling (Week 3+)

---

## Realistic Expectations

### What You'll Definitely Achieve ✅
- Working Chrome extension with all core features
- Direct API integration (no backend needed initially)
- Professional UI with React
- Chrome Web Store submission
- Basic error handling and caching

### What Might Be Challenging ⚠️
- Handling all edge cases perfectly
- Optimizing for every website
- Multi-language accuracy
- Advanced caching strategies

### What to Defer to v2.0 📅
- User accounts and authentication
- Advanced analytics
- Team/sharing features
- PDF support
- Firefox/Edge versions
- Backend infrastructure

---

## Emergency Protocols

### If Completely Stuck on APIs (Budget 4 Hours Max)
1. **Hour 1-2**: Google the error, read API docs
2. **Hour 3**: Post question on Stack Overflow
3. **Hour 4**: Ask ChatGPT/Claude to debug your code
4. **After 4 hours**: Skip feature, mark as "TODO v2.0"

### Pair Programming Schedule (When Stuck)
- Set timer for 20 minutes
- Switch driver/navigator roles
- One person codes, one person researches docs
- Take 5-minute break after each session

### Daily Minimum Viable Progress
- Day must end with something working
- "Working" = testable in the browser
- Don't let perfect be the enemy of done

---

## Success Metrics (Frontend Dev Friendly)

### Week 1 Goals
- [ ] Extension installs and opens
- [ ] Can select text and see side panel
- [ ] At least 1 API integration working (Gemini)
- [ ] Basic React UI renders
- [ ] No console errors in production build

### Week 2 Goals  
- [ ] All 4 features functional (summary, videos, pages, explain)
- [ ] Settings work and persist
- [ ] Tested on 10+ websites
- [ ] Production build < 500KB
- [ ] Submitted to Chrome Web Store

### You're On Track If...
- End of Day 3: Summarization works end-to-end
- End of Day 7: All APIs integrated
- End of Day 10: All major bugs fixed
- End of Day 14: Submitted to store

---

## Learning Resources for Frontend Devs

### Must-Watch (First 3 Days)
1. **Chrome Extension Tutorial** - Web Dev Simplified (45 min)
   - youtube.com/watch?v=0n809nd4Zu4
2. **Gemini API Quickstart** - Google AI (20 min)
   - ai.google.dev/tutorials/get_started_web
3. **Manifest V3 Migration** - Chrome Developers (30 min)
   - developer.chrome.com/docs/extensions/mv3/intro/

### Reference Documentation
- Chrome Extension API: developer.chrome.com/docs/extensions/reference
- Gemini API: ai.google.dev/api/rest
- YouTube Data API: developers.google.com/youtube/v3
- React TypeScript: react-typescript-cheatsheet.netlify.app

### Community Help
- r/chrome_extensions (Reddit)
- Chrome Extension Discord
- Stack Overflow (tag: google-chrome-extension)

---

## Final Pep Talk 💪

**You Got This!** Here's why:

1. **You Know React**: 80% of this project is React components
2. **APIs are Just fetch()**: You've done API calls before
3. **Chrome Extension is Just a Website**: With superpowers
4. **You Have Each Other**: Two heads better than one
5. **Google's APIs are Well-Documented**: Designed for beginners

**The Backend Myth**: You don't need to be a "backend developer" for this project. You're making HTTP requests - you do this already! The only difference is you're calling Google's servers instead of your own.

**When in Doubt**: Build the simplest thing that works, then improve it. A working basic feature beats a perfect feature that's half-done.

**Remember**: Even if you don't finish everything, a partially working extension is a huge achievement and great for your portfolio!

---

## Post-Launch (Week 3+)

### Immediate Next Steps
1. **Monitor**: Check Chrome Web Store for reviews/feedback
2. **Support**: Set up email for bug reports
3. **Analytics**: Add basic usage tracking (how often features used)
4. **Iterate**: Fix bugs, improve based on feedback

### Future Features (Learn Backend When You Need It)
- User accounts (Firebase Auth - frontend friendly!)
- Sync across devices (Firestore - like React state but in cloud)
- Premium features (Stripe - just API calls)
- Team sharing (Start with simple JSON export/import)

### Backend Learning When Ready
- Start with **Firebase** (designed for frontend devs)
- Then try **Vercel Functions** (like React components)
- Finally **Google Cloud Functions** (if you need it)

---

## Quick Start Commands

```bash
# Initial Setup (Day 1)
npm create vite@latest stella-extension -- --template react-ts
cd stella-extension
npm install
npm install -D @types/chrome tailwindcss postcss autoprefixer
npm install lucide-react  # Icons

# Create .env file (NEVER COMMIT THIS)
cat > .env << EOL
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_YOUTUBE_API_KEY=your_youtube_key_here
VITE_CUSTOM_SEARCH_KEY=your_search_key_here
VITE_SEARCH_ENGINE_ID=your_search_engine_id_here
EOL

# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Development
npm run dev

# Build for production
npm run build

# Package for Chrome Web Store
cd dist
zip -r ../stella-extension-v1.0.0.zip .
cd ..

# Load unpacked extension in Chrome
# 1. Go to chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the "dist" folder
```

---

## You're Ready! 🚀

This plan is specifically designed for frontend developers learning backend concepts gradually. Start with direct API calls, get something working, then optimize and learn as you go.

**Remember**: Done is better than perfect. Ship v1.0, then improve in v1.1, v1.2, etc.

Good luck building Stella! 🌟