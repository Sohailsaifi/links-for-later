document.addEventListener('DOMContentLoaded', () => {
    const linkList = document.getElementById('linkList');
  
    function renderLinks() {
      chrome.storage.sync.get({links: []}, (data) => {
        linkList.innerHTML = ''; // Clear existing links
        data.links.forEach((link, index) => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.justifyContent = 'space-between';
          li.style.alignItems = 'center';
          li.style.marginBottom = '10px';
          
          const linkContainer = document.createElement('div');
          linkContainer.style.display = 'flex';
          linkContainer.style.alignItems = 'center';
          
          // Create favicon image
          const favicon = document.createElement('img');
          favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}`;
          favicon.style.marginRight = '10px';
          favicon.width = 16;
          favicon.height = 16;
          linkContainer.appendChild(favicon);
  
          // Create link
          const a = document.createElement('a');
          a.href = link.url;
          a.textContent = link.title || link.url;  // Fallback to URL if title is empty
          a.target = '_blank';
          linkContainer.appendChild(a);
  
          li.appendChild(linkContainer);
  
          // Create delete icon
          const deleteIcon = document.createElement('span');
          deleteIcon.innerHTML = '&#10006;'; // X symbol
          deleteIcon.style.cursor = 'pointer';
          deleteIcon.style.color = 'red';
          deleteIcon.style.marginLeft = '10px';
          deleteIcon.title = 'Delete link';
          deleteIcon.onclick = () => deleteLink(index);
          
          li.appendChild(deleteIcon);
  
          linkList.appendChild(li);
        });
      });
    }
  
    function deleteLink(index) {
      chrome.storage.sync.get({links: []}, (data) => {
        const links = data.links;
        links.splice(index, 1);
        chrome.storage.sync.set({links: links}, () => {
          if (chrome.runtime.lastError) {
            console.error("Error deleting link:", chrome.runtime.lastError);
          } else {
            console.log("Link deleted successfully");
            renderLinks(); // Re-render the list
          }
        });
      });
    }
  
    renderLinks(); // Initial render
  });