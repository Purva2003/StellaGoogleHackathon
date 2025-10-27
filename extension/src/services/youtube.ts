import type { YouTubeResponse, YouTubeVideo } from '../types/api';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function searchYouTube(query: string): Promise<YouTubeVideo[]> {
  try {
    if (!API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('q', query);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('maxResults', '5');
    url.searchParams.append('type', 'video');

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: YouTubeResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw error;
  }
}
