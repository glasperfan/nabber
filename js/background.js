// background.js

// Use this to show the icon in the address bar
chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.pageAction.show(tabId);
});

// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "download_images"});
  });
});