let menuEnabled = true;

chrome.storage.local.get("highlighterSettings", (result) => {
  const settings = result.highlighterSettings || {};
  menuEnabled = settings.menuEnabled !== false;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setMenuEnabled") {
    menuEnabled = message.value;
  }
});
