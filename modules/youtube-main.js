import { labelsArray, defaultSettings, selectors, urls, hide, show } from "./youtube-lib.js";

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

    if (settings.hideShorts) {
        const shortLinks = body?.querySelectorAll(selectors.shorts);
        const shortsHomeFeedContainer = body?.querySelectorAll(selectors.shortsContainers.homeFeed);
        const shortsSearchFeedContainer = body?.querySelectorAll(selectors.shortsContainers.searchFeed);
        hide(shortLinks);
        hide(shortsHomeFeedContainer);
        hide(shortsSearchFeedContainer);
    } else {
        const shortLinks = body?.querySelectorAll(`${selectors.shorts}[data-zenfeed-hidden="true"]`);
        const shortsHomeFeedContainer = body?.querySelectorAll(`${selectors.shortsContainers.homeFeed}[data-zenfeed-hidden="true"]`);
        const shortsSearchFeedContainer = body?.querySelectorAll(`${selectors.shortsContainers.searchFeed}[data-zenfeed-hidden="true"]`);
        show(shortLinks);
        show(shortsHomeFeedContainer);
        show(shortsSearchFeedContainer);
    }

    const hideShortsSection = path.includes(urls.shorts) && settings.hideShorts;
    if (hideShortsSection) {
        const main = body?.querySelector(selectors.shortsPlayer);
        hide(main);
    } else if (path.includes(urls.shorts)) {
        const main = body?.querySelector(`${selectors.shortsPlayer}[data-zenfeed-hidden="true"]`);
        hide(main);
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