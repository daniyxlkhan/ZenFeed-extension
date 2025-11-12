document.addEventListener('DOMContentLoaded', () => {
    const toggleShorts = document.getElementById('toggleShorts');
    const toggleReels = document.getElementById('toggleReels');

    // load saved state for Shorts
    chrome.storage.sync.get(['shortsEnabled'], (result) => {
        const shortsEnabled = result.shortsEnabled !== false;  // if undefined default to true
        toggleShorts.checked = shortsEnabled;
    });
  
    // listen for Shorts toggle changes
    toggleShorts.addEventListener('change', (e) => {
        const enabled = e.target.checked;

        // save state
        chrome.storage.sync.set({ shortsEnabled: enabled });

        // send msg to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url?.includes('youtube.com')) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: 'toggleShorts', 
                    enabled: enabled 
                }).catch(() => {
                    // silently ignore if content script not ready
                    // storage sync will handle it anyway
                });
            }
        });
    });

    // load saved state for Reels
    chrome.storage.sync.get(['reelsEnabled'], (result) => {
        const reelsEnabled = result.reelsEnabled !== false; // Default to true
        toggleReels.checked = reelsEnabled;
    });
  
    // listen for Reels toggle changes
    toggleReels.addEventListener('change', (e) => {
        const enabled = e.target.checked;

        // save state
        chrome.storage.sync.set({ reelsEnabled: enabled });

        // send msg to Instagram content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.url?.includes('instagram.com')) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: 'toggleReels', 
                    enabled: enabled 
                }).catch(() => {
                    // silently ignore if content script not ready
                    // storage sync will handle it anyway
                });
            }
        });
    });
});