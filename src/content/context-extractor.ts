// Context Extractor - Intelligent DOM parsing for page context
// File: src/content/context-extractor.ts
/// <reference types="chrome"/>

import type { PageContext, ContextRequestMessage, ContextResponseMessage } from '../types/context';

// Maximum context sizes to avoid overwhelming the LLM
const MAX_MAIN_CONTENT_SIZE = 2000; // ~2KB for main content
const MAX_SURROUNDING_TEXT = 500; // 500 chars before/after
const MAX_TOTAL_CONTEXT = 6000; // ~6KB total cap

/**
 * Extract page title from document
 */
function getPageTitle(): string {
  return document.title || '';
}

/**
 * Extract meta description from page
 */
function getMetaDescription(): string {
  const metaTag = document.querySelector('meta[name="description"]');
  return metaTag?.getAttribute('content') || '';
}

/**
 * Find the nearest heading (H1-H6) to the current selection
 */
function findNearestHeading(): { text: string; level: string } {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { text: '', level: '' };
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;

  // Start from the selection's container and traverse up
  let element: HTMLElement | null = container instanceof HTMLElement
    ? container
    : container.parentElement;

  // Look for heading in ancestors first
  while (element && element !== document.body) {
    if (/^H[1-6]$/.test(element.tagName)) {
      return {
        text: element.textContent?.trim() || '',
        level: element.tagName
      };
    }
    element = element.parentElement;
  }

  // If no heading found in ancestors, look for nearest heading before the selection
  element = container instanceof HTMLElement ? container : container.parentElement;
  while (element && element !== document.body) {
    const previousHeading = element.previousElementSibling;
    if (previousHeading && /^H[1-6]$/.test(previousHeading.tagName)) {
      return {
        text: previousHeading.textContent?.trim() || '',
        level: previousHeading.tagName
      };
    }
    element = element.parentElement;
  }

  // Fallback: find any H1 or H2 on the page
  const mainHeading = document.querySelector('h1, h2');
  if (mainHeading) {
    return {
      text: mainHeading.textContent?.trim() || '',
      level: mainHeading.tagName
    };
  }

  return { text: '', level: '' };
}

/**
 * Get text content before and after the selection
 */
function getSurroundingText(): { before: string; after: string } {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { before: '', after: '' };
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;

  // Get the parent paragraph or container
  let parentElement: HTMLElement | null = container instanceof HTMLElement
    ? container
    : container.parentElement;

  // Find the nearest block-level container (p, div, article, section, etc.)
  while (parentElement && parentElement !== document.body) {
    const tag = parentElement.tagName.toLowerCase();
    if (['p', 'div', 'article', 'section', 'main', 'li', 'td'].includes(tag)) {
      break;
    }
    parentElement = parentElement.parentElement;
  }

  if (!parentElement) {
    return { before: '', after: '' };
  }

  const fullText = parentElement.textContent || '';
  const selectionText = selection.toString();
  const selectionIndex = fullText.indexOf(selectionText);

  if (selectionIndex === -1) {
    return { before: '', after: '' };
  }

  const beforeText = fullText.substring(Math.max(0, selectionIndex - MAX_SURROUNDING_TEXT), selectionIndex);
  const afterText = fullText.substring(
    selectionIndex + selectionText.length,
    Math.min(fullText.length, selectionIndex + selectionText.length + MAX_SURROUNDING_TEXT)
  );

  return {
    before: beforeText.trim(),
    after: afterText.trim()
  };
}

/**
 * Extract main content from the page using heuristics
 * Prioritizes: <article>, <main>, or largest content container
 */
function extractMainContent(): string {
  // Try to find main content containers in order of preference
  const selectors = [
    'article',
    'main',
    '[role="main"]',
    '.article-content',
    '.post-content',
    '.entry-content',
    '#content',
    '.content'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent) {
      const text = element.textContent.trim();
      if (text.length > 200) { // Only use if substantial content
        return truncateText(text, MAX_MAIN_CONTENT_SIZE);
      }
    }
  }

  // Fallback: get all paragraph text
  const paragraphs = Array.from(document.querySelectorAll('p'));
  const allText = paragraphs
    .map(p => p.textContent?.trim() || '')
    .filter(text => text.length > 50) // Filter out tiny paragraphs
    .join(' ');

  return truncateText(allText, MAX_MAIN_CONTENT_SIZE);
}

/**
 * Truncate text to max length with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Extract comprehensive page context for the current selection
 */
export function extractPageContext(_selectionText: string): PageContext {
  const heading = findNearestHeading();
  const surrounding = getSurroundingText();
  const mainContent = extractMainContent();

  const context: PageContext = {
    pageTitle: getPageTitle(),
    metaDescription: getMetaDescription(),
    url: window.location.href,
    nearestHeading: heading.text,
    headingLevel: heading.level,
    surroundingBefore: surrounding.before,
    surroundingAfter: surrounding.after,
    mainContent: mainContent,
    isTruncated: false,
    contextSize: 0
  };

  // Calculate total context size
  context.contextSize =
    context.pageTitle.length +
    context.metaDescription.length +
    context.url.length +
    context.nearestHeading.length +
    context.surroundingBefore.length +
    context.surroundingAfter.length +
    context.mainContent.length;

  // If total context exceeds limit, truncate main content further
  if (context.contextSize > MAX_TOTAL_CONTEXT) {
    context.isTruncated = true;
    const excess = context.contextSize - MAX_TOTAL_CONTEXT;
    const newMainContentLength = Math.max(500, context.mainContent.length - excess);
    context.mainContent = truncateText(context.mainContent, newMainContentLength);

    // Recalculate size
    context.contextSize =
      context.pageTitle.length +
      context.metaDescription.length +
      context.url.length +
      context.nearestHeading.length +
      context.surroundingBefore.length +
      context.surroundingAfter.length +
      context.mainContent.length;
  }

  return context;
}

/**
 * Initialize context extractor message listener
 * Listens for requests from the service worker
 */
export function initializeContextExtractor(): void {
  chrome.runtime.onMessage.addListener(
    (
      message: ContextRequestMessage,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response: ContextResponseMessage) => void
    ) => {
      if (message.type === 'GET_PAGE_CONTEXT') {
        try {
          const context = extractPageContext(message.selectionText);
          sendResponse({ success: true, context });
        } catch (error) {
          console.error('Error extracting page context:', error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
        return true; // Keep message channel open for async response
      }
    }
  );

  console.log('Stella AI context extractor initialized');
}

// Auto-initialize when script loads
initializeContextExtractor();
