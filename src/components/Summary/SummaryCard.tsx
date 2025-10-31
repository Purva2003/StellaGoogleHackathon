// File: src/components/Summary/SummaryCard.tsx
import { useState, useEffect } from 'react';
import './SummaryCard.css';

interface SummaryCardProps {
  snippet: string;
  urlToSummarize: string;
  onFetchFullSummary?: (url: string) => Promise<string>;
}

const SummarySkeleton = () => {
  return (
    <div className="summary-skeleton">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line-group">
        <div className="skeleton-line thin"></div>
        <div className="skeleton-line thin"></div>
        <div className="skeleton-line thin short"></div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  snippet,
  urlToSummarize,
  onFetchFullSummary
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullSummary, setFullSummary] = useState<string | null>(null);

  useEffect(() => {
    if (isExpanded && !fullSummary) {
      setIsLoading(true);

      // Use provided fetch function or simulate a 2-second API call
      const fetchSummary = async () => {
        try {
          if (onFetchFullSummary) {
            const summary = await onFetchFullSummary(urlToSummarize);
            setFullSummary(summary);
          } else {
            // Fallback: simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setFullSummary(
              `This is the full summary for ${urlToSummarize}. After analyzing the content, we found that the main points include detailed information about the topic, supporting evidence, and relevant context. The analysis reveals important insights that help understand the broader implications of the subject matter.`
            );
          }
        } catch (error) {
          console.error('Error fetching summary:', error);
          setFullSummary('Unable to generate full summary. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSummary();
    }
  }, [isExpanded, fullSummary, urlToSummarize, onFetchFullSummary]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="summary-card-container content-section holographic-texture fade-in-up">
      <div className="section-header">
        <div className="section-icon glow-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="var(--color-bright-blue)"
            />
          </svg>
        </div>
        <h2 className="section-title">AI Summary</h2>
      </div>

      {/* Initial snippet */}
      <div className="summary-snippet">
        <p>{snippet}</p>
      </div>

      {/* Show full summary button */}
      {!isExpanded && (
        <button
          onClick={handleToggle}
          className="expand-button"
        >
          Show full summary...
          <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              stroke="currentColor"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}

      {/* Expandable container using grid-template-rows trick */}
      <div className={`expandable-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="expandable-content">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="summary-loading">
              <SummarySkeleton />
            </div>
          )}

          {/* Full summary */}
          {!isLoading && fullSummary && (
            <div className="full-summary fade-in">
              <div className="summary-text">
                {fullSummary.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Collapse button */}
              <button
                onClick={handleToggle}
                className="collapse-button"
              >
                Show less
                <svg className="chevron-icon rotate-up" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="ai-badge">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="var(--color-bright-blue)" strokeWidth="2"/>
          <circle cx="8" cy="8" r="3" fill="var(--color-bright-blue)"/>
        </svg>
        <span>Powered by Gemini AI</span>
      </div>
    </div>
  );
};

export default SummaryCard;
