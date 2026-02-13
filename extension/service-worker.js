/* eslint-disable no-undef */

// Open side panel when clicking the toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Context menu: "Open in Markdown Lab" for .md links
chrome.contextMenus.create({
  id: 'open-md-sidepanel',
  title: 'Open in Markdown Lab',
  contexts: ['link'],
  targetUrlPatterns: ['*://*/*.md', '*://*/*.markdown', 'file:///*.md', 'file:///*.markdown'],
});

// Context menu: "Open Markdown Lab (New Tab)" on extension icon
chrome.contextMenus.create({
  id: 'open-md-newtab',
  title: 'Open Markdown Lab (New Tab)',
  contexts: ['action'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-md-sidepanel' && info.linkUrl) {
    const url = `index.html#/view?url=${encodeURIComponent(info.linkUrl)}`;
    if (tab?.id) {
      chrome.sidePanel.setOptions({ path: url, tabId: tab.id, enabled: true });
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }

  if (info.menuItemId === 'open-md-newtab') {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html#/split') });
  }
});

// Listen for OPEN_NEW_TAB messages from the UI
chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'OPEN_NEW_TAB') {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html#/split') });
  }
});

// Detect .md URLs and show badge
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url && /\.(md|markdown)(\?|#|$)/i.test(changeInfo.url)) {
    chrome.action.setBadgeText({ text: 'MD', tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#6366f1', tabId });
    chrome.sidePanel.setOptions({
      path: `index.html#/view?url=${encodeURIComponent(changeInfo.url)}`,
      tabId,
      enabled: true,
    });
  }
});
