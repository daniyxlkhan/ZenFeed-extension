// dynamic import to use modules in the content script
(async () => {
    const hostname = window.location.hostname;
    
    let modulePath;
    
    if (hostname.includes('instagram.com')) {
        modulePath = './modules/instagram-main.js';
    } else if (hostname.includes('youtube.com')) {
        modulePath = './modules/youtube-main.js';
    } else if (hostname.includes('facebook.com')) {
        modulePath = './modules/facebook-main.js';
    }
    
    const src = chrome.runtime.getURL(modulePath);
    const contentScript = await import(src);
    contentScript.main();
})();