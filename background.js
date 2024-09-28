chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "saveLink",
        title: "Add to list",
        contexts: ["link"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveLink") {
        fetchTitleAndSaveLink(info.linkUrl);
    }
});

function fetchTitleAndSaveLink(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : url;
            saveLink(url, title, false); // Add the new favorite property (false by default)
        })
        .catch(error => {
            console.error("Error fetching page:", error);
            saveLink(url, url, false); // Add the new favorite property (false by default)
        });
}

function saveLink(url, title, favorite) {
    chrome.storage.sync.get({ links: [] }, (data) => {
      const links = data.links;
  
      // Check for duplicate URLs
      const isDuplicate = links.some(link => link.url === url);
      if (isDuplicate) {
        console.log("Duplicate link detected. The link will not be added.");
        return; // Stop if the link is a duplicate
      }
  
      // Add the new link
      links.push({ url: url, title: title, favorite: favorite });
      chrome.storage.sync.set({ links: links }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error saving link:", chrome.runtime.lastError);
        } else {
          console.log("Link saved successfully:", { url, title, favorite });
        }
      });
    });
  }
  

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleFavorite") {
        const { index, favorite } = request;
        toggleFavorite(index, favorite, (success) => {
            sendResponse({ success }); // Ensure response is sent
        });
        return true; // Keep the message channel open for async response
    }
});

function toggleFavorite(index, favorite, callback) {
    chrome.storage.sync.get({ links: [] }, (data) => {
        const links = data.links;
        links[index].favorite = favorite;
        chrome.storage.sync.set({ links: links }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error updating favorite:", chrome.runtime.lastError);
                callback(false); // Send false if there's an error
            } else {
                console.log("Favorite updated successfully");
                callback(true); // Send true if success
            }
        });
    });
}
