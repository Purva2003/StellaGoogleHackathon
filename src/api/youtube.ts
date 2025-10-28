// YouTube Data API v3 Integration for video search

import type { VideoData } from '../components/VideoCard/VideoCard';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

interface YouTubeSearchResponse {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
      publishedAt: string;
    };
  }[];
}

interface YouTubeVideoResponse {
  items: {
    id: string;
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
    };
  }[];
}

/**
 * Search for YouTube videos related to the query
 */
export async function searchVideos(query: string, maxResults: number = 5): Promise<VideoData[]> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured. Please add VITE_YOUTUBE_API_KEY to your .env file.');
  }

  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  try {
    // Step 1: Search for videos
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY,
      order: 'relevance',
      videoEmbeddable: 'true',
      safeSearch: 'moderate'
    });

    const searchResponse = await fetch(`${YOUTUBE_SEARCH_URL}?${searchParams}`);

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => ({}));
      if (searchResponse.status === 403) {
        throw new Error('YouTube API quota exceeded. Please try again later.');
      }
      throw new Error(`YouTube API error: ${searchResponse.status} - ${errorData.error?.message || searchResponse.statusText}`);
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Step 2: Get video details (duration, views)
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const detailsParams = new URLSearchParams({
      part: 'contentDetails,statistics',
      id: videoIds,
      key: YOUTUBE_API_KEY
    });

    const detailsResponse = await fetch(`${YOUTUBE_VIDEOS_URL}?${detailsParams}`);
    const detailsData: YouTubeVideoResponse = await detailsResponse.json();

    // Step 3: Combine search results with video details
    const videos: VideoData[] = searchData.items.map((item) => {
      const videoId = item.id.videoId;
      const details = detailsData.items.find(d => d.id === videoId);

      return {
        id: videoId,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        duration: details ? formatDuration(details.contentDetails.duration) : undefined,
        views: details ? formatViews(details.statistics.viewCount) : undefined,
        publishedAt: formatPublishedDate(item.snippet.publishedAt)
      };
    });

    return videos;

  } catch (error) {
    console.error('YouTube API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to search YouTube videos. Please try again.');
  }
}

/**
 * Convert ISO 8601 duration to readable format (e.g., "PT15M33S" -> "15:33")
 */
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format view count to readable format (e.g., "1234567" -> "1.2M")
 */
function formatViews(viewCount: string): string {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Format published date to relative time (e.g., "2 days ago")
 */
function formatPublishedDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Generate optimized search query from text
 */
export function generateVideoSearchQuery(text: string): string {
  // Remove special characters and extra whitespace
  let query = text.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // Limit to first 100 characters for better results
  if (query.length > 100) {
    query = query.substring(0, 100);
  }

  // Take first 5-7 words as search query
  const words = query.split(' ');
  const searchTerms = words.slice(0, Math.min(7, words.length)).join(' ');

  return searchTerms;
}
