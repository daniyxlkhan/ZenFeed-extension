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

export const hide = (elements, marker = 'zenfeedHidden') => {
    if (!elements) return;
    
    if (elements instanceof Node) {
        elements.style.display = "none";
        elements.dataset[marker] = 'true';
    }
    if (elements instanceof NodeList) {
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
    if (elements instanceof NodeList) {
        elements.forEach((element) => {
            element.style.display = "";
            delete element.dataset[marker];
        });
    }
};