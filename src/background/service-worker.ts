// Stella AI Assistant - Background Service Worker
/// <reference types="chrome"/>

import type { EnrichedSelectionData, PageContext, ContextRequestMessage, ContextResponseMessage } from '../types/context';

console.log('Stella AI service worker loaded');

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'stella-search',
    title: 'Search with Stella AI',
    contexts: ['selection']
  });
});

// Handle context menu clicks - WITH CONTEXT EXTRACTION
chrome.contextMenus.onClicked.addListener(async (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'stella-search' && info.selectionText && tab?.id) {
    console.log('Context menu clicked, extracting page context...');

    try {
      // Request page context from content script
      const contextRequest: ContextRequestMessage = {
        type: 'GET_PAGE_CONTEXT',
        selectionText: info.selectionText
      };

      // Send message to content script and wait for context (with 3s timeout)
      const response = await Promise.race([
        chrome.tabs.sendMessage(tab.id, contextRequest) as Promise<ContextResponseMessage>,
        new Promise<ContextResponseMessage>((_, reject) =>
          setTimeout(() => reject(new Error('Context extraction timeout')), 3000)
        )
      ]);

      if (response.success && response.context) {
        // Store enriched data (selection + context) for side panel
        const enrichedData: EnrichedSelectionData = {
          selectionText: info.selectionText,
          pageContext: response.context,
          timestamp: Date.now()
        };

        await chrome.storage.local.set({
          enrichedSelectionData: enrichedData,
          timestamp: Date.now()
        });

        console.log('Page context extracted and stored:', response.context);
      } else {
        // Fallback: store basic selection without context
        console.warn('Context extraction failed, falling back to basic selection');
        await chrome.storage.local.set({
          searchQuery: info.selectionText,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      // On timeout or error, fallback to storing just the selection
      console.error('Error during context extraction:', error);
      await chrome.storage.local.set({
        searchQuery: info.selectionText,
        timestamp: Date.now()
      });
    }

    // Open side panel after storage
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Listen for messages from the side panel or content scripts
chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (message.type === 'SEARCH_QUERY') {
    // Handle search query if needed
    console.log('Search query received:', message.query);
    sendResponse({ success: true });
  }

  if (message.type === 'OPEN_SIDE_PANEL_WITH_QUERY') {
    // Handle floating button click from content script WITH CONTEXT
    const query = message.query;
    const pageContext: PageContext | undefined = message.pageContext;
    const tabId = sender.tab?.id;

    if (query && tabId) {
      console.log('Opening side panel with query:', query);

      // Store enriched data if context is provided, otherwise store basic query
      if (pageContext) {
        const enrichedData: EnrichedSelectionData = {
          selectionText: query,
          pageContext: pageContext,
          timestamp: Date.now()
        };

        chrome.storage.local.set({
          enrichedSelectionData: enrichedData,
          timestamp: Date.now()
        });
      } else {
        // Fallback to basic storage
        chrome.storage.local.set({
          searchQuery: query,
          timestamp: Date.now()
        });
      }

      // Open the side panel
      chrome.sidePanel.open({ tabId: tabId });

      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Missing query or tab ID' });
    }
  }

  return true; // Keep the message channel open for async responses
});

export {};
