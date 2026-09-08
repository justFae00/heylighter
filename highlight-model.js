function computeAbsoluteOffset(targetNode, targetOffset) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let total = 0;
  let node;

  while ((node = walker.nextNode())) {
    if (node === targetNode) {
      return total + targetOffset;
    }
    total += node.textContent.length;
  }

  return -1;
}

function createHighlightData(range, selectedText, anchor) {
  const CONTEXT_LENGTH = 20;

  const bookText = document.body.textContent;
  const selectionStart = computeAbsoluteOffset(
    range.startContainer,
    range.startOffset,
  );

  const before = bookText.slice(
    Math.max(0, selectionStart - CONTEXT_LENGTH),
    selectionStart,
  );
  const after = bookText.slice(
    selectionStart + selectedText.length,
    selectionStart + selectedText.length + CONTEXT_LENGTH,
  );

  const fullPattern = before + selectedText + after;
  const patternStart = selectionStart - before.length;

  let occurrence = 0;
  let searchFrom = 0;
  let foundAt;
  while ((foundAt = bookText.indexOf(fullPattern, searchFrom)) !== -1) {
    occurrence++;
    if (foundAt >= patternStart) break;
    searchFrom = foundAt + 1;
  }

  return {
    id: crypto.randomUUID(),
    text: selectedText,
    before,
    after,
    occurrence,
    anchorSelector: anchor.selector,
  };
}

// --- everything below this line is NEW ---

function findNthOccurrence(searchText, pattern, targetOccurrence) {
  let count = 0;
  let searchFrom = 0;
  let foundAt;

  while ((foundAt = searchText.indexOf(pattern, searchFrom)) !== -1) {
    count++;
    if (count === targetOccurrence) {
      return foundAt;
    }
    searchFrom = foundAt + 1;
  }

  return -1;
}

function findHighlightLocation(highlightData) {
  const pattern =
    highlightData.before + highlightData.text + highlightData.after;

  const anchorElement = resolveAnchor(highlightData.anchorSelector);
  if (anchorElement) {
    const anchorText = anchorElement.textContent;
    const foundAt = findNthOccurrence(
      anchorText,
      pattern,
      highlightData.occurrence,
    );
    if (foundAt !== -1) {
      return {
        scope: anchorElement,
        matchStart: foundAt + highlightData.before.length,
        matchLength: highlightData.text.length,
      };
    }
  }

  const bookText = document.body.textContent;
  const foundAtBook = findNthOccurrence(
    bookText,
    pattern,
    highlightData.occurrence,
  );
  if (foundAtBook !== -1) {
    return {
      scope: document.body,
      matchStart: foundAtBook + highlightData.before.length,
      matchLength: highlightData.text.length,
    };
  }

  const foundAtTextOnly = findNthOccurrence(
    bookText,
    highlightData.text,
    highlightData.occurrence,
  );
  if (foundAtTextOnly !== -1) {
    return {
      scope: document.body,
      matchStart: foundAtTextOnly,
      matchLength: highlightData.text.length,
    };
  }

  return null;
}

function findNodeAtOffset(scopeElement, targetOffset) {
  const walker = document.createTreeWalker(scopeElement, NodeFilter.SHOW_TEXT);
  let total = 0;
  let node;

  while ((node = walker.nextNode())) {
    const nodeLength = node.textContent.length;
    if (total + nodeLength >= targetOffset) {
      return { node, offsetInNode: targetOffset - total };
    }
    total += nodeLength;
  }

  return null;
}

function buildRangeFromLocation(location) {
  const startInfo = findNodeAtOffset(location.scope, location.matchStart);
  const endInfo = findNodeAtOffset(
    location.scope,
    location.matchStart + location.matchLength,
  );

  if (!startInfo || !endInfo) return null;

  const range = document.createRange();
  range.setStart(startInfo.node, startInfo.offsetInNode);
  range.setEnd(endInfo.node, endInfo.offsetInNode);

  return range;
}
