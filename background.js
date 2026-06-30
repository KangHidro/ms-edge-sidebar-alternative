const manifest = chrome.runtime.getManifest();
const TARGET_URL = manifest.custom_config ? manifest.custom_config.target_url : 'https://google.com';
const DEFAULT_ICON = 'icon.png';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
chrome.sidePanel.setOptions({
  path: TARGET_URL,
  enabled: true
});

chrome.runtime.onInstalled.addListener(() => {
  setDefaultIcon();
});

chrome.runtime.onStartup.addListener(() => {
  setDefaultIcon();
});

function setDefaultIcon() {
  chrome.action.setIcon({ path: DEFAULT_ICON }, () => {
    if (chrome.runtime.lastError) {
      console.log('Error fetching default icon', chrome.runtime.lastError.message);
    }
  });
}

async function updateIconFromUrl(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageBitmap, 0, 0, 32, 32);
    const imageData = ctx.getImageData(0, 0, 32, 32);

    chrome.action.setIcon({ imageData: { '32': imageData } }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting icon', chrome.runtime.lastError.message);
        setDefaultIcon();
      }
    });
  } catch (error) {
    console.error('Handle image error', error);
    setDefaultIcon();
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_FAVICON' && message.url) {
    updateIconFromUrl(message.url);
  }
});