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
    homePage: "ytd-browse",
    subscriptions: "a[href*='/feed/subscriptions/']",
    shorts: "a[href*='/shorts']",
    shortsPlayer: "ytd-shorts",
    shortsContainers: {
        homeFeed: 'ytd-rich-section-renderer',
        searchFeed: 'grid-shelf-view-model',
        longShortsTab: 'ytd-guide-section-renderer ytd-guide-entry-renderer:nth-of-type(2)',
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