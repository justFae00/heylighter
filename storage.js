function saveHighlight(highlightData) {
  const pageUrl = window.location.href;

  chrome.storage.local.get(pageUrl, (result) => {
    const existingHighlights = result[pageUrl] || [];
    existingHighlights.push(highlightData);
    chrome.storage.local.set({ [pageUrl]: existingHighlights });
  });
}

function loadHighlights() {
  const pageUrl = window.location.href;

  chrome.storage.local.get(pageUrl, (result) => {
    const highlights = result[pageUrl] || [];

    highlights.forEach((highlightData) => {
      const location = findHighlightLocation(highlightData);
      if (!location) return;

      const range = buildRangeFromLocation(location);
      if (!range) return;

      applyHighlight(range, highlightData);
    });
  });
}

function updateHighlight(id, changes) {
  const pageUrl = window.location.href;
  chrome.storage.local.get(pageUrl, (result) => {
    const highlights = result[pageUrl] || [];
    const updated = highlights.map((h) =>
      h.id === id ? { ...h, ...changes } : h,
    );
    chrome.storage.local.set({ [pageUrl]: updated });
  });
}

function removeHighlightFromStorage(id) {
  const pageUrl = window.location.href;
  chrome.storage.local.get(pageUrl, (result) => {
    const highlights = result[pageUrl] || [];
    const filtered = highlights.filter((h) => h.id !== id);
    chrome.storage.local.set({ [pageUrl]: filtered });
  });
}
