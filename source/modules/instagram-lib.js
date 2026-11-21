export const defaultSettings = {
    blockReels: true,
    blockFeedReels: false,
    blockExploreReels: true,
    blockExplorePage: false,
    blockStories: false,
    blockPosts: false,
    blockSuggestedFollowers: false,
    blockForYouFeed: false,
};

export const labelsArray = Object.keys(defaultSettings);

export const urls = {
    base: "/",
    stories: "/stories",
    reels: "/reels",
    reelsTab: "/reels/",
    explore: "/explore",
    explorePage: "/explore/",
    exploreSearch: "/explore/search",
    direct: "/direct",
};

export const selectors = {
    main: "[role=main]",
    storyFeed: "div[data-pagelet='story_tray']",
    posts: "article",
    reelPostLink: "article a[href*='/reels/']",
    postsLoader: "[data-visualcompletion='loading-state']",
    suggestedFollowers: "a[href*='/explore/people/']",
    exploreTileLink: "a[href*='/p/']",
    exploreReelMarker: "video, svg[aria-label='Reel']",
    exploreGridItem: "div[style*='gridTemplateColumns'] > div",
    reelsViewerNavButtons: "[aria-label='Navigate to next reel'], [aria-label='Navigate to previous reel']",
    hiddenByZenfeed: '[data-zenfeed-hidden="true"], [data-zenfeed-reel-hidden="true"], [data-zenfeed-reels-viewer="true"], '
        + '[data-zenfeed-reels-screen="true"], [data-zenfeed-stories-screen="true"], [data-zenfeed-explore-reel-hidden="true"], '
        + '[data-zenfeed-explore-hidden="true"]',
    nav: {
        direct: "a[href*='/direct/inbox/']",
        activity: "a[href*='/accounts/activity']",
        explore: "a[href*='/explore/']",
        reels: "a[href*='/reels/']",
    }
};

// features that hide overlapping elements use separate markers, so one feature's show() can't undo another's hide()
export const hide = (elements, marker = 'zenfeedHidden') => {
    if (!elements) return;

    if (elements instanceof Node) {
        elements.style.display = "none";
        elements.dataset[marker] = 'true';
    }
    if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach((element) => {
            element.style.display = "none";
            element.dataset[marker] = 'true';
        });
    }
};

export const show = (elements, marker = 'zenfeedHidden') => {
    if (!elements) return;

    if (elements instanceof Node) {
        elements.style.display = "";
        delete elements.dataset[marker];
    }
    if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach((element) => {
            element.style.display = "";
            delete element.dataset[marker];
        });
    }
};

// "Hide 'Explore' page" was replaced by "Hide 'Reels' on 'Explore'", carry the old choice over
export const migrateSettings = async () => {
    const stored = await chrome.storage.sync.get(['blockExplore', 'blockExploreReels']);
    if (!('blockExplore' in stored)) return;

    if (!('blockExploreReels' in stored)) {
        await chrome.storage.sync.set({ blockExploreReels: stored.blockExplore });
    }
    await chrome.storage.sync.remove('blockExplore');
};

// the full-screen reels viewer is a layer on <body>, outside [role=main]
export const reelsViewerLayers = (main) => {
    return [...document.body.children].filter((layer) => !layer.contains(main) && layer.querySelector('video'));
};

const isScrollable = (element) => {
    return element.scrollHeight > element.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(element).overflowY);
};

// the viewer scrolls through reels in a list, one reel per screen
export const reelsViewerScroller = (layer) => {
    return [...layer.querySelectorAll('div')].find(isScrollable);
};

export const reelInView = (scroller) => {
    const top = scroller.getBoundingClientRect().top;
    return [...scroller.children].find((reel) => {
        const rect = reel.getBoundingClientRect();
        return Math.abs(rect.top - top) < rect.height / 2;
    });
};

// e.g. the comments list, which must keep scrolling
export const isInNestedScroller = (target, scroller, layer) => {
    for (let element = target; element !== layer; element = element.parentElement) {
        if (element !== scroller && isScrollable(element)) return true;
    }
    return false;
};

export const pauseHiddenVideos = () => {
    document.querySelectorAll(selectors.hiddenByZenfeed).forEach((element) => {
        element.querySelectorAll('video').forEach((video) => video.pause());
    });
};

export const exploreReelTiles = (main) => {
    const tiles = [...(main?.querySelectorAll(selectors.exploreTileLink) ?? [])]
        .filter((link) => link.querySelector(selectors.exploreReelMarker))
        .map((link) => link.closest(selectors.exploreGridItem))
        .filter(Boolean);
    return [...new Set(tiles)];
};

// the post grid under the search bar, climbing as high as possible without taking the search bar with it
export const exploreGridSection = (main) => {
    let section = main?.querySelector(selectors.exploreGridItem)?.parentElement;
    if (!section) return null;

    while (section.parentElement && section.parentElement !== main && !section.parentElement.querySelector('input')) {
        section = section.parentElement;
    }
    return section;
};
