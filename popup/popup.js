import { defaultSettings, labelsArray } from "../modules/instagram-lib.js";

function saveOptions() {
    const options = {};

    for (const label of labelsArray) {
        const element = document.getElementById(label);
        if (element !== null) {
            options[label] = element.checked;
        }
    }

    chrome.storage.sync.set(options);
}

function restoreOptions() {
    chrome.storage.sync.get(labelsArray, (items) => {
        // get user setting if available otherwise use the default settings
        const settings = Object.keys(items).length > 0 ? items : defaultSettings;
        
        for (const key of Object.keys(settings)) {
            const element = document.getElementById(key);
            if (element) {
                element.checked = settings[key];
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();

    // add change listeners to all checkboxes for instant saving
    for (const label of labelsArray) {
        const element = document.getElementById(label);
        if (element) {
            element.addEventListener('change', saveOptions);
        }
    }
});