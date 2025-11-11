function hideShortsSideTab() {
    const sections = document.querySelectorAll('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
    
    sections.forEach(section => {
        if (section.dataset.zenfeedHidden) return;
        
        const headingText = section.textContent;
        if (headingText && headingText.includes('Shorts')) {
            section.style.display = 'none';
            section.dataset.zenfeedHidden = 'true';
        }
    });
}

function hideShortsFeedTab() {
    const sections = document.querySelectorAll('ytd-rich-section-renderer');
    
    sections.forEach(section => {
        if (section.dataset.zenfeedHidden) return;
        
        const headingText = section.textContent;
        if (headingText && headingText.includes('Shorts')) {
            section.style.display = 'none';
            section.dataset.zenfeedHidden = 'true';
        }
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

function hideShortsAsVideos() {
    const videoRenderers = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer');
    
    videoRenderers.forEach(videoRenderer => {
        if (videoRenderer.dataset.zenfeedHidden) return;
        
        const badgeText = videoRenderer.querySelector('.yt-badge-shape__text');
        if (badgeText && badgeText.textContent.trim() === 'SHORTS') {
            videoRenderer.style.display = 'none';
            videoRenderer.dataset.zenfeedHidden = 'true';
        }
    });
}

function hideShortsPlayer() {
    const shortsPlayer = document.querySelector('ytd-shorts');
    
    if (shortsPlayer && !shortsPlayer.dataset.zenfeedHidden) {
        shortsPlayer.style.display = 'none';
        shortsPlayer.dataset.zenfeedHidden = 'true';
    }
}

const observer = new MutationObserver(() => {
    hideShortsSideTab();
    hideShortsFeedTab();
    hideShortsInSearchFeed();
    hideShortsAsVideos();
    hideShortsPlayer();
});

observer.observe(document.body, { childList: true, subtree: true });

hideShortsSideTab();
hideShortsFeedTab();
hideShortsInSearchFeed();
hideShortsAsVideos();
hideShortsPlayer();