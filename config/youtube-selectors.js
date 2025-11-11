const YT_CONFIG = {
    version: "2025.11.11",
    
    // simple selector-only configs (no custom logic needed)
    shorts_search: [
        'ytd-reel-shelf-renderer',
        'grid-shelf-view-model',
        '[data-shorts-shelf]'
    ],
    shorts_player: [
        'ytd-shorts',
        '[data-shorts-player]',
        'ytd-watch-flexy:has([data-shorts])'
    ],
    
    // configs that need custom logic
    sidebar: {
        selectors: [
            'ytd-guide-entry-renderer', 
            'ytd-mini-guide-entry-renderer'
        ],
        textMatch: 'Shorts'  
    },
    
    feed: {
        selectors: [
            'ytd-rich-section-renderer'
        ],
        textMatch: 'Shorts' 
    },
    
    videos: {
        selectors: [
            'ytd-video-renderer', 
            'ytd-grid-video-renderer', 
            'ytd-rich-item-renderer'
        ],
        badgeSelector: '.yt-badge-shape__text', 
        badgeText: 'SHORTS'
    }
};

module.exports = YT_CONFIG;