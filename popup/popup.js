import { defaultSettings as instagramSettings, labelsArray as instagramLabels } from "../modules/instagram-lib.js";
// import { defaultSettings as youtubeSettings, labelsArray as youtubeLabels } from "../modules/youtube-lib.js";
// import { defaultSettings as facebookSettings, labelsArray as facebookLabels } from "../modules/facebook-lib.js";

// Platform configuration - easy to add more platforms
const platforms = {
    instagram: {
        defaultSettings: instagramSettings,
        labelsArray: instagramLabels
    },
    // youtube: {
    //     defaultSettings: youtubeSettings,
    //     labelsArray: youtubeLabels
    // },
    // facebook: {
    //     defaultSettings: facebookSettings,
    //     labelsArray: facebookLabels
    // }
};

function saveOptions(platform) {
    const config = platforms[platform];
    const options = {};

    for (const label of config.labelsArray) {
        const element = document.getElementById(label);
        if (element !== null) {
            options[label] = element.checked;
        }
    }

    chrome.storage.sync.set(options);
}

function restoreOptions(platform) {
    const config = platforms[platform];
    
    chrome.storage.sync.get(config.labelsArray, (items) => {
        // get user settings if available, otherwise use default settings
        const settings = Object.keys(items).length > 0 ? items : config.defaultSettings;
        
        for (const key of Object.keys(settings)) {
            const element = document.getElementById(key);
            if (element) {
                element.checked = settings[key];
            }
        }
    });
}

function switchPlatform(platform) {
    document.querySelectorAll('[data-platform]').forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.querySelector(`[data-platform="${platform}"]`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // update dropdown to match the current platform
    const platformSelector = document.getElementById('platform');
    if (platformSelector) {
        platformSelector.value = platform;
    }

    chrome.storage.sync.set({ lastPlatform: platform });

    if (platforms[platform]) {
        restoreOptions(platform);
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    const platformSelector = document.getElementById('platform');

    // get the last selected platform
    const result = await chrome.storage.sync.get('lastPlatform');
    const lastPlatform = result.lastPlatform || 'instagram';

    switchPlatform(lastPlatform);
    
    platformSelector.addEventListener('change', (e) => {
        switchPlatform(e.target.value);
    });

    // listen on body for all checkbox changes
    document.body.addEventListener('change', async (e) => {
        if (e.target.type === 'checkbox' && e.target.closest('[data-platform]')) {
            const result = await chrome.storage.sync.get('lastPlatform');
            const currentPlatform = result.lastPlatform || 'instagram';

            saveOptions(currentPlatform);
        }
    });
});