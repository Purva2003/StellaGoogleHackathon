import { useState } from "react";
import "./App.css";
import { searchVertexAI } from "./services/vertexAI";
import { searchYouTube } from "./services/youtube";
import { searchCustomSearch } from "./services/customSearch";
import type { SearchResults } from "./types/api";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const searchResults: SearchResults = {
      vertexAI: null,
      youtube: [],
      customSearch: [],
      errors: {},
    };

    // Call all three APIs in parallel
    const [vertexAIResult, youtubeResult, customSearchResult] =
      await Promise.allSettled([
        searchVertexAI(query),
        searchYouTube(query),
        searchCustomSearch(query),
      ]);

    // Process Vertex AI results
    if (vertexAIResult.status === "fulfilled") {
      searchResults.vertexAI = vertexAIResult.value;
    } else {
      searchResults.errors.vertexAI = vertexAIResult.reason.message;
    }

    // Process YouTube results
    if (youtubeResult.status === "fulfilled") {
      searchResults.youtube = youtubeResult.value;
    } else {
      searchResults.errors.youtube = youtubeResult.reason.message;
    }

    // Process Custom Search results
    if (customSearchResult.status === "fulfilled") {
      searchResults.customSearch = customSearchResult.value;
    } else {
      searchResults.errors.customSearch = customSearchResult.reason.message;
    }

    setResults(searchResults);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Stella AI Assistant</h1>
        <p>Search across Vertex AI, YouTube, and the Web</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Enter your search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching across all sources...</p>
        </div>
      )}

      {results && !loading && (
        <div className="results-container">
          {/* Vertex AI Results */}
          <section className="result-section">
            <h2>AI Answer (Vertex AI)</h2>
            {results.errors.vertexAI ? (
              <div className="error">Error: {results.errors.vertexAI}</div>
            ) : results.vertexAI ? (
              <div className="ai-answer">{results.vertexAI}</div>
            ) : (
              <div className="no-results">No response</div>
            )}
          </section>

          {/* YouTube Results */}
          <section className="result-section">
            <h2>YouTube Videos</h2>
            {results.errors.youtube ? (
              <div className="error">Error: {results.errors.youtube}</div>
            ) : results.youtube.length > 0 ? (
              <div className="youtube-results">
                {results.youtube.map((video) => (
                  <div key={video.id.videoId} className="youtube-item">
                    <img
                      src={
                        video.snippet.thumbnails.medium?.url ||
                        video.snippet.thumbnails.default.url
                      }
                      alt={video.snippet.title}
                      className="thumbnail"
                    />
                    <div className="video-info">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-title"
                      >
                        {video.snippet.title}
                      </a>
                      <p className="channel-name">
                        {video.snippet.channelTitle}
                      </p>
                      <p className="video-description">
                        {video.snippet.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">No videos found</div>
            )}
          </section>

          {/* Custom Search Results */}
          <section className="result-section">
            <h2>Web Results</h2>
            {results.errors.customSearch ? (
              <div className="error">Error: {results.errors.customSearch}</div>
            ) : results.customSearch.length > 0 ? (
              <div className="search-results">
                {results.customSearch.map((item, index) => (
                  <div key={index} className="search-item">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="search-title"
                    >
                      {item.title}
                    </a>
                    <p className="search-url">{item.displayLink}</p>
                    <p className="search-snippet">{item.snippet}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">No results found</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
