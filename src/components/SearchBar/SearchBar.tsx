import React, { useState, useEffect, type FormEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  placeholder = "Ask Stella anything...",
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);

  // Update query when initialQuery prop changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-bar-container fade-in-down">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper glass-card">
          {/* Search Icon */}
          <div className="search-icon-container">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="search-icon"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="search-input"
            disabled={isLoading}
            autoFocus
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="clear-button"
              aria-label="Clear search"
              disabled={isLoading}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="search-button glass-card-hover"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 1L1 9l5 2 2 5 9-15z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
              <span>Search</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
