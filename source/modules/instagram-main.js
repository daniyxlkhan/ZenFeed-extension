import { labelsArray, defaultSettings, selectors, urls, hide, show, migrateSettings, exploreReelTiles, exploreGridSection, reelsViewerLayers, reelsViewerScroller, reelInView, isInNestedScroller, pauseHiddenVideos } from "./instagram-lib.js";

let settings = { ...defaultSettings };

// a reel opened from a DM is a message from someone, so it still plays when Reels are hidden
let lastPath = window.location.pathname;
let directReelPath = null;
let directReelLock = null;

function trackNavigation(path) {
    if (path === lastPath) return;

    if (!path.includes(urls.reels)) {
        directReelPath = null;
    } else if (lastPath.startsWith(urls.direct)) {
        directReelPath = path;
    }
    lastPath = path;
}

// Instagram keeps the same URL when scrolling to the next reel from a DM,
// so lock the viewer to the reel that was opened instead
function updateDirectReelLock(path, main) {
    if (!settings.blockReels || path !== directReelPath) {
        directReelLock = null;
        const navButtons = document.querySelectorAll(`[data-zenfeed-reel-nav-hidden="true"]`);
        show(navButtons, 'zenfeedReelNavHidden');
        return;
    }

    const navButtons = [...document.querySelectorAll(selectors.reelsViewerNavButtons)]
        .map((button) => button.closest('[role=button]') ?? button);
    hide(navButtons, 'zenfeedReelNavHidden');

    if (directReelLock?.reel.isConnected) return;

    for (const layer of reelsViewerLayers(main)) {
        const scroller = reelsViewerScroller(layer);
        const reel = scroller && reelInView(scroller);
        if (reel) {
            directReelLock = { layer, scroller, reel };
            return;
        }
    }
}

// closing the viewer only removes nodes, which doesn't trigger applySettings
function activeDirectReelLock() {
    if (directReelLock && (!directReelLock.reel.isConnected || window.location.pathname !== directReelPath)) {
        directReelLock = null;
    }
    return directReelLock;
}

function blockDirectReelScroll(event) {
    const lock = activeDirectReelLock();
    if (!lock?.layer.contains(event.target) || isInNestedScroller(event.target, lock.scroller, lock.layer)) return;
    event.preventDefault();
}

function blockDirectReelKeys(event) {
    if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) return;
    if (!activeDirectReelLock() || event.target.closest?.('input, textarea, [contenteditable]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
}

function snapBackDirectReel(event) {
    const lock = activeDirectReelLock();
    if (event.target !== lock?.scroller || reelInView(lock.scroller) === lock.reel) return;
    const offset = lock.reel.getBoundingClientRect().top - lock.scroller.getBoundingClientRect().top;
    lock.scroller.scrollTo({ top: lock.scroller.scrollTop + offset, behavior: 'instant' });
}

async function loadSettings() {
    return new Promise(async (resolve) => {
        await migrateSettings();
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
    trackNavigation(path);

    if (settings.blockReels) {
        // reel links inside posts are left to blockFeedReels, and in DMs only the sidebar tab is hidden
        const inDirect = path.startsWith(urls.direct);
        const reelsLinks = [...(body?.querySelectorAll(selectors.nav.reels) ?? [])]
            .filter((link) => !link.closest(selectors.posts))
            .filter((link) => !inDirect || link.getAttribute('href') === urls.reelsTab);
        hide(reelsLinks);
    } else {
        const reelsLinks = document.querySelectorAll(`${selectors.nav.reels}[data-zenfeed-hidden="true"]`);
        show(reelsLinks);
    }

    // pages are shown again on every other path, since Instagram reuses <body> and [role=main] when navigating
    const blockStoriesSection = path.includes(urls.stories) && settings.blockStories;
    if (blockStoriesSection) {
        hide(body, 'zenfeedStoriesScreen');
    } else if (body?.dataset.zenfeedStoriesScreen) {
        show(body, 'zenfeedStoriesScreen');
    }

    const main = body?.querySelector(selectors.main);
    updateDirectReelLock(path, main);

    const blockReelsScreen = path.includes(urls.reels) && settings.blockReels && path !== directReelPath;
    if (blockReelsScreen) {
        hide(main, 'zenfeedReelsScreen');
        hide(reelsViewerLayers(main), 'zenfeedReelsViewer');
    } else {
        const reelsScreen = document.querySelectorAll(`${selectors.main}[data-zenfeed-reels-screen="true"]`);
        const reelsViewer = document.querySelectorAll(`body > [data-zenfeed-reels-viewer="true"]`);
        show(reelsScreen, 'zenfeedReelsScreen');
        show(reelsViewer, 'zenfeedReelsViewer');
    }

    // only the grid goes, so the search bar on Explore keeps working
    const onExplorePage = path === urls.explorePage || path.startsWith(urls.exploreSearch);
    if (onExplorePage && settings.blockExplorePage) {
        hide(exploreGridSection(main), 'zenfeedExploreHidden');
    } else if (!settings.blockExplorePage) {
        const exploreGrid = document.querySelectorAll(`[data-zenfeed-explore-hidden="true"]`);
        show(exploreGrid, 'zenfeedExploreHidden');
    }

    // a post opened from Explore is a /p/ modal over the grid, so tiles stay hidden until the setting is turned off
    if (path.includes(urls.explore) && settings.blockExploreReels) {
        hide(exploreReelTiles(main), 'zenfeedExploreReelHidden');
    } else if (!settings.blockExploreReels) {
        const exploreReels = document.querySelectorAll(`[data-zenfeed-explore-reel-hidden="true"]`);
        show(exploreReels, 'zenfeedExploreReelHidden');
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

    // runs after blockPosts so its show() can't reveal a hidden reel post
    if (settings.blockFeedReels) {
        const reelPosts = new Set([...(body?.querySelectorAll(selectors.reelPostLink) ?? [])]
            .map((link) => link.closest(selectors.posts)));
        hide([...reelPosts], 'zenfeedReelHidden');
        // the feed is virtualized and sizes its spacers with the hidden posts' old heights, so the
        // browser's scroll anchoring keeps pulling the page back up whenever posts are swapped in
        document.documentElement.style.overflowAnchor = 'none';
    } else {
        const reelPosts = document.querySelectorAll(`${selectors.posts}[data-zenfeed-reel-hidden="true"]`);
        show(reelPosts, 'zenfeedReelHidden');
        document.documentElement.style.overflowAnchor = '';
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

// going back (e.g. closing a post modal) can change the URL while only removing nodes
const observer = new MutationObserver((mutations) => {
    const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
    if (hasAddedNodes || window.location.pathname !== lastPath) {
        applySettings();
    }
});

// export main function for dynamic import
export async function main() {
    // the script runs at document_start, and observing a missing <body> would throw and stop all blocking
    if (!document.body) {
        await new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
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

    document.addEventListener('wheel', blockDirectReelScroll, { capture: true, passive: false });
    document.addEventListener('touchmove', blockDirectReelScroll, { capture: true, passive: false });
    window.addEventListener('keydown', blockDirectReelKeys, true);
    document.addEventListener('scroll', snapBackDirectReel, true);
    window.addEventListener('popstate', applySettings);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
