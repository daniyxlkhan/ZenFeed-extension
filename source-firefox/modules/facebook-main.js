import { labelsArray, defaultSettings, selectors, urls, hide, show } from "./facebook-lib.js";

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

    if (settings.fb_blockReels) {
        const reelLinks = body?.querySelectorAll(selectors.reels);
        hide(reelLinks);
    } else {
        const hiddenReels = document.querySelectorAll(`[data-zenfeed-hidden="true"]`);
        show(hiddenReels);
    }

    // pages are shown again on every other path, since Facebook reuses <body> and [role=main] when navigating
    const blockReelsSection = path.includes(urls.reels) && settings.fb_blockReels;
    if (blockReelsSection) {
        const reelsPage = body?.querySelectorAll(selectors.main);
        hide(reelsPage, 'zenfeedReelsScreen');
    } else {
        const reelsPage = document.querySelectorAll(`${selectors.main}[data-zenfeed-reels-screen="true"]`);
        show(reelsPage, 'zenfeedReelsScreen');
    }

    const blockStoriesSection = path.includes(urls.stories) && settings.fb_blockStories;
    if (blockStoriesSection) {
        hide(body, 'zenfeedStoriesScreen');
    } else if (body?.dataset.zenfeedStoriesScreen) {
        show(body, 'zenfeedStoriesScreen');
    }

    if (path === urls.base) {
        if (settings.fb_blockStories) {
            const storyFeed = body?.querySelector(selectors.storyFeed);
            hide(storyFeed);
        } else {
            const storyFeed = document.querySelector(`${selectors.storyFeed}[data-zenfeed-hidden="true"]`);
            show(storyFeed);
        }

        if (settings.fb_blockPosts) {
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
    // Wait for body to exist
    if (!document.body) {
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    settings = await loadSettings();
    applySettings();
    
    // Now body exists, safe to observe
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}