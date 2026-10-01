document.addEventListener("mouseup", (event) => {
  if (!menuEnabled) return;

  const selection = window.getSelection();
  const selectedText = selection.toString();
  if (selectedText.length === 0) return;

  const range = selection.getRangeAt(0);

  const options = buildActionOptions(
    { color: null, underlined: false },
    (color) => {
      const anchor = findAnchor(range.commonAncestorContainer);
      const highlightData = createHighlightData(range, selectedText, anchor);
      highlightData.color = color;
      highlightData.underlined = false;
      applyHighlight(range, highlightData);
      saveHighlight(highlightData);
      applyVisibilityFilter();
    },
    () => {
      const anchor = findAnchor(range.commonAncestorContainer);
      const highlightData = createHighlightData(range, selectedText, anchor);
      highlightData.color = null;
      highlightData.underlined = true;
      applyHighlight(range, highlightData);
      saveHighlight(highlightData);
      applyVisibilityFilter();
    },
    () => {}, // no highlight exists yet, nothing to remove
  );

  showMenu(event.pageX, event.pageY, options);
});

loadHighlights();
applyVisibilityFilter();
