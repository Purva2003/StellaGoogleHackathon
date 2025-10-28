import React, { useState } from 'react';
import './VideoCard.css';

export interface VideoData {
  id: string;
  title: string;
  channelName: string;
  thumbnail: string;
  description?: string;
  url: string;
  duration?: string;
  views?: string;
  publishedAt?: string;
}

interface VideoCardProps {
  video: VideoData;
  index?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open(video.url, '_blank');
  };

  return (
    <div
      className={`video-card perspective-container fade-in-up stagger-${Math.min(index + 1, 5)}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={`video-card-inner ${isHovered ? 'hovered' : ''}`}>
        {/* Thumbnail Section */}
        <div className="video-thumbnail-container">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="video-thumbnail"
            loading="lazy"
          />
          {video.duration && (
            <span className="video-duration">{video.duration}</span>
          )}
          <div className="thumbnail-overlay">
            <svg
              width="32"
              height="32"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="play-icon"
            >
              <circle cx="24" cy="24" r="24" fill="rgba(0, 180, 255, 0.9)" />
              <path
                d="M18 14L34 24L18 34V14Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="video-info">
          <h3 className="video-title" title={video.title}>
            {video.title}
          </h3>

          <div className="video-meta">
            <p className="channel-name">{video.channelName}</p>
            {(video.views || video.publishedAt) && (
              <p className="video-stats">
                {video.views && <span>{video.views} views</span>}
                {video.views && video.publishedAt && <span> • </span>}
                {video.publishedAt && <span>{video.publishedAt}</span>}
              </p>
            )}
          </div>

          {video.description && (
            <p className="video-description" title={video.description}>
              {video.description}
            </p>
          )}
        </div>

        {/* Holographic Shimmer Effect */}
        <div className="video-card-shimmer"></div>
      </div>
    </div>
  );
};

export default VideoCard;
