# Stella: The AI-Powered Study Assistant

![Stella Logo](https://raw.githubusercontent.com/your-username/Stella/main/assets/icon_128.png)

### TL;DR: Too Long; Didn't Read?

**Stella** is a Chrome extension that transforms how students and researchers learn by providing an AI-powered study assistant directly in their browser. By simply highlighting text on any webpage, users can instantly access an AI-generated summary, find relevant YouTube videos, request deeper explanations, and discover related web pages—all within a convenient and non-intrusive side panel.

## The Problem: Information Overload

Students and researchers often face the challenge of efficiently processing and understanding large volumes of web content. The manual process of summarizing text, searching for supplemental videos, or finding additional research is disruptive to focus and hinders productive learning.

## The Solution: Stella

**Stella** acts as a guide in a sea of information. The extension uses advanced on-device AI, including the **Gemini Nano** model, to streamline learning. By highlighting text, Stella provides learning tools in a side panel to help users focus on their research.

## Key Features

*   **Instant AI Summary:** Get a concise, AI-generated summary of any selected text.
*   **Multi-language Support:** Translate the summary and explanations into your desired language.
*   **Related Video Search:** Find and preview relevant YouTube videos with AI-powered summaries.
*   **Request More Info:** Ask the AI for deeper explanations or specific details about the selected topic, including potential links to Google Scholar papers.
*   **Related Pages:** Discover other high-quality web pages related to your selected text.
*   **Intuitive Side Panel:** All information is organized in a clean, persistent side panel, keeping the user focused on their research.

## Technical Details

**Built for the Google Chrome Built-in AI Challenge 2025**

Stella is powered by the latest on-device AI technology available through the Chrome platform.

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend:** Service Worker managing API calls.
*   **APIs:**
    *   Google Gemini API (via Prompt API) for summarization, translation, and extended explanations.
    *   YouTube Data API for finding and fetching video content.
*   **Architecture:** Manifest V3 for a secure and performant extension.

## How to Use

1.  **Install the extension** from the Chrome Web Store (after it's published).
2.  **Highlight** any text on a webpage that you want to understand better.
3.  **Click** the magnifying glass icon that appears next to your selection.
4.  **Explore** the AI-generated summary, videos, and links in the side panel.

## Installation for Developers

If you want to contribute or test the extension during the hackathon:

1.  **Clone the repository:**
    `git clone https://github.com/your-username/Stella.git`
2.  **Enable Developer Mode** in Chrome:
    *   Navigate to `chrome://extensions`.
    *   Toggle **Developer Mode** on.
3.  **Load the extension:**
    *   Click **"Load unpacked"**.
    *   Select the `Stella` directory.
4.  **Ensure AI Flags are Enabled** in Chrome Canary:
    *   Visit `chrome://flags`.
    *   Search for and enable **"Prompt API for Gemini Nano"**.
5.  **Use** the extension on any webpage!

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

---

STRUCTURE:

Stella/
├── assets/
│   ├── icon_128.png        # The 128x128 pixel extension icon for store listing.
│   ├── icon_48.png         # The 48x48 pixel icon for the browser toolbar.
│   └── trigger_icon.png    # The small, temporary icon that appears on text selection.
├── css/
│   ├── side_panel.css      # The stylesheet for the side panel's user interface.
│   └── content_styles.css  # Styles for the trigger icon and any other injected elements.
├── html/
│   └── side_panel.html     # The HTML page for the side panel interface.
├── js/
│   ├── background.js       # The service worker managing events, AI calls, and APIs.
│   ├── content.js          # The script injected into web pages to detect selections.
│   └── side_panel.js       # The script for the side panel's UI logic.
├── manifest.json           # The core configuration file for the extension.
└── README.md               # The project description and instructions.
