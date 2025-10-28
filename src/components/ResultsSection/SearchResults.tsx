import React from 'react';
import './SearchResults.css';

export interface SearchResultData {
  id: string;
  title: string;
  url: string;
  snippet: string;
  displayUrl?: string;
}

interface SearchResultsProps {
  results: SearchResultData[];
  isLoading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="search-results-container content-section holographic-texture">
        <div className="section-header">
          <div className="section-icon search-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="var(--color-bright-blue)" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="var(--color-bright-blue)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="section-title">Web Results</h2>
        </div>

        <div className="search-results-list">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="search-result-skeleton">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) return null;

  const handleResultClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="search-results-container content-section holographic-texture fade-in-up">
      <div className="section-header">
        <div className="section-icon search-icon glow-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="var(--color-bright-blue)" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="var(--color-bright-blue)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="section-title">Web Results</h2>
        <span className="results-count">{results.length} results</span>
      </div>

      <div className="search-results-list">
        {results.map((result, index) => (
          <div
            key={result.id}
            className={`search-result-item glass-card-hover fade-in-up stagger-${Math.min(index + 1, 5)}`}
            onClick={() => handleResultClick(result.url)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleResultClick(result.url)}
          >
            <div className="result-header">
              <h3 className="result-title">{result.title}</h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="external-link-icon"
              >
                <path
                  d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {result.displayUrl && (
              <p className="result-url">{result.displayUrl}</p>
            )}

            <p className="result-snippet">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
