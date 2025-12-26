export const defaultSettings = {
    hideReels: true,
    hideHomeFeed: false,
    hideStories: false,
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