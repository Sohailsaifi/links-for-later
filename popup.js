document.addEventListener('DOMContentLoaded', () => {
    const linkList = document.getElementById('linkList');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Function to render links
    function renderLinks() {
      chrome.storage.sync.get({ links: [] }, (data) => {
        linkList.innerHTML = '';
        const sortedLinks = [...data.links].sort((a, b) => b.favorite - a.favorite); // Sort by favorite
        
        sortedLinks.forEach((link, sortedIndex) => {
          const originalIndex = data.links.findIndex(originalLink => originalLink.url === link.url);
          const li = document.createElement('li');
          
          const linkContainer = document.createElement('div');
          linkContainer.classList.add('link-container');
          
          const favicon = document.createElement('img');
          favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}`;
          favicon.classList.add('favicon');
          linkContainer.appendChild(favicon);
  
          const a = document.createElement('a');
          a.href = link.url;
          a.textContent = link.title || link.url;
          a.target = '_blank';
          linkContainer.appendChild(a);
          
          li.appendChild(linkContainer);
  
          const actionContainer = document.createElement('div');
          
          const favoriteIcon = document.createElement('span');
          favoriteIcon.textContent = link.favorite ? '★' : '☆';
          favoriteIcon.classList.add('icon', 'favorite');
          favoriteIcon.onclick = () => toggleFavorite(originalIndex, !link.favorite);
          actionContainer.appendChild(favoriteIcon);
  
          const deleteIcon = document.createElement('span');
          deleteIcon.innerHTML = '&#10006;';
          deleteIcon.classList.add('icon', 'delete');
          deleteIcon.onclick = () => deleteLink(originalIndex);
          actionContainer.appendChild(deleteIcon);
  
          li.appendChild(actionContainer);
          linkList.appendChild(li);
        });
      });
    }
  
    // Toggle dark mode
    darkModeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode', darkModeToggle.checked);
      chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
    });
  
    // Load dark mode preference
    chrome.storage.sync.get({ darkMode: false }, (data) => {
      document.body.classList.toggle('dark-mode', data.darkMode);
      darkModeToggle.checked = data.darkMode;
    });
  
    function toggleFavorite(index, favorite) {
      chrome.runtime.sendMessage({ action: 'toggleFavorite', index, favorite }, (response) => {
        if (response && response.success) {
          renderLinks();
        } else {
          console.error('Error updating favorite status');
        }
      });
    }
  
    function deleteLink(index) {
      chrome.storage.sync.get({ links: [] }, (data) => {
        const links = data.links;
        links.splice(index, 1);
        chrome.storage.sync.set({ links: links }, () => {
          renderLinks();
        });
      });
    }
  
    renderLinks();
  });
  