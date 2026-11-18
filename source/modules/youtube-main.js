import { labelsArray, defaultSettings, selectors, urls, hide, show, pauseHiddenVideos } from "./youtube-lib.js";

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
        // closest() instead of :has(), which Firefox < 121 doesn't support
        const shortsTabContainer = [...(body?.querySelectorAll(selectors.shortsContainers.longShortsTab) ?? [])]
            .map((link) => link.closest(selectors.shortsContainers.longShortsTabEntry));
        const shortsRecommendedContainer = body?.querySelectorAll(selectors.shortsContainers.recommendedFeed);
        hide(shortLinks);
        hide(shortsHomeFeedContainer);
        hide(shortsSearchFeedContainer);
        hide(shortsTabContainer);
        hide(shortsRecommendedContainer);
    } else {
        const shortLinks = body?.querySelectorAll(`${selectors.shorts}[data-zenfeed-hidden="true"]`);
        const shortsHomeFeedContainer = body?.querySelectorAll(`${selectors.shortsContainers.homeFeed}[data-zenfeed-hidden="true"]`);
        const shortsSearchFeedContainer = body?.querySelectorAll(`${selectors.shortsContainers.searchFeed}[data-zenfeed-hidden="true"]`);
        const shortsTabContainer = body?.querySelectorAll(`${selectors.shortsContainers.longShortsTabEntry}[data-zenfeed-hidden="true"]`);
        const shortsRecommendedContainer = body?.querySelectorAll(`${selectors.shortsContainers.recommendedFeed}[data-zenfeed-hidden="true"]`);
        show(shortLinks);
        show(shortsHomeFeedContainer);
        show(shortsSearchFeedContainer);
        show(shortsTabContainer);
        show(shortsRecommendedContainer);
    }

    if (settings.hideSubscriptions) {
        const subscriptions = body?.querySelectorAll(selectors.subscriptions);
        const sideBarSubscriptionList = body?.querySelectorAll(selectors.subscriptionContainers.sideBarSubscriptionList);
        hide(subscriptions);
        hide(sideBarSubscriptionList);
    } else {
        const subscriptions = body?.querySelectorAll(`${selectors.subscriptions}[data-zenfeed-hidden="true"]`);
        const sideBarSubscriptionList = body?.querySelectorAll(`${selectors.subscriptionContainers.sideBarSubscriptionList}[data-zenfeed-hidden="true"]`);
        show(subscriptions);
        show(sideBarSubscriptionList);
    }

    if (settings.hideRecommendedVideosSideBar) {
        const recommendedVideos = body?.querySelector(selectors.recommendedVideosSideBar);
        hide(recommendedVideos);
    } else {
        const recommendedVideos = body?.querySelector(`${selectors.recommendedVideosSideBar}[data-zenfeed-hidden="true"]`);
        show(recommendedVideos);
    }

    const hideSubscriptions = path.includes(urls.subscriptions) && settings.hideSubscriptions;
    if (hideSubscriptions) {
        const subscriptionsPage = body?.querySelector(selectors.subscriptionContainers.subscriptionsPage);
        hide(subscriptionsPage);
    } else {
        const subscriptionsPage = body?.querySelector(`${selectors.subscriptionContainers.subscriptionsPage}[data-zenfeed-hidden="true"]`);
        show(subscriptionsPage);
    }

    const hideHomeFeed = path.includes(urls.base) && settings.hideHomeFeed;
    if (hideHomeFeed) {
        const homePage = body?.querySelector(selectors.homePage);
        hide(homePage);
    } else {
        const homePage = body?.querySelector(`${selectors.homePage}[data-zenfeed-hidden="true"]`);
        show(homePage);
    }

    const hideShortsSection = path.includes(urls.shorts) && settings.hideShorts;
    if (hideShortsSection) {
        const main = body?.querySelector(selectors.shortsPlayer);
        hide(main);
    } else if (path.includes(urls.shorts)) {
        const main = body?.querySelector(`${selectors.shortsPlayer}[data-zenfeed-hidden="true"]`);
        show(main);
    }

    pauseHiddenVideos();
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

    // 'play' doesn't bubble, so listen in the capture phase
    document.addEventListener('play', (event) => {
        if (event.target.closest?.(selectors.hiddenByZenfeed)) {
            event.target.pause();
        }
    }, true);
    
    // Now body exists, safe to observe
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}