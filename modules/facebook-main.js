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

    if (settings.hideReels) {
        const reelLinks = body?.querySelectorAll(selectors.reels);
        reelLinks?.forEach(link => {
            // Walk up levels to get the container
            let container = link;
            for (let i = 0; i < 3 && container.parentElement; i++) {
                container = container.parentElement;
            }
            hide(container);
        });
    } else {
        const hiddenReels = document.querySelectorAll(`[data-zenfeed-hidden="true"]`);
        show(hiddenReels);
    }

    const hideReelsSection = path.includes(urls.reels) && settings.hideReels;
    if (hideReelsSection) {
        const reelsPage = body?.querySelectorAll(selectors.main);
        hide(reelsPage);
    } else if (path.includes(urls.reels)) {
        const reelsPage = document.querySelectorAll(`${selectors.main}[data-zenfeed-hidden="true"]`);
        show(reelsPage);
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