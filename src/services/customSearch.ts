import type { CustomSearchResponse, CustomSearchResult } from '../types/api';

const API_KEY = import.meta.env.VITE_CUSTOM_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_CUSTOM_SEARCH_ENGINE_ID;

export async function searchCustomSearch(query: string): Promise<CustomSearchResult[]> {
  try {
    if (!API_KEY || !SEARCH_ENGINE_ID) {
      throw new Error('Custom Search API key or Search Engine ID not configured');
    }

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('cx', SEARCH_ENGINE_ID);
    url.searchParams.append('q', query);
    url.searchParams.append('num', '5');

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Custom Search API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: CustomSearchResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Custom Search API Error:', error);
    throw error;
  }
}
