const YT_CONFIG = {
    version: "2025.11.11",
    
    // Simple selector-based hiding 
    shorts_in_home_feed: [
        'ytd-rich-section-renderer'
    ],
    
    shorts_in_search_feed: [
        'grid-shelf-view-model'
    ],
    
    shorts_player: [
        'ytd-shorts'
    ],
    
    // Link-based detection
    shorts_links: {
        selector: 'a[href*="/shorts"]',
        containers: [
            'ytd-mini-guide-entry-renderer',
            'ytd-video-renderer',
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer'
        ]
    },
    
    // Position-based detection (for large view sidebar)
    shorts_large_view: {
        parentSelector: 'ytd-guide-section-renderer',
        childSelector: 'ytd-guide-entry-renderer',
        targetIndex: 1  // Second entry is shorts
    },
};