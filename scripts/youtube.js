function hideShorts() {
    const shortsElements = document.querySelectorAll('a[href*="/shorts"]');
    shortsElements.forEach((element) => {
        element.style.display = 'none';
    });
}

const observer = new MutationObserver(() => {
    hideShorts();
});

observer.observe(document.body, { childList: true, subtree: true });

hideShorts();