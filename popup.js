document.addEventListener('DOMContentLoaded', () => {
    const linkList = document.getElementById('linkList');
  
    function renderLinks() {
      chrome.storage.sync.get({ links: [] }, (data) => {
        linkList.innerHTML = ''; // Clear existing links
        const sortedLinks = [...data.links]; // Clone the links array for sorting purposes
  
        sortedLinks.sort((a, b) => b.favorite - a.favorite); // Sort links, favorites first
  
        sortedLinks.forEach((link, sortedIndex) => {
          const originalIndex = data.links.findIndex(originalLink => originalLink.url === link.url); // Find the original index
  
          const li = document.createElement('li');
  
          const linkContainer = document.createElement('div');
          linkContainer.classList.add('link-container');
  
          // Create favicon image
          const favicon = document.createElement('img');
          favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}`;
          favicon.classList.add('favicon');
          linkContainer.appendChild(favicon);
  
          // Create link
          const a = document.createElement('a');
          a.href = link.url;
          a.textContent = link.title || link.url; // Fallback to URL if title is empty
          a.target = '_blank';
          linkContainer.appendChild(a);
  
          li.appendChild(linkContainer);
  
          const actionContainer = document.createElement('div'); // New container for icons
  
          // Favorite icon
          const favoriteIcon = document.createElement('span');
          favoriteIcon.textContent = link.favorite ? '★' : '☆'; // Use actual Unicode characters
          favoriteIcon.classList.add('icon', 'favorite'); 
          favoriteIcon.title = 'Toggle favorite';
          favoriteIcon.onclick = () => toggleFavorite(originalIndex, !link.favorite);
  
          actionContainer.appendChild(favoriteIcon);
  
          // Delete icon
          const deleteIcon = document.createElement('span');
          deleteIcon.innerHTML = '&#10006;'; // X symbol for delete
          deleteIcon.classList.add('icon', 'delete');
          deleteIcon.title = 'Delete link';
          deleteIcon.onclick = () => deleteLink(originalIndex);
  
          actionContainer.appendChild(deleteIcon);
          li.appendChild(actionContainer);
  
          linkList.appendChild(li);
        });
      });
    }
  
    function toggleFavorite(index, favorite) {
      chrome.runtime.sendMessage({ action: 'toggleFavorite', index, favorite }, (response) => {
        if (response && response.success) {
          renderLinks(); // Re-render the list after toggling favorite
        } else {
          console.error('Error updating favorite status');
        }
      });
    }
  
    function deleteLink(index) {
      chrome.storage.sync.get({ links: [] }, (data) => {
        const links = data.links;
        links.splice(index, 1); // Delete using the original index
        chrome.storage.sync.set({ links: links }, () => {
          renderLinks(); // Re-render the list
        });
      });
    }
  
    renderLinks(); // Initial render
  });
  