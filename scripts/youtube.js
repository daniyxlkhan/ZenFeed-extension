function hideShortsSideTab() {
    // hide the shorts side tab for large page size
    const largePageSections = document.querySelectorAll('ytd-guide-entry-renderer');
    largePageSections.forEach(section => {
        const headingText = section.textContent;
        if (headingText.includes('Shorts') && !section.hidden) {
            console.log('Found Large Shorts tab by text:', section);
            section.style.display = 'none';
            section.hidden = true;
        }
    })

    // hide the shorts side tab for smaller page size
    const mediumPageSections = document.querySelectorAll('ytd-mini-guide-entry-renderer');
    mediumPageSections.forEach(section => {
        const headingText = section.textContent;
        if (headingText.includes('Shorts') && !section.hidden) {
            console.log('Found Medium Shorts tab by text:', section);
            section.style.display = 'none';
            section.hidden = true;
        }
    })
}

function hideShortsFeedTab() {
    const sections = document.querySelectorAll('ytd-rich-section-renderer');
    sections.forEach(section => {
        const headingText = section.textContent;
        if (headingText.includes('Shorts') && !section.hidden) {
            console.log('Found Shorts section by text:', section);
            section.style.display = 'none';
            section.hidden = true;
        }
    });
}

function hideShortsInSearchFeed() {
    const shortsSearchFeed = document.querySelectorAll('grid-shelf-view-model');
    shortsSearchFeed.forEach(shortSearchFeed => {
        shortSearchFeed.style.display = 'none';
    });
}

function hideShortsAsVideos() {
    const videoRenderers = document.querySelectorAll("ytd-video-renderer");
    videoRenderers.forEach(videoRenderer => {
        const badgeText = videoRenderer.querySelector('.yt-badge-shape__text');
        
        if (badgeText && !videoRenderer.hidden) {
            const text = badgeText.textContent.trim();            
            if (text === "SHORTS") {
                console.log('Hiding Shorts as video:', videoRenderer);
                videoRenderer.style.display = 'none';
                videoRenderer.hidden = true;
            }
        }
    });
}

const observer = new MutationObserver(() => {
    hideShortsSideTab();
    hideShortsFeedTab();
    hideShortsInSearchFeed();
    hideShortsAsVideos();
});

observer.observe(document.body, { childList: true, subtree: true });

hideShortsSideTab();
hideShortsFeedTab();
hideShortsInSearchFeed();
hideShortsAsVideos();