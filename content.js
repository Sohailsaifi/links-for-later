chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTitle") {
      sendResponse({ title: document.title });
    }
    return true;
  });