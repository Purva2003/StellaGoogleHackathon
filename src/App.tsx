import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import SidePanel from "./components/SidePanel/SidePanel";
import SearchBar from "./components/SearchBar/SearchBar";
import AIAnswer from "./components/ResultsSection/AIAnswer";
import YouTubeResults from "./components/ResultsSection/YouTubeResults";
import SearchResults from "./components/ResultsSection/SearchResults";
import type { VideoData } from "./components/VideoCard/VideoCard";
import type { SearchResultData } from "./components/ResultsSection/SearchResults";
import type { EnrichedSelectionData } from "./types/context";

// Import API utilities
import { summarizeText, summarizeWithContext, generateSmartSearchQueries } from "./api/gemini";
import { searchVideos, generateVideoSearchQuery } from "./api/youtube";
import { searchRelatedPages, generateSearchQuery } from "./api/customSearch";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");
  const [youtubeVideos, setYoutubeVideos] = useState<VideoData[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultData[]>([]);
  const [error, setError] = useState<string>("");
  const [currentQuery, setCurrentQuery] = useState<string>("");

  // Check for stored search query or enriched selection data on mount
  useEffect(() => {
    const checkForStoredQuery = async () => {
      try {
        // First check for enriched selection data (with context)
        const enrichedResult = await chrome.storage.local.get([
          "enrichedSelectionData",
          "timestamp",
        ]);

        if (enrichedResult.enrichedSelectionData) {
          const enrichedData: EnrichedSelectionData =
            enrichedResult.enrichedSelectionData;
          const timestamp = enrichedResult.timestamp || 0;

          // Only use data from the last 5 seconds (to avoid stale queries)
          const age = Date.now() - timestamp;
          if (age < 5000) {
            // console.log('Found enriched selection data with context:', enrichedData);

            // Clear the stored data to prevent re-use
            await chrome.storage.local.remove([
              "enrichedSelectionData",
              "timestamp",
            ]);

            // Trigger search with context-aware summary
            handleSearchWithContext(enrichedData);
          } else {
            console.log("Enriched data too old, ignoring");
            await chrome.storage.local.remove([
              "enrichedSelectionData",
              "timestamp",
            ]);
          }
          return; // Exit early if enriched data was found
        }

        // Fallback: check for basic search query (legacy support)
        const result = await chrome.storage.local.get([
          "searchQuery",
          "timestamp",
        ]);

        if (result.searchQuery) {
          const query = result.searchQuery;
          const timestamp = result.timestamp || 0;

          // Only use queries from the last 5 seconds (to avoid stale queries)
          const age = Date.now() - timestamp;
          if (age < 5000) {
            console.log("Found basic stored query:", query);

            // Clear the stored query to prevent re-use
            await chrome.storage.local.remove(["searchQuery", "timestamp"]);

            // Automatically trigger search
            handleSearch(query);
          } else {
            console.log("Stored query too old, ignoring");
            await chrome.storage.local.remove(["searchQuery", "timestamp"]);
          }
        }
      } catch (err) {
        console.error("Error checking stored query:", err);
      }
    };

    checkForStoredQuery();
  }, []); // Empty dependency array = run once on mount

  // Handle search with context-aware summarization
  const handleSearchWithContext = async (
    enrichedData: EnrichedSelectionData
  ) => {
    setIsLoading(true);
    setError("");
    setCurrentQuery(enrichedData.selectionText);

    try {
      // Step 1: Generate AI-optimized search queries (fast, ~0.5-1s)
      let youtubeQuery = generateVideoSearchQuery(enrichedData.selectionText); // Fallback
      let googleQuery = generateSearchQuery(enrichedData.selectionText);       // Fallback

      try {
        const smartQueries = await generateSmartSearchQueries(
          enrichedData.selectionText,
          enrichedData.pageContext
        );
        youtubeQuery = smartQueries.youtubeQuery;
        googleQuery = smartQueries.googleQuery;
        console.log('✅ Using AI-generated queries:', smartQueries);
      } catch (queryError) {
        console.warn('⚠️ Smart query generation failed, using fallback:', queryError);
        // Continue with fallback queries (already set above)
      }

      // Step 2: Run all searches in parallel with optimized queries
      const [summary, videos, webResults] = await Promise.allSettled([
        // 1. Get context-aware AI summary from Gemini
        summarizeWithContext(
          enrichedData.selectionText,
          enrichedData.pageContext
        ),

        // 2. Search YouTube videos with AI-optimized query
        searchVideos(youtubeQuery, 5),

        // 3. Search related web pages with AI-optimized query
        searchRelatedPages(googleQuery, 5),
      ]);

      // Handle AI summary
      if (summary.status === "fulfilled") {
        setAiAnswer(summary.value);
      } else {
        console.error("Context-aware AI Summary failed:", summary.reason);
        const errorMsg =
          summary.reason instanceof Error
            ? summary.reason.message
            : "Unknown error";
        setAiAnswer(`Unable to generate AI summary: ${errorMsg}`);
      }

      // Handle YouTube results
      if (videos.status === "fulfilled") {
        setYoutubeVideos(videos.value);
      } else {
        console.error("YouTube search failed:", videos.reason);
        setYoutubeVideos([]);
      }

      // Handle web search results
      if (webResults.status === "fulfilled") {
        setSearchResults(webResults.value);
      } else {
        console.error("Web search failed:", webResults.reason);
        setSearchResults([]);
      }

      // Check if all requests failed
      if (
        summary.status === "rejected" &&
        videos.status === "rejected" &&
        webResults.status === "rejected"
      ) {
        setError(
          "All API requests failed. Please check your API keys and try again."
        );
      }
    } catch (err) {
      console.error("Search with context error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setAiAnswer("");
      setYoutubeVideos([]);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError("");
    setCurrentQuery(query);

    try {
      // Run all API calls in parallel for better performance
      const [summary, videos, webResults] = await Promise.allSettled([
        // 1. Get AI summary from Gemini
        summarizeText(query),

        // 2. Search YouTube videos
        searchVideos(generateVideoSearchQuery(query), 5),

        // 3. Search related web pages
        searchRelatedPages(generateSearchQuery(query), 5),
      ]);

      // Handle AI summary
      if (summary.status === "fulfilled") {
        setAiAnswer(summary.value);
      } else {
        console.error("AI Summary failed:", summary.reason);
        const errorMsg =
          summary.reason instanceof Error
            ? summary.reason.message
            : "Unknown error";
        setAiAnswer(`Unable to generate AI summary: ${errorMsg}`);
      }

      // Handle YouTube results
      if (videos.status === "fulfilled") {
        setYoutubeVideos(videos.value);
      } else {
        console.error("YouTube search failed:", videos.reason);
        setYoutubeVideos([]);
      }

      // Handle web search results
      if (webResults.status === "fulfilled") {
        setSearchResults(webResults.value);
      } else {
        console.error("Web search failed:", webResults.reason);
        setSearchResults([]);
      }

      // Check if all requests failed
      if (
        summary.status === "rejected" &&
        videos.status === "rejected" &&
        webResults.status === "rejected"
      ) {
        setError(
          "All API requests failed. Please check your API keys and try again."
        );
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setAiAnswer("");
      setYoutubeVideos([]);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <SidePanel>
        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          initialQuery={currentQuery}
        />

        {error && !isLoading && (
          <div
            className="error-container content-section fade-in"
            style={{
              padding: "1rem",
              background: "rgba(255, 0, 0, 0.1)",
              border: "1px solid rgba(255, 0, 0, 0.3)",
              borderRadius: "8px",
              color: "#ff6b6b",
              marginBottom: "1rem",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading && (
          <div className="loading-container fade-in">
            <div
              className="spinner"
              style={{ width: "48px", height: "48px" }}
            ></div>
            <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
              Searching with Stella AI...
            </p>
          </div>
        )}

        {!isLoading && aiAnswer && (
          <>
            <AIAnswer answer={aiAnswer} />
            <YouTubeResults videos={youtubeVideos} />
            <SearchResults results={searchResults} />
          </>
        )}

        {!isLoading && !aiAnswer && (
          <div className="welcome-container content-section holographic-texture fade-in-up">
            <div className="welcome-content">
              <div className="welcome-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <path
                    d="M32 0L39.36 24.64L64 32L39.36 39.36L32 64L24.64 39.36L0 32L24.64 24.64L32 0Z"
                    fill="url(#welcomeGradient)"
                  />
                  <defs>
                    <linearGradient
                      id="welcomeGradient"
                      x1="0"
                      y1="0"
                      x2="64"
                      y2="64"
                    >
                      <stop offset="0%" stopColor="#00b4ff" />
                      <stop offset="100%" stopColor="#003558" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2
                style={{
                  fontSize: "1.75rem",
                  marginBottom: "0.5rem",
                  color: "var(--text-primary)",
                }}
              >
                Welcome to Stella AI
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "var(--text-secondary)",
                  marginBottom: "1.5rem",
                }}
              >
                Your intelligent search companion powered by advanced AI
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="var(--color-bright-blue)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>AI-powered answers</span>
                </div>
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="var(--color-bright-blue)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Curated YouTube videos</span>
                </div>
                <div className="feature-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="var(--color-bright-blue)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Relevant web results</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}

export default App;
