export const defaultSettings = {
    hideShorts: true,
    hideHomeFeed: false,
    hideSubscriptions: false,
    hideRecommendedVideosSideBar: false,
};

export const labelsArray = Object.keys(defaultSettings);

export const urls = {
    base: "/",
    shorts: "/shorts",
    subscriptions: "/feed/subscriptions",
};

export const selectors = {
    main: "[role=main]",
    homePage: "ytd-browse[page-subtype='home']",

    subscriptions: "a[href*='/feed/subscriptions']",
    subscriptionContainers: {
        subscriptionsPage: "ytd-browse[page-subtype='subscriptions']",
        sideBarSubscriptionList: 'ytd-guide-renderer ytd-guide-section-renderer:nth-of-type(2)',
    },

    shorts: "a[href*='/shorts']",
    shortsPlayer: "ytd-shorts",
    shortsContainers: {
        homeFeed: 'ytd-rich-section-renderer',
        searchFeed: 'grid-shelf-view-model',
        recommendedFeed: 'ytd-reel-shelf-renderer',
        longShortsTab: ":is(ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer) a[title='Shorts']",
        longShortsTabEntry: ':is(ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer)',
    },

    recommendedVideosSideBar: 'ytd-watch-flexy #secondary',

    hiddenByZenfeed: '[data-zenfeed-hidden="true"]',
};

export const hide = (elements) => {
    if (!elements) return;
    
    if (elements instanceof Node) {
        elements.style.display = "none";
        elements.dataset.zenfeedHidden = 'true';
    }
    if (elements instanceof NodeList || Array.isArray(elements)) {
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
    if (elements instanceof NodeList || Array.isArray(elements)) {
        elements.forEach((element) => {
            element.style.display = "";
            delete element.dataset.zenfeedHidden;
        });
    }
};

export const pauseHiddenVideos = () => {
    document.querySelectorAll(selectors.hiddenByZenfeed).forEach((element) => {
        element.querySelectorAll('video').forEach((video) => video.pause());
    });
};
