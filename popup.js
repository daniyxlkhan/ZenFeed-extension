document.addEventListener('DOMContentLoaded', () => {
    const toggleShorts = document.getElementById('toggleShorts');
  
    // load saved state
    chrome.storage.sync.get(['shortsEnabled'], (result) => {
        const shortsEnabled = result.shortsEnabled !== false;  // if undefined default to true
        toggleShorts.checked = shortsEnabled;
    });
  
    // listen for toggle changes
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
                })
            }
        });
    });
});