chrome.storage.local.get('todos', (obj) => {
  chrome.browserAction.setBadgeText({ text: '' });
});
