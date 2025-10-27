# Stella: The AI-Powered Study Assistant

![Stella Logo](https://raw.githubusercontent.com/your-username/Stella/main/assets/icon_128.png)

### TL;DR: Too Long; Didn't Read?

**Stella** is a Chrome extension that transforms how students and researchers learn by providing an AI-powered study assistant directly in their browser. By simply highlighting text on any webpage, users can instantly access an AI-generated summary, find relevant YouTube videos, request deeper explanations, and discover related web pages—all within a convenient and non-intrusive side panel.

## The Problem: Information Overload

Students and researchers often face the challenge of efficiently processing and understanding large volumes of web content. The manual process of summarizing text, searching for supplemental videos, or finding additional research is disruptive to focus and hinders productive learning.

## The Solution: Stella

**Stella** acts as a guide in a sea of information. The extension uses **Google Gemini AI** to streamline learning. By searching or highlighting text, Stella provides learning tools in a side panel to help users focus on their research.

## Key Features

*   **Instant AI Summary:** Get a concise, AI-generated summary of any selected text.
*   **Multi-language Support:** Translate the summary and explanations into your desired language.
*   **Related Video Search:** Find and preview relevant YouTube videos with AI-powered summaries.
*   **Request More Info:** Ask the AI for deeper explanations or specific details about the selected topic, including potential links to Google Scholar papers.
*   **Related Pages:** Discover other high-quality web pages related to your selected text.
*   **Intuitive Side Panel:** All information is organized in a clean, persistent side panel, keeping the user focused on their research.

## Technical Details

**Built for the Google Chrome Built-in AI Challenge 2025**

Stella is a serverless Chrome extension powered by Google Gemini AI.

*   **Frontend:** React + TypeScript + Vite
*   **Extension:** Chrome Manifest V3 with service worker
*   **APIs:**
    *   Google Gemini API for AI-powered answers and explanations
    *   YouTube Data API v3 for finding relevant video content
    *   Google Custom Search API for related web pages
*   **Architecture:**
    *   No backend server required - all API calls made directly from extension
    *   Environment variables for secure API key management
    *   Side panel UI for non-intrusive user experience

## How to Use

1.  **Install the extension** from the Chrome Web Store (after it's published).
2.  **Highlight** any text on a webpage that you want to understand better.
3.  **Click** the magnifying glass icon that appears next to your selection.
4.  **Explore** the AI-generated summary, videos, and links in the side panel.

## Installation for Developers

### Prerequisites
- Node.js 16+ and npm
- Google Cloud account with API keys configured

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/StellaGoogleHackathon.git
    cd StellaGoogleHackathon/extension
    ```

2.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
    Then edit `.env` and add your API keys:
    - `VITE_GEMINI_API_KEY` - Get from https://aistudio.google.com/app/apikey
    - `VITE_YOUTUBE_API_KEY` - Get from Google Cloud Console
    - `VITE_CUSTOM_SEARCH_API_KEY` - Get from Google Cloud Console
    - `VITE_CUSTOM_SEARCH_ENGINE_ID` - Create at https://programmablesearchengine.google.com/

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Build the extension:**
    ```bash
    npm run build
    ```

5.  **Load in Chrome:**
    *   Navigate to `chrome://extensions`
    *   Toggle **Developer Mode** on
    *   Click **"Load unpacked"**
    *   Select the `extension/dist` directory

6.  **Start using Stella!**

### Development Mode
For hot-reload during development:
```bash
npm run dev
```

## Development Roadmap

*   **Days 1-3:** Core development (Side Panel UI, Content Script, Manifest V3).
*   **Days 4-6:** Feature completion (Gemini API integration, YouTube API).
*   **Days 7-9:** Testing, polish, and asset creation.
*   **Days 10-12:** Submission and launch.

## Meet the Team

*   **Developer A (Your Name):** Front-End, UX & Assets
*   **Developer B (Your Teammate's Name):** Back-End, Security & Compliance

## License

This project is licensed under the MIT License.

## Acknowledgements

*   Built for the **Google Chrome Built-in AI Challenge 2025**.
*   Developed with the support of the Devpost community.

## Project Structure

```
StellaGoogleHackathon/
├── extension/                    # Chrome extension source
│   ├── src/
│   │   ├── services/
│   │   │   ├── gemini.ts        # Gemini AI API integration
│   │   │   ├── youtube.ts       # YouTube Data API integration
│   │   │   └── customSearch.ts  # Google Custom Search integration
│   │   ├── background/
│   │   │   └── service-worker.ts # Chrome extension service worker
│   │   ├── types/
│   │   │   └── api.ts           # TypeScript type definitions
│   │   ├── App.tsx              # Main React application
│   │   └── main.tsx             # Entry point
│   ├── icons/                   # Extension icons
│   ├── manifest.json            # Chrome extension manifest
│   ├── .env.example             # Template for environment variables
│   └── package.json             # Dependencies and scripts
├── .gitignore                   # Git ignore rules (protects API keys)
└── README.md                    # This file
```

## Security Notes

**IMPORTANT:** This repository uses environment variables for API keys.

- Never commit `.env` files with real API keys
- Use `.env.example` as a template
- Rotate any exposed API keys immediately
- Set up API key restrictions in Google Cloud Console
