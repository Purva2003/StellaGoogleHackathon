// API Response Types

export interface VertexAIResponse {
  predictions: Array<{
    content: string;
    safetyAttributes?: {
      categories: string[];
      scores: number[];
    };
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
  vertexAI: string | null;
  youtube: YouTubeVideo[];
  customSearch: CustomSearchResult[];
  errors: {
    vertexAI?: string;
    youtube?: string;
    customSearch?: string;
  };
}
