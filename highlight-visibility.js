let highlightsHidden = false;
let visibilityFilter = "all"; // "all" | a color string | "underline"

function applyVisibilityFilter() {
  document.querySelectorAll("[data-highlight-id]").forEach((span) => {
    let visible = true;

    if (highlightsHidden) {
      visible = false;
    } else if (visibilityFilter === "underline") {
      visible = span.dataset.underlined === "true";
    } else if (visibilityFilter !== "all") {
      visible = span.dataset.color === visibilityFilter;
    }

    span.classList.toggle("highlight-filtered-out", !visible);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleVisibility") {
    highlightsHidden = !highlightsHidden;
    applyVisibilityFilter();
    sendResponse({ hidden: highlightsHidden, filter: visibilityFilter });
  }

  if (message.action === "setVisibilityFilter") {
    visibilityFilter = message.value;
    applyVisibilityFilter();
    sendResponse({ hidden: highlightsHidden, filter: visibilityFilter });
  }

  if (message.action === "getVisibilityState") {
    sendResponse({ hidden: highlightsHidden, filter: visibilityFilter });
  }
});
