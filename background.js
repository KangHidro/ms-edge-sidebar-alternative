const manifest = chrome.runtime.getManifest();
const TARGET_URL = manifest.custom_config ? manifest.custom_config.target_url : 'https://google.com';
const ICON_PATH = manifest.custom_config ? manifest.custom_config.icon_path : 'icon.png';

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
      console.log("favicon not found, using default icon.");
    });
}