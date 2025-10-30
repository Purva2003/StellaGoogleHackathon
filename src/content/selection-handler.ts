// Stella AI - Text Selection Handler
// Shows floating magnifying glass logo when text is selected
/// <reference types="chrome"/>

import './selection-handler.css';

let floatingButton: HTMLElement | null = null;
let selectionTimeout: number | null = null;

// Create the floating magnifying glass button
function createFloatingButton(): HTMLElement {
  const button = document.createElement('div');
  button.id = 'stella-ai-selection-button';
  button.className = 'stella-floating-button';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'Search with Stella AI');

  // Add the Stella logo
  const logoUrl = chrome.runtime.getURL('stella-logo.png');
  const img = document.createElement('img');
  img.src = logoUrl;
  img.alt = 'Stella AI';
  img.className = 'stella-logo-img';

  button.appendChild(img);

  // Add click handler
  button.addEventListener('click', handleButtonClick);

  return button;
}

// Handle button click - send message to background script
function handleButtonClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();

  const selectedText = window.getSelection()?.toString().trim();

  if (selectedText) {
    // Send message to background script to open side panel
    chrome.runtime.sendMessage({
      type: 'OPEN_SIDE_PANEL_WITH_QUERY',
      query: selectedText
    });

    // Hide the button after clicking
    hideFloatingButton();
  }
}

// Position the floating button near the selected text
function positionFloatingButton() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (!floatingButton) return;

  // Position above the selection, aligned to the right end
  const buttonSize = 36; // Button size in pixels (matches logo size)
  const offsetAbove = 6; // Space above the selection
  const offsetFromEnd = 4; // Small offset from the end of selection

  // Align the button to the right end of the selection
  let left = rect.right - buttonSize - offsetFromEnd;

  // Position above the selection
  let top = rect.top - buttonSize - offsetAbove;

  // Ensure button stays within viewport
  const viewportWidth = window.innerWidth;

  // Adjust horizontal position if too close to edge
  if (left < 10) {
    left = 10; // Minimum left padding
  } else if (left + buttonSize + 10 > viewportWidth) {
    left = viewportWidth - buttonSize - 10; // Minimum right padding
  }

  // If not enough space above, position below the selection instead
  if (top < 10) {
    top = rect.bottom + offsetAbove;
  }

  // Account for scroll position
  left += window.scrollX;
  top += window.scrollY;

  floatingButton.style.left = `${left}px`;
  floatingButton.style.top = `${top}px`;
}

// Show the floating button
function showFloatingButton() {
  if (!floatingButton) {
    floatingButton = createFloatingButton();
    document.body.appendChild(floatingButton);
  }

  positionFloatingButton();

  // Trigger animation
  requestAnimationFrame(() => {
    if (floatingButton) {
      floatingButton.classList.add('stella-visible');
    }
  });
}

// Hide the floating button
function hideFloatingButton() {
  if (floatingButton) {
    floatingButton.classList.remove('stella-visible');

    // Remove from DOM after animation
    setTimeout(() => {
      if (floatingButton && floatingButton.parentNode) {
        floatingButton.parentNode.removeChild(floatingButton);
        floatingButton = null;
      }
    }, 300);
  }
}

// Handle text selection
function handleSelection() {
  // Clear any existing timeout
  if (selectionTimeout) {
    clearTimeout(selectionTimeout);
  }

  // Debounce the selection handler
  selectionTimeout = setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      showFloatingButton();
    } else {
      hideFloatingButton();
    }
  }, 300);
}

// Listen for selection changes
document.addEventListener('mouseup', handleSelection);
document.addEventListener('keyup', handleSelection);
document.addEventListener('selectionchange', handleSelection);

// Hide button when clicking outside
document.addEventListener('mousedown', (e: MouseEvent) => {
  if (floatingButton && !floatingButton.contains(e.target as Node)) {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      hideFloatingButton();
    }
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  hideFloatingButton();
  if (selectionTimeout) {
    clearTimeout(selectionTimeout);
  }
});

console.log('Stella AI selection handler loaded');
