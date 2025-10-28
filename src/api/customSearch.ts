// Google Custom Search API Integration for related web pages

import type { SearchResultData } from '../components/ResultsSection/SearchResults';

const CUSTOM_SEARCH_API_KEY = import.meta.env.VITE_CUSTOM_SEARCH_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ENGINE_ID;
const CUSTOM_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

interface CustomSearchResponse {
  items?: {
    title: string;
    link: string;
    snippet: string;
    displayLink: string;
  }[];
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Search for related web pages using Google Custom Search API
 */
export async function searchRelatedPages(query: string, maxResults: number = 5): Promise<SearchResultData[]> {
  if (!CUSTOM_SEARCH_API_KEY || !SEARCH_ENGINE_ID) {
    throw new Error('Custom Search API is not configured. Please add VITE_CUSTOM_SEARCH_KEY and VITE_SEARCH_ENGINE_ID to your .env file.');
  }

  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  try {
    const params = new URLSearchParams({
      key: CUSTOM_SEARCH_API_KEY,
      cx: SEARCH_ENGINE_ID,
      q: query,
      num: Math.min(maxResults, 10).toString(), // Max 10 results per request
    });

    const response = await fetch(`${CUSTOM_SEARCH_URL}?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        throw new Error('Search quota exceeded. Please try again later.');
      }
      throw new Error(`Custom Search API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data: CustomSearchResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Convert to SearchResultData format
    const results: SearchResultData[] = data.items.map((item, index) => ({
      id: `search-${index}`,
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      displayUrl: item.displayLink
    }));

    return results;

  } catch (error) {
    console.error('Custom Search API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to search related pages. Please try again.');
  }
}

/**
 * Generate optimized search query from text
 */
export function generateSearchQuery(text: string): string {
  // Remove special characters and extra whitespace
  let query = text.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // Limit to reasonable length
  if (query.length > 150) {
    query = query.substring(0, 150);
  }

  // Extract key phrases (first 5-8 words work best)
  const words = query.split(' ');
  const searchTerms = words.slice(0, Math.min(8, words.length)).join(' ');

  return searchTerms;
}

/**
 * Filter out the current page URL from search results
 */
export function filterCurrentPage(results: SearchResultData[], currentUrl?: string): SearchResultData[] {
  if (!currentUrl) return results;

  const currentDomain = new URL(currentUrl).hostname;

  return results.filter(result => {
    try {
      const resultDomain = new URL(result.url).hostname;
      // Keep results from different domains or different pages on same domain
      return resultDomain !== currentDomain || result.url !== currentUrl;
    } catch {
      return true; // Keep result if URL parsing fails
    }
  });
}
