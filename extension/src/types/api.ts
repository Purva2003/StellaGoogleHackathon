// API Response Types

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
}

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
      medium?: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface YouTubeResponse {
  items: YouTubeVideo[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface CustomSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  formattedUrl?: string;
}

export interface CustomSearchResponse {
  items: CustomSearchResult[];
  searchInformation: {
    totalResults: string;
    searchTime: number;
  };
}

export interface SearchResults {
  gemini: string | null;
  youtube: YouTubeVideo[];
  customSearch: CustomSearchResult[];
  errors: {
    gemini?: string;
    youtube?: string;
    customSearch?: string;
  };
}
