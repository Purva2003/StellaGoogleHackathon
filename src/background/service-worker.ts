// Stella AI Assistant - Background Service Worker
/// <reference types="chrome"/>

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

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === 'stella-search' && info.selectionText && tab?.id) {
    // Send the selected text to the side panel
    chrome.sidePanel.open({ tabId: tab.id });

    // Store the selected text for the side panel to retrieve
    chrome.storage.local.set({
      searchQuery: info.selectionText,
      timestamp: Date.now()
    });
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
    // Handle floating button click from content script
    const query = message.query;
    const tabId = sender.tab?.id;

    if (query && tabId) {
      console.log('Opening side panel with query:', query);

      // Store the selected text for the side panel to retrieve
      chrome.storage.local.set({
        searchQuery: query,
        timestamp: Date.now()
      });

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
