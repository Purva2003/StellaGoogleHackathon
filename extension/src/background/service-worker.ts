// Background service worker for Stella AI Assistant
console.log('Stella AI Assistant background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Stella AI Assistant installed');
});

// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'stella-ai',
    title: 'Ask Stella AI',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'stella-ai' && tab?.id) {
    // Open side panel when context menu is clicked
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Handle extension icon clicks - open side panel
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});
