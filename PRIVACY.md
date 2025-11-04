# Privacy Policy for Stella AI Assistant

**Last Updated:** November 1, 2025
**Effective Date:** November 1, 2025

## Introduction

Stella AI Assistant ("Stella AI", "we", "our", or "the Extension") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Chrome browser extension.

**Our Core Privacy Commitment:**
- We collect minimal data, only when you explicitly trigger the extension
- We do not track your browsing activity
- We do not sell or share your data with third parties (except necessary API providers)
- We do not store personal information on external servers
- All data processing happens locally or through secure Google APIs

## What Information We Collect

### 1. Website Content (User-Initiated Only)

Stella AI collects website content **ONLY** when you explicitly activate the extension by:
- Right-clicking on selected text and choosing "Search with Stella AI"
- Clicking the floating action button after text selection

**What we collect when you activate Stella AI:**
- **Selected Text**: The specific text you highlighted on the webpage
- **Page Context**: Limited contextual information to improve AI summaries:
  - Page title (from `<title>` tag)
  - Meta description (from `<meta>` tags)
  - Nearest heading to your selection (H1-H6 tags)
  - Surrounding text (up to 500 characters before and after your selection)
  - Main content excerpt (limited to ~2KB)
  - Page URL

**Total data size**: Maximum ~6KB per request (approximately 1.5 pages of text)

**Important:** We do NOT collect:
- Browsing history
- Cookies or login credentials
- Personal information (names, emails, addresses)
- Financial information
- Health information
- Form data or user inputs (except selected text when you activate Stella AI)
- Data from pages you don't explicitly query

### 2. Technical Information

We do NOT collect any analytics, telemetry, or usage statistics. The extension does not use Google Analytics or any tracking services.

### 3. Temporary Local Storage

