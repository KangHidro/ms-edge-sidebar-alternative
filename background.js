const manifest = chrome.runtime.getManifest();
const TARGET_URL = manifest.custom_config ? manifest.custom_config.target_url : 'https://google.com';
const DEFAULT_ICON = 'icon.png';

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.sidePanel.setOptions({
  path: TARGET_URL,
  enabled: true
});

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
    console.error('Error update favicon:', error);
    chrome.action.setIcon({ path: DEFAULT_ICON });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_FAVICON' && message.url) {
    updateIconFromUrl(message.url);
  }
});