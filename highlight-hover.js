document.addEventListener("mouseover", (event) => {
  const span = event.target.closest("[data-highlight-id]");
  if (!span) return;

  cancelMenuHide();

  const id = span.dataset.highlightId;
  const currentData = {
    color: span.style.backgroundColor || null,
    underlined: span.style.textDecoration === "underline",
  };

  const options = buildActionOptions(
    currentData,
    (color) => {
      const newColor = currentData.color === color ? null : color;
      restyleSpans(id, { color: newColor, underlined: currentData.underlined });
      updateHighlight(id, { color: newColor });
    },
    () => {
      const newUnderlined = !currentData.underlined;
      restyleSpans(id, { color: currentData.color, underlined: newUnderlined });
      updateHighlight(id, { underlined: newUnderlined });
    },
    () => {
      removeSpans(id);
      removeHighlightFromStorage(id);
    },
  );

  const rect = span.getBoundingClientRect();
  showMenu(rect.left + window.scrollX, rect.bottom + window.scrollY, options);
});

document.addEventListener("mouseout", (event) => {
  const span = event.target.closest("[data-highlight-id]");
  if (!span) return;
  scheduleMenuHide();
});
