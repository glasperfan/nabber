// background.js

// Use this to show the icon in the address bar
chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.pageAction.show(tabId);
});