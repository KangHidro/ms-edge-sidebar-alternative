let currentFavicon = '';

function sendFaviconUpdate() {
    const iconElement = document.querySelector('link[rel*="icon"]');
    if (iconElement && iconElement.href !== currentFavicon) {
        currentFavicon = iconElement.href;
        
        chrome.runtime.sendMessage({
            type: 'UPDATE_FAVICON',
            url: currentFavicon
        });
    }
}

sendFaviconUpdate();

const observer = new MutationObserver(() => {
    sendFaviconUpdate();
});

observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
});