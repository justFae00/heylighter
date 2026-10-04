const visibilityToggle = document.getElementById("visibilityToggle");
const menuToggle = document.getElementById("menuToggle");
const filterTrigger = document.getElementById("filterTrigger");
const filterPopover = document.getElementById("filterPopover");
const filterPreview = document.getElementById("filterPreview");
const statusDot = document.getElementById("statusDot");
const statusDomain = document.getElementById("statusDomain");
const countBadge = document.getElementById("countBadge");

let activeTabId = null;
let currentFilter = "all";

function renderFilterPreview(filter) {
  filterPreview.innerHTML = "";
  if (filter === "all") {
    filterPreview.textContent = "All";
    return;
  }
  if (filter === "underline") {
    filterPreview.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2" fill="none">
<rect width="14" height="2" rx="1" fill="#5F5F5F"/>
</svg>`;
    return;
  }
  const match = HIGHLIGHT_COLORS.find((c) => c.value === filter);
  const dot = document.createElement("span");
  dot.className = "preview-dot";
  dot.style.background = match ? match.display : filter;
  filterPreview.appendChild(dot);
}

function highlightActiveChip() {
  filterPopover.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.toggle("selected", chip.dataset.filter === currentFilter);
  });
}

function buildFilterPopover() {
  const allChip = document.createElement("button");
  allChip.className = "filter-chip text";
  allChip.textContent = "All";
  allChip.dataset.filter = "all";
  filterPopover.appendChild(allChip);

  HIGHLIGHT_COLORS.forEach((c) => {
    const chip = document.createElement("button");
    chip.className = "filter-chip swatch";
    chip.dataset.filter = c.value;
    chip.innerHTML = `<span class="color-fill" style="background:${c.display}"></span>`;
    filterPopover.appendChild(chip);
  });

  const underlineChip = document.createElement("button");
  underlineChip.className = "filter-chip";
  underlineChip.dataset.filter = "underline";
  underlineChip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2" fill="none">
<rect width="14" height="2" rx="1" fill="#5F5F5F"/>
</svg>`;
  filterPopover.appendChild(underlineChip);

  filterPopover.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      currentFilter = chip.dataset.filter;
      renderFilterPreview(currentFilter);
      highlightActiveChip();
      filterPopover.classList.remove("open");
      chrome.tabs.sendMessage(activeTabId, {
        action: "setVisibilityFilter",
        value: currentFilter,
      });
    });
  });
}

// --- everything below runs once, at the top level, when the popup opens ---

filterTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  filterPopover.classList.toggle("open");
});

document.addEventListener("click", () => {
  filterPopover.classList.remove("open");
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  activeTabId = tab.id;

  try {
    statusDomain.textContent = new URL(tab.url).hostname;
    statusDot.classList.add("on");
  } catch {
    statusDomain.textContent = "Not a webpage";
  }

  chrome.storage.local.get(tab.url, (result) => {
    const count = (result[tab.url] || []).length;
    countBadge.textContent = `${count} highlight${count === 1 ? "" : "s"}`;
  });

  chrome.tabs.sendMessage(
    tab.id,
    { action: "getVisibilityState" },
    (response) => {
      if (chrome.runtime.lastError || !response) return;
      visibilityToggle.checked = !response.hidden;
      currentFilter = response.filter || "all";
      renderFilterPreview(currentFilter);
      highlightActiveChip();
    },
  );

  chrome.storage.local.get("highlighterSettings", (result) => {
    const settings = result.highlighterSettings || {};
    menuToggle.checked = settings.menuEnabled !== false;
  });
});

buildFilterPopover();
renderFilterPreview(currentFilter);
highlightActiveChip();

visibilityToggle.addEventListener("change", () => {
  chrome.tabs.sendMessage(
    activeTabId,
    { action: "toggleVisibility" },
    (response) => {
      if (response) visibilityToggle.checked = !response.hidden;
    },
  );
});

menuToggle.addEventListener("change", () => {
  const enabled = menuToggle.checked;
  chrome.storage.local.set({ highlighterSettings: { menuEnabled: enabled } });
  chrome.tabs.sendMessage(activeTabId, {
    action: "setMenuEnabled",
    value: enabled,
  });
});

document.getElementById("exportJson").addEventListener("click", () => {
  chrome.tabs.sendMessage(activeTabId, {
    action: "exportPage",
    format: "json",
  });
});

document.getElementById("exportWord").addEventListener("click", () => {
  chrome.tabs.sendMessage(activeTabId, {
    action: "exportPage",
    format: "word",
  });
});

document.getElementById("clearPage").addEventListener("click", () => {
  const confirmed = confirm(
    "Remove all highlights from this page? This can't be undone.",
  );
  if (!confirmed) return;
  chrome.tabs.sendMessage(activeTabId, { action: "clearPage" });
  countBadge.textContent = "0 highlights";
});
