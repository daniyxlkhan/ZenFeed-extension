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

// let shortsEnabled = true;
// let CONFIG = YT_CONFIG;

// // loads initial state from storage
// chrome.storage.sync.get(['shortsEnabled'], (result) => {
//     shortsEnabled = result.shortsEnabled !== false;  // default to true

//     if (shortsEnabled) {
//         runHidingLogic();
//     }
// });

// // listens for toggle messages from popup
// chrome.runtime.onMessage.addListener((message) => {
//     if (message.action === 'toggleShorts') {
//         shortsEnabled = message.enabled;

//         if (shortsEnabled  && CONFIG) {
//             runHidingLogic();
//         } else {
//             showAllShorts();
//         }
//     }
// });

// // listen for storage changes (when settings change in other tabs)
// chrome.storage.onChanged.addListener((changes, areaName) => {
//     if (areaName === 'sync' && changes.shortsEnabled) {
//         shortsEnabled = changes.shortsEnabled.newValue;
        
//         if (shortsEnabled && CONFIG) {
//             runHidingLogic();
//         } else {
//             showAllShorts();
//         }
//     }
// });

// // extra safety on top of onChanged to listen for tab visibility changes (when switching tabs)
// document.addEventListener('visibilitychange', () => {
//     if (!document.hidden) {
//         // tab became visible, check current state
//         chrome.storage.sync.get(['shortsEnabled'], (result) => {
//             shortsEnabled = result.shortsEnabled !== false;
            
//             if (shortsEnabled && CONFIG) {
//                 runHidingLogic();
//             } else {
//                 showAllShorts();
//             }
//         });
//     }
// });

// // Position based hiding
// function hideShortsTabLargeView() {
//     const config = CONFIG.shorts_large_view;
//     const firstGuideSection = document.querySelector(config.parentSelector);
    
//     if (firstGuideSection) {
//         // get all children inside the parent section
//         const guideEntries = firstGuideSection.querySelectorAll(config.childSelector);
        
//         if (guideEntries.length > config.targetIndex) {
//             // the second one is shorts
//             const shortsEntry = guideEntries[config.targetIndex];
            
//             if (!shortsEntry.dataset.zenfeedHidden) {
//                 shortsEntry.style.display = 'none';
//                 shortsEntry.dataset.zenfeedHidden = 'true';
//             }
//         }
//     }
// }

// // Link based hiding
// function hideShorts() {
//     const config = CONFIG.shorts_links;
//     const sections = document.querySelectorAll(config.selector);
    
//     sections.forEach(link => {         
//         if (link.dataset.zenfeedHidden) return;
//         link.dataset.zenfeedHidden = 'true';

//         // try each container type from config
//         let parentContainer = null;
//         for (const containerSelector of config.containers) {
//             parentContainer = link.closest(containerSelector);
//             if (parentContainer) break;
//         }
        
//         if (parentContainer && !parentContainer.dataset.zenfeedHidden) {
//             parentContainer.style.display = 'none';
//             parentContainer.dataset.zenfeedHidden = 'true';
//         }
//     });
// }

// // Selector based hiding
// function hideShortsInHomeFeed() {
//     hideBySelectors(CONFIG.shorts_in_home_feed);
// }

// function hideShortsInSearchFeed() {
//     hideBySelectors(CONFIG.shorts_in_search_feed);
// }

// function hideShortsPlayer() {
//     hideBySelectors(CONFIG.shorts_player);
// }

// // Helper: Generic selector-based hiding
// function hideBySelectors(selectors) {
//     if (!selectors || selectors.length === 0) return;
    
//     selectors.forEach(selector => {
//         try {
//             const elements = document.querySelectorAll(selector);
            
//             elements.forEach(element => {
//                 if (!element.dataset.zenfeedHidden) {
//                     element.style.display = 'none';
//                     element.dataset.zenfeedHidden = 'true';
//                 }
//             });
//         } catch (error) {
//             // console.warn(`Selector failed: ${selector}`, error);
//         }
//     });
// }

// function showAllShorts() {
//     const hiddenElements = document.querySelectorAll('[data-zenfeed-hidden="true"]');

//     hiddenElements.forEach(element => {
//         element.style.display = '';
//         delete element.dataset.zenfeedHidden;
//     });
// }

// function runHidingLogic() {
//     hideShortsTabLargeView();
//     hideShorts();
//     hideShortsInHomeFeed();
//     hideShortsInSearchFeed();
//     hideShortsPlayer();
// }

// const observer1 = new MutationObserver((mutations) => {
//     if (!shortsEnabled || !CONFIG) return;
    
//     // only run if actual elements were added 
//     const hasAddedNodes = mutations.some(mutation => 
//         mutation.addedNodes.length > 0
//     );
    
//     if (hasAddedNodes) {
//         runHidingLogic();
//     }
// });

// observer1.observe(document.body, { childList: true, subtree: true });

// if (shortsEnabled && CONFIG) {
//     runHidingLogic();
// }