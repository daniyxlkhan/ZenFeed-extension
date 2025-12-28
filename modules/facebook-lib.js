export const defaultSettings = {
    fb_blockReels: true,
    fb_blockPosts: false,
    fb_blockStories: false,
};

export const labelsArray = Object.keys(defaultSettings);

export const urls = {
    base: "/",
    reels: "/reel",
    stories: "/stories",
};

export const selectors = {
    main: "[role=main]",
    reels: "a[href*='/reel']",
    storyFeed: "div[aria-label='Stories']",
    posts: "div[role='article']",
    postsLoader: "div[data-visualcompletion='loading-state']",
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