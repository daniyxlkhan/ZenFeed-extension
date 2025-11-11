let shortsEnabled = true;

// loads initial state from storage
chrome.storage.sync.get(['shortsEnabled'], (result) => {
    shortsEnabled = result.shortsEnabled !== false;

    if (shortsEnabled) {
        runHidingLogic();
    }
});

// listens for toggle messages from popup
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleShorts') {
    shortsEnabled = message.enabled;

    if (shortsEnabled) {
        runHidingLogic();
    } else {
        showAllShorts();
    }
    }
});

function hideShortsTabLargeView() {
    // get the first ytd-guide-section-renderer (main navigation section)
    const firstGuideSection = document.querySelector('ytd-guide-section-renderer');
    
    if (firstGuideSection) {
        // get all ytd-guide-entry-renderer inside the first section
        const guideEntries = firstGuideSection.querySelectorAll('ytd-guide-entry-renderer');
        
        // the second one is Shorts
        if (guideEntries.length >= 2) {
            const shortsEntry = guideEntries[1]; 
            
            if (!shortsEntry.dataset.zenfeedHidden) {
                shortsEntry.style.display = 'none';
                shortsEntry.dataset.zenfeedHidden = 'true';
            }
        }
    }
}

function hideShorts() {
    const sections = document.querySelectorAll('a[href*="/shorts"]');
        
    sections.forEach(link => { 
        if (link.dataset.zenfeedHidden) return;
        
        const guideEntry = link.closest('ytd-guide-entry-renderer');     
        const miniGuideEntry = link.closest('ytd-mini-guide-entry-renderer');
        const videoRenderer = link.closest('ytd-video-renderer');
        const richItem = link.closest('ytd-rich-item-renderer');
        
        const parentContainer = guideEntry || miniGuideEntry || videoRenderer || richItem;
        
        if (parentContainer && !parentContainer.dataset.zenfeedHidden) {
            parentContainer.style.display = 'none';
            parentContainer.dataset.zenfeedHidden = 'true';
        }
    });
}

function hideShortsFeedTab() { 
    const sections = document.querySelectorAll('ytd-rich-section-renderer');
    
    sections.forEach(section => {
        if (section.dataset.zenfeedHidden) return;
 
        section.style.display = 'none';
        section.dataset.zenfeedHidden = 'true';
    });
}

function hideShortsInSearchFeed() { 
    const shortsSearchFeed = document.querySelectorAll('grid-shelf-view-model');
    
    shortsSearchFeed.forEach(shelf => {
        if (shelf.dataset.zenfeedHidden) return;
        
        shelf.style.display = 'none';
        shelf.dataset.zenfeedHidden = 'true';
    });
}

function hideShortsPlayer() { 
    const shortsPlayer = document.querySelector('ytd-shorts');
    
    if (shortsPlayer && !shortsPlayer.dataset.zenfeedHidden) {
        shortsPlayer.style.display = 'none';
        shortsPlayer.dataset.zenfeedHidden = 'true';
    }
}

function showAllShorts() {
    const hiddenElements = document.querySelectorAll('[data-zenfeed-hidden="true"]');

    hiddenElements.forEach(element => {
    element.style.display = '';
    delete element.dataset.zenfeedHidden;
    });
}

function runHidingLogic() {
    hideShortsTabLargeView();
    hideShorts();
    hideShortsFeedTab();
    hideShortsInSearchFeed();
    hideShortsPlayer();
}

const observer = new MutationObserver(() => {
    if (shortsEnabled) {
        runHidingLogic();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

if (shortsEnabled) {
    runHidingLogic();
}