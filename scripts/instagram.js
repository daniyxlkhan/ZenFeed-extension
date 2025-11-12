let reelsEnabled = true;
let CONFIG = INSTA_CONFIG;

// load initial state from storage
chrome.storage.sync.get(['reelsEnabled'], (result) => {
    reelsEnabled = result.reelsEnabled !== false; // default to true

    if (reelsEnabled && CONFIG) {
        runHidingLogic();
    }
});

// listen for toggle messages from popup
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleReels') {
        reelsEnabled = message.enabled;

        if (reelsEnabled && CONFIG) {
            runHidingLogic();
        } else {
            showAllReels();
        }
    }
});

