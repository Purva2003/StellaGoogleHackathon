// TypeScript types for context-aware summarization
// File: src/types/context.ts

/**
 * Represents contextual information extracted from a webpage
 */
export interface PageContext {
  /** Page title from <title> tag */
  pageTitle: string;

  /** Meta description from <meta name="description"> */
  metaDescription: string;

  /** URL of the page */
  url: string;

  /** Nearest heading (H1-H6) to the selected text */
  nearestHeading: string;

  /** Tag name of the nearest heading (e.g., 'H2') */
  headingLevel: string;

  /** Text content before the selection (up to 500 chars) */
  surroundingBefore: string;

  /** Text content after the selection (up to 500 chars) */
  surroundingAfter: string;

  /** Main article/content text (limited to ~2KB) */
  mainContent: string;

  /** Whether context extraction was truncated due to size limits */
  isTruncated: boolean;

  /** Total size of context in characters */
  contextSize: number;
}

/**
 * Enriched data structure combining selected text with page context
 */
export interface EnrichedSelectionData {
  /** The text selected by the user */
  selectionText: string;

  /** Page context surrounding the selection */
  pageContext: PageContext;

  /** Timestamp when the selection was made */
  timestamp: number;
}

/**
 * Message type for requesting context from content script
 */
export interface ContextRequestMessage {
  type: 'GET_PAGE_CONTEXT';
  selectionText: string;
}

/**
 * Response message containing extracted context
 */
export interface ContextResponseMessage {
  success: boolean;
  context?: PageContext;
  error?: string;
}