The extension temporarily stores your query and page context in Chrome's local storage API for 5 seconds maximum to coordinate between components. This data is:
- Stored only on your device (never sent to our servers - we don't have any servers)
- Automatically deleted after 5 seconds
- Never transmitted to any third party except Google APIs (see below)

## How We Use Your Information

The selected text and page context you provide are used exclusively for:

1. **AI-Powered Summaries**: Sending your selected text and page context to Google Gemini API to generate intelligent summaries
2. **Video Search**: Generating optimized search queries to find relevant educational videos on YouTube
3. **Web Search**: Finding related articles and resources using Google Custom Search API

**We do NOT use your data for:**
- Advertising or marketing
- User profiling or behavioral tracking
- Training AI models (Google may use data per their policies - see Third-Party Services)
- Selling or sharing with data brokers
- Any purpose other than providing the immediate service you requested

## Third-Party Services

Stella AI uses the following Google services to provide functionality. Your selected text and page context are transmitted to these services when you activate the extension:

### 1. Google Gemini API (AI Summaries)
- **Purpose**: Generate context-aware summaries and optimized search queries
- **Data Sent**: Selected text + page context (~6KB max)
- **Privacy Policy**: [Google AI Privacy Policy](https://policies.google.com/privacy)
- **Data Use**: Subject to Google's Generative AI Prohibited Use Policy

### 2. YouTube Data API v3 (Video Search)
- **Purpose**: Find relevant educational videos
- **Data Sent**: AI-generated search query (derived from your selected text)
- **Privacy Policy**: [Google Privacy Policy](https://policies.google.com/privacy)
- **API Terms**: [YouTube API Services Terms](https://developers.google.com/youtube/terms/api-services-terms-of-service)

### 3. Google Custom Search API (Web Search)
- **Purpose**: Find related articles and web pages
- **Data Sent**: AI-generated search query (derived from your selected text)
- **Privacy Policy**: [Google Privacy Policy](https://policies.google.com/privacy)

**Important Notes:**
- We do NOT control how Google processes data sent to their APIs
- Google's privacy policies and terms of service apply to their services
- We recommend reviewing Google's privacy policies linked above
- We do not have any backend servers - all data goes directly from your browser to Google APIs

## Data Storage and Retention

### Local Storage (Your Device)
- **Duration**: Maximum 5 seconds
- **Purpose**: Coordinate between extension components
- **Deletion**: Automatically purged after use
- **Location**: Chrome's local storage on your device only

### API Providers (Google)
We do not control data retention by Google APIs. Please refer to:
- [Google Cloud Platform Data Processing Terms](https://cloud.google.com/terms/data-processing-addendum)
- [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)

### Our Servers
**We do not operate any servers.** All processing happens locally in your browser or through Google APIs.

## Data Sharing and Disclosure

We do NOT sell, trade, or transfer your data to third parties, except:

1. **Google APIs** (as described above) - necessary to provide the service
2. **Legal Requirements** - if required by law, subpoena, or court order (though we have no data to provide)

We do not share data with:
- Advertisers
- Marketing companies
- Data brokers
- Analytics providers
- Social media platforms
- Any other third parties

## User Control and Choices

You have complete control over Stella AI:

### How to Control Data Collection
- **Manual Activation Only**: The extension only activates when you explicitly trigger it
- **Per-Use Basis**: Each summary request is independent - no persistent tracking
- **No Background Activity**: The extension does not run or collect data in the background

### How to Stop Using Stella AI
1. **Uninstall**: Remove the extension from Chrome at any time via `chrome://extensions/`
2. **Disable**: Temporarily disable without uninstalling
3. **Selective Use**: Only activate on text you want summarized

### Your Rights
- **Access**: All data processing happens in real-time - no stored data to access
- **Deletion**: Uninstalling the extension removes all local data
- **Opt-Out**: Simply don't activate the extension on pages you want to keep private

## Security Measures

We implement industry-standard security practices:

1. **HTTPS Only**: All API communications use encrypted HTTPS
2. **No External Servers**: No data stored on servers we control (we have none)
3. **Minimal Permissions**: Extension requests only essential Chrome permissions
4. **Local Processing**: Context extraction happens entirely in your browser
5. **Secure API Keys**: API keys are stored as environment variables, never in code
6. **Content Security Policy**: Strict CSP headers in manifest.json
7. **No Remote Code**: Extension does not load remote JavaScript or resources

## Chrome Permissions Explained

Stella AI requests the following Chrome permissions:

### 1. `sidePanel`
- **Why**: Display the AI assistant interface in Chrome's side panel
- **Privacy Impact**: No data access - UI display only

### 2. `contextMenus`
- **Why**: Add "Search with Stella AI" option to right-click menu
- **Privacy Impact**: No data access - menu item only

### 3. `activeTab`
- **Why**: Extract page context (title, headings, surrounding text) when you activate the extension
- **Privacy Impact**: Only accesses the active tab, only when you trigger it
- **Data Collected**: Page context as described in "What Information We Collect"

### 4. `storage`
- **Why**: Temporarily store your query (max 5 seconds) to coordinate between components
- **Privacy Impact**: Local storage only, auto-deleted
- **No Cloud Sync**: Does not use Chrome Sync storage

### 5. `host_permissions` (`<all_urls>`)
- **Why**: Allow you to use Stella AI on any website you choose
- **Privacy Impact**: Permission to access pages, but only when you activate the extension
- **No Background Access**: Does not read pages unless you explicitly trigger the extension

## Children's Privacy

Stella AI is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has used this extension, please contact us at the email below.

## Changes to This Privacy Policy

We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the extension after changes constitutes acceptance of the updated policy.

**How we notify you:**
- Updated date at the top of this document
- For material changes: announcement in the Chrome Web Store listing

## Data Processing for EU/UK Users (GDPR Compliance)

If you are in the European Union or United Kingdom:

### Legal Basis for Processing
- **Consent**: By activating the extension, you consent to data processing
- **Legitimate Interest**: Providing the AI summary service you requested

### Your GDPR Rights
- **Right to Access**: Request information about data processing (none stored long-term)
- **Right to Deletion**: Uninstall the extension to remove all local data
- **Right to Object**: Don't activate the extension on specific content
- **Right to Data Portability**: Not applicable (no stored data)

### Data Transfers
Data is transmitted to Google Cloud services, which comply with:
- EU-US Data Privacy Framework
- Standard Contractual Clauses (SCCs)
- [Google Cloud GDPR commitments](https://cloud.google.com/privacy/gdpr)

## California Privacy Rights (CCPA/CPRA)

If you are a California resident:

### Your CCPA Rights
- **Right to Know**: We collect website content only when you activate the extension
- **Right to Delete**: Uninstall the extension to delete all local data
- **Right to Opt-Out of Sale**: We do NOT sell your data (never have, never will)
- **Right to Non-Discrimination**: N/A - we don't differentiate based on privacy choices

### Categories of Data (CCPA Classification)
- **Internet Activity**: Selected text and page context (user-initiated only)
- **Commercial Information**: None
- **Biometric Information**: None
- **Geolocation**: None
- **Sensitive Personal Information**: None

## Contact Information

If you have questions, concerns, or requests regarding this Privacy Policy or your data:

**Email**: samarthgulati556@gmail.com
**GitHub Issues**: [https://github.com/samarth777/StellaGoogleHackathon/issues](https://github.com/samarth777/StellaGoogleHackathon/issues)
**Response Time**: We aim to respond within 7 business days

## Open Source Transparency

Stella AI is open source software licensed under the MIT License. You can:
- Review the complete source code: [https://github.com/samarth777/StellaGoogleHackathon](https://github.com/samarth777/StellaGoogleHackathon)
- Verify our privacy claims by inspecting the code
- Submit privacy-related issues or concerns on GitHub

## Compliance Certifications

This extension complies with:
- ✅ **Chrome Web Store Developer Program Policies**
- ✅ **Google API Services User Data Policy**
- ✅ **EU General Data Protection Regulation (GDPR)**
- ✅ **California Consumer Privacy Act (CCPA/CPRA)**
- ✅ **Chrome Extension Manifest V3 Security Standards**

---

**Summary**: Stella AI respects your privacy. We collect only the text you select when you activate the extension, use it solely to provide AI summaries and search results via Google APIs, store nothing long-term, and never sell your data. You have complete control - the extension only works when you tell it to.

If you have any concerns about privacy, please don't hesitate to contact us or review our open source code.
