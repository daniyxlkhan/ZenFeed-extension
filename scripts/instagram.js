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

function hideReels() {
    const config = CONFIG.reels_links;
    const sections = document.querySelectorAll(config.selector);

    sections.forEach(link => {         
        if (link.dataset.zenfeedHidden) return;
        link.dataset.zenfeedHidden = 'true';
        
        let parentContainer = null;
        for (const containerSelector of config.containers) {
            parentContainer = link.closest(containerSelector);
            if (parentContainer) break;
        }
        
        if (parentContainer && !parentContainer.dataset.zenfeedHidden) {
            parentContainer.style.display = 'none';
            parentContainer.dataset.zenfeedHidden = 'true';
        }
    });
}

function showAllReels() {
    const hiddenElements = document.querySelectorAll('[data-zenfeed-hidden="true"]');

    hiddenElements.forEach(element => {
        element.style.display = '';
        delete element.dataset.zenfeedHidden;
    });
}

function runHidingLogic() {
    hideReels();
}

const observer = new MutationObserver((mutations) => {
    if (!reelsEnabled || !CONFIG) return;
    
    const hasAddedNodes = mutations.some(mutation => 
        mutation.addedNodes.length > 0
    );
    
    if (hasAddedNodes) {
        runHidingLogic();
    }
});

observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});

if (reelsEnabled && CONFIG) {
    runHidingLogic();
}