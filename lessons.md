# Lessons Learned


* Make sure to put jquery as the first content script. Then it will be loaded first, and any scripts that rely on it will then have access to it.
* Note that if you have a popup.html (a popup window), then the event chrome.pageAction.onClicked.addListener will NOT fire if you have a popup. If you want something to happen when the popup is clicked, use document.addEventListener('DOMContentLoaded', callback_function) in popup.js
* The popup will not listen for messages unless it is currently open. So if you want to update the popup HTML, then you have to wait for it to open first.
* Any JS you want to use in popup.html cannot be inline. It must be separated into its own file (i.e. popup.js)
* If you want to write an extension which is compatible with Chrome 20 - 25, use chrome.extension instead of chrome.runtime. See http://stackoverflow.com/questions/15718066/chrome-runtime-sendmessage-not-working-as-expected.
* How do you test this thing? There are 3 consoles you have to keep track of:
	1. Webpage console - this is where anything on the current tab and anything from the content scripts will write to.
	2. Background console - this is where the background script writes to. To find it, go to chrome://extensions and click on the link called "background page" next to "Inspect Views".
	3. Popup console - this is where popup scripts will write to. To find it, call inspect element on the popup.
* If you change something in the extension, remember to reload! Click the "Reload" link under your extension.
* To add CSS to the popup, simply include as you normally would. Same with any scripts.
* I repeat, you CANNOT have inline JavaScript inside the popup window. You have to do something clever like this: http://stackoverflow.com/questions/13591983/onclick-within-chrome-extension-not-working. Documentation here: https://developer.chrome.com/extensions/contentSecurityPolicy#JSExecution.

## Messaging

This is how you send a message from a content script.
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});


And this is how you send a message from a background script or a popup script.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});