const manifest = chrome.runtime.getManifest();
const TARGET_URL = manifest.custom_config ? manifest.custom_config.target_url : 'https://google.com';
const ICON_PATH = manifest.custom_config ? (manifest.custom_config.icon_path || 'icon.png') : 'icon.png';

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  checkAndSetIcon();
});

chrome.runtime.onStartup.addListener(() => {
  checkAndSetIcon();
});

chrome.sidePanel.setOptions({
  path: TARGET_URL,
  enabled: true
});

function checkAndSetIcon() {
  fetch(chrome.runtime.getURL(ICON_PATH))
    .then((response) => {
      if (response.ok) {
        chrome.action.setIcon({ path: ICON_PATH });
      }
    })
    .catch(() => {
      console.log('favicon not found, using default icon.');
    });
}

async function updateIconFromUrl(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);

        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageBitmap, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        chrome.action.setIcon({ imageData: imageData });
    } catch (error) {
        console.error('update icon error', error);
        checkAndSetIcon();
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_FAVICON' && message.url) {
        updateIconFromUrl(message.url);
    }
});