import { defaultSettings as instagramSettings, labelsArray as instagramLabels } from "../modules/instagram-lib.js";
import { defaultSettings as youtubeSettings, labelsArray as youtubeLabels } from "../modules/youtube-lib.js";
import { defaultSettings as facebookSettings, labelsArray as facebookLabels } from "../modules/facebook-lib.js";

// Platform configurations
const platforms = {
    instagram: {
        defaultSettings: instagramSettings,
        labelsArray: instagramLabels
    },
    youtube: {
        defaultSettings: youtubeSettings,
        labelsArray: youtubeLabels
    },
    facebook: {
        defaultSettings: facebookSettings,
        labelsArray: facebookLabels
    }
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
    // Hide all toggle lists
    document.querySelectorAll('.toggle-list').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected platform
    const selectedSection = document.querySelector(`.toggle-list[data-platform="${platform}"]`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update tab active state
    document.querySelectorAll('.platform-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.platform === platform) {
            tab.classList.add('active');
        }
    });

    chrome.storage.sync.set({ lastPlatform: platform });

    if (platforms[platform]) {
        restoreOptions(platform);
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    const tabs = document.querySelectorAll('.platform-tabs .tab');
    const supportLink = document.getElementById('supportLink');
    const backButton = document.getElementById('backButton');
    const supportView = document.getElementById('supportView');
    const mainView = document.getElementById('mainView');

    // Auto-detect platform from current tab
    let detectedPlatform = 'instagram'; // default
    try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = activeTab.url;
        
        if (url.includes('instagram.com')) {
            detectedPlatform = 'instagram';
        } else if (url.includes('youtube.com')) {
            detectedPlatform = 'youtube';
        } else if (url.includes('facebook.com')) {
            detectedPlatform = 'facebook';
        } else {
            // Not on a supported platform, use last selected
            const result = await chrome.storage.sync.get('lastPlatform');
            detectedPlatform = result.lastPlatform || 'instagram';
        }
    } catch (error) {
        // Fallback to last platform
        const result = await chrome.storage.sync.get('lastPlatform');
        detectedPlatform = result.lastPlatform || 'instagram';
    }

    switchPlatform(detectedPlatform);
    
    // Tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchPlatform(tab.dataset.platform);
        });
    });

    // listen on body for all checkbox changes
    document.body.addEventListener('change', async (e) => {
        if (e.target.type === 'checkbox' && e.target.closest('[data-platform]')) {
            const result = await chrome.storage.sync.get('lastPlatform');
            const currentPlatform = result.lastPlatform || 'instagram';

            saveOptions(currentPlatform);
        }
    });

    // support page navigation
    supportLink.addEventListener('click', (e) => {
        e.preventDefault();
        mainView.style.display = 'none';
        supportView.style.display = 'block';
    });

    backButton.addEventListener('click', () => {
        supportView.style.display = 'none';
        mainView.style.display = 'block';
    });
});