chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "clearPage") {
    const ids = new Set();
    document.querySelectorAll("[data-highlight-id]").forEach((span) => {
      ids.add(span.dataset.highlightId);
    });

    ids.forEach((id) => removeSpans(id));

    const pageUrl = window.location.href;
    chrome.storage.local.set({ [pageUrl]: [] });
  }
});
