// const YT_CONFIG = {
//     version: "2025.11.11",
    
//     // Simple selector-based hiding 
//     shorts_in_home_feed: [
//         'ytd-rich-section-renderer'
//     ],
    
//     shorts_in_search_feed: [
//         'grid-shelf-view-model'
//     ],
    
//     shorts_player: [
//         'ytd-shorts'
//     ],
    
//     // Link-based detection
//     shorts_links: {
//         selector: 'a[href*="/shorts"]',
//         containers: [
//             'ytd-mini-guide-entry-renderer',
//             'ytd-video-renderer',
//             'ytd-rich-item-renderer',
//             'ytd-grid-video-renderer'
//         ]
//     },
    
//     // Position-based detection (for large view sidebar)
//     shorts_large_view: {
//         parentSelector: 'ytd-guide-section-renderer',
//         childSelector: 'ytd-guide-entry-renderer',
//         targetIndex: 1  // Second entry is shorts
//     },
// };

export const defaultSettings = {
    hideShorts: true,
    hideHomeFeed: false,
    redirectToSubscriptions: false,
    hideSubscriptions: false,
};

export const labelsArray = Object.keys(defaultSettings);

export const urls = {
    base: "/",
    shorts: "/shorts",
};

export const selectors = {
    main: "[role=main]",
    subscriptions: "a[href*='/feed/subscriptions/']",
    shorts: "a[href*='/shorts']",
    shortsPlayer: "ytd-shorts",
    shortsContainers: {
        homeFeed: 'ytd-rich-section-renderer',
        searchFeed: 'grid-shelf-view-model',
    }
};

export const hide = (elements) => {
    if (!elements) return;
    
    if (elements instanceof Node) {
        elements.style.display = "none";
        elements.dataset.zenfeedHidden = 'true';
    }
    if (elements instanceof NodeList) {
        elements.forEach((element) => {
            element.style.display = "none";
            element.dataset.zenfeedHidden = 'true';
        });
    }
};

export const show = (elements) => {
    if (!elements) return;
    
    if (elements instanceof Node) {
        elements.style.display = "";
        delete elements.dataset.zenfeedHidden;
    }
    if (elements instanceof NodeList) {
        elements.forEach((element) => {
            element.style.display = "";
            delete element.dataset.zenfeedHidden;
        });
    }
};