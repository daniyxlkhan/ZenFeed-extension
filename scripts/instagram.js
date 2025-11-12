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

// listen for storage changes (when settings change in other tabs)
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.reelsEnabled) {
        reelsEnabled = changes.reelsEnabled.newValue;
        
        if (reelsEnabled && CONFIG) {
            runHidingLogic();
        } else {
            showAllReels();
        }
    }
});

// extra safety on top of onChanged to listen for tab visibility changes (when switching tabs)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // tab became visible, check current state
        chrome.storage.sync.get(['reelsEnabled'], (result) => {
            reelsEnabled = result.reelsEnabled !== false;
            
            if (reelsEnabled && CONFIG) {
                runHidingLogic();
            } else {
                showAllReels();
            }
        });
    }
});

// Hide reels side tab
function hideReelsTab() {
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

// Hide Infinte Reels Player
function hideInfiniteReelsPlayer() {
    if (!window.location.pathname.startsWith('/reels/')) return;
    
    // target the main content area 
    const mainContent = document.querySelector('main[role="main"]');
    
    if (mainContent && !mainContent.dataset.zenfeedHidden) {
        mainContent.style.display = 'none';
        mainContent.dataset.zenfeedHidden = 'true';
    }
}

function showAllReels() {
    const hiddenElements = document.querySelectorAll('[data-zenfeed-hidden="true"]');

    hiddenElements.forEach(element => {
        element.style.display = '';
        delete element.dataset.zenfeedHidden;
    });
}

function runHidingLogic() {
    hideReelsTab();
    hideInfiniteReelsPlayer();
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