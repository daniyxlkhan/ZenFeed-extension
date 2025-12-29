export const defaultSettings = {
    blockReels: true,
    blockExplore: true,
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
    explore: "/explore"
};

export const selectors = {
    main: "[role=main]",
    storyFeed: "div[data-pagelet='story_tray']",
    posts: "article",
    postsLoader: "[data-visualcompletion='loading-state']",
    suggestedFollowers: "a[href*='/explore/people/']",
    nav: {
        direct: "a[href*='/direct/inbox/']",
        activity: "a[href*='/accounts/activity']",
        explore: "a[href*='/explore/']",
        reels: "a[href*='/reels/']",
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