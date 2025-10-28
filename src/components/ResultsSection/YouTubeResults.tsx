import React from 'react';
import VideoCard, { type VideoData } from '../VideoCard/VideoCard';
import './YouTubeResults.css';

interface YouTubeResultsProps {
  videos: VideoData[];
  isLoading?: boolean;
}

const YouTubeResults: React.FC<YouTubeResultsProps> = ({ videos, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="youtube-results-container content-section holographic-texture">
        <div className="section-header">
          <div className="section-icon youtube-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 9.71a8.5 8.5 0 0 0-.91-4.13 2.92 2.92 0 0 0-1.72-1A78.36 78.36 0 0 0 12 4.27a78.45 78.45 0 0 0-8.34.3 2.87 2.87 0 0 0-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 0 0 0 6.48 9.55 9.55 0 0 0 .3 2 3.14 3.14 0 0 0 .71 1.36 2.86 2.86 0 0 0 1.49.78 45.18 45.18 0 0 0 6.5.33c3.5.05 6.57 0 10.2-.28a2.88 2.88 0 0 0 1.53-.78 2.49 2.49 0 0 0 .61-1 10.58 10.58 0 0 0 .52-3.4c.04-.56.04-3.94.04-4.54ZM9.74 14.85V8.66l5.92 3.11c-1.66.92-3.85 1.96-5.92 3.08Z"
                fill="#FF0000"
              />
            </svg>
          </div>
          <h2 className="section-title">YouTube Videos</h2>
        </div>

        <div className="youtube-results-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="video-skeleton">
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) return null;

  return (
    <div className="youtube-results-container content-section holographic-texture fade-in-up">
      <div className="section-header">
        <div className="section-icon youtube-icon glow-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M23 9.71a8.5 8.5 0 0 0-.91-4.13 2.92 2.92 0 0 0-1.72-1A78.36 78.36 0 0 0 12 4.27a78.45 78.45 0 0 0-8.34.3 2.87 2.87 0 0 0-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 0 0 0 6.48 9.55 9.55 0 0 0 .3 2 3.14 3.14 0 0 0 .71 1.36 2.86 2.86 0 0 0 1.49.78 45.18 45.18 0 0 0 6.5.33c3.5.05 6.57 0 10.2-.28a2.88 2.88 0 0 0 1.53-.78 2.49 2.49 0 0 0 .61-1 10.58 10.58 0 0 0 .52-3.4c.04-.56.04-3.94.04-4.54ZM9.74 14.85V8.66l5.92 3.11c-1.66.92-3.85 1.96-5.92 3.08Z"
              fill="#FF0000"
            />
          </svg>
        </div>
        <h2 className="section-title">YouTube Videos</h2>
        <span className="results-count">{videos.length} videos</span>
      </div>

      <div className="youtube-results-list">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  );
};

export default YouTubeResults;
