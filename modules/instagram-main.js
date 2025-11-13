import { labelsArray, defaultSettings, selectors, urls, hide, show } from "./instagram-lib.js";

let settings = { ...defaultSettings };

async function loadSettings() {
    return new Promise(async (resolve) => {
        const loadedSettings = await chrome.storage.sync.get(labelsArray); 
            if (Object.keys(loadedSettings).length === 0) {
                chrome.storage.sync.set(defaultSettings);
                resolve(defaultSettings);
            } else {
                resolve(loadedSettings);
            }
    });
}

function applySettings() {
    const path = window.location.pathname;
    const body = document.body;

    if (settings.blockExplore) {
        const exploreLinks = body?.querySelectorAll(selectors.nav.explore);
        hide(exploreLinks);
    } else {
        const exploreLinks = document.querySelectorAll(`${selectors.nav.explore}[data-zenfeed-hidden="true"]`);
        show(exploreLinks);
    }

    if (settings.blockReels) {
        const reelsLinks = body?.querySelectorAll(selectors.nav.reels);
        hide(reelsLinks);
    } else {
        const reelsLinks = document.querySelectorAll(`${selectors.nav.reels}[data-zenfeed-hidden="true"]`);
        show(reelsLinks);
    }

    const blockStoriesSection = path.includes(urls.stories) && settings.blockStories;
    if (blockStoriesSection) {
        hide(body);
    } else if (path.includes(urls.stories)) {
        show(body);
    }

    const blockReelsScreen = path.includes(urls.reels) && settings.blockReels;
    if (blockReelsScreen) {
        const main = body?.querySelector(selectors.main);
        hide(main);
    } else if (path.includes(urls.reels)) {
        const main = document.querySelector(`${selectors.main}[data-zenfeed-hidden="true"]`);
        show(main);
    }

    const blockExploreScreen = path.includes(urls.explore) && settings.blockExplore;
    if (blockExploreScreen) {
        const main = body?.querySelector(selectors.main);
        hide(main);
    } else if (path.includes(urls.explore)) {
        const main = document.querySelector(`${selectors.main}[data-zenfeed-hidden="true"]`);
        show(main);
    }

    if (path === urls.base) {
        if (settings.blockStories) {
            const storyFeed = body?.querySelector(selectors.storyFeed);
            hide(storyFeed);
        } else {
            const storyFeed = document.querySelector(`${selectors.storyFeed}[data-zenfeed-hidden="true"]`);
            show(storyFeed);
        }

        if (settings.blockPosts) {
            const posts = body?.querySelector(selectors.posts);
            const postsLoader = body?.querySelector(selectors.postsLoader);
            const postsContainer = posts?.parentElement?.parentElement?.parentElement;
            hide(posts);
            hide(postsLoader);
            hide(postsContainer);
        } else {
            const posts = document.querySelector(`${selectors.posts}[data-zenfeed-hidden="true"]`);
            const postsLoader = body?.querySelector(`${selectors.postsLoader}[data-zenfeed-hidden="true"]`);
            const postsContainer = posts?.parentElement?.parentElement?.parentElement;
            show(posts);
            show(postsLoader);
            show(postsContainer);
        }

        if (settings.blockSuggestedFollowers) {
            const suggestedFollowersLink = body?.querySelector(selectors.suggestedFollowers);
            const suggestedFollowersTitle = suggestedFollowersLink?.closest("div");
            const suggestedFollowers = suggestedFollowersTitle?.nextElementSibling;
            hide(suggestedFollowersLink);
            hide(suggestedFollowersTitle);
            hide(suggestedFollowers);
        } else {
            const suggestedFollowersLink = body?.querySelector(`${selectors.suggestedFollowers}[data-zenfeed-hidden="true"]`);
            const suggestedFollowersTitle = suggestedFollowersLink?.closest("div");
            const suggestedFollowers = suggestedFollowersTitle?.nextElementSibling;
            show(suggestedFollowersLink);
            show(suggestedFollowersTitle);
            show(suggestedFollowers);
        }

        if (settings.blockForYouFeed) {
            const queryParams = new URLSearchParams(window.location.search);
            if (queryParams?.get("variant") === "home" || queryParams?.get("variant") === null) {
                queryParams.set("variant", "following");
                window.location.search = queryParams.toString();
            }
        }
    }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
        for (const key of Object.keys(changes)) {
            if (labelsArray.includes(key)) {
                settings[key] = changes[key].newValue;
            }
        }
        applySettings();
    }
});

const observer = new MutationObserver((mutations) => {
    const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
    if (hasAddedNodes) {
        applySettings();
    }
});

// export main function for dynamic import
export async function main() {
    settings = await loadSettings();
    applySettings();
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}