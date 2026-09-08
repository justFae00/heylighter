function styleSpan(span, highlightData) {
  span.style.backgroundColor = highlightData.color || "";
  span.style.textDecoration = highlightData.underlined ? "underline" : "";
}

function wrapInSpan(node, highlightData) {
  const span = document.createElement("span");
  styleSpan(span, highlightData);
  span.dataset.highlightId = highlightData.id;
  node.parentNode.replaceChild(span, node);
  span.appendChild(node);
}

function applyHighlight(range, highlightData) {
  if (
    range.startContainer === range.endContainer &&
    range.startContainer.nodeType === Node.TEXT_NODE
  ) {
    const start = range.startOffset;
    const end = range.endOffset;
    const selectedNode = range.startContainer.splitText(start);
    selectedNode.splitText(end - start);
    wrapInSpan(selectedNode, highlightData);
  } else {
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
    );
    const nodesToHighlight = [];
    let node;
    while ((node = walker.nextNode())) {
      if (range.intersectsNode(node)) nodesToHighlight.push(node);
    }

    nodesToHighlight.forEach((textNode) => {
      const isStart = textNode === range.startContainer;
      const isEnd = textNode === range.endContainer;
      let target = textNode;

      if (isStart) target = textNode.splitText(range.startOffset);
      if (isEnd) {
        const cutPoint = isStart
          ? range.endOffset - range.startOffset
          : range.endOffset;
        target.splitText(cutPoint);
      }

      wrapInSpan(target, highlightData);
    });
  }
}

function restyleSpans(id, changes) {
  document
    .querySelectorAll(`span[data-highlight-id="${id}"]`)
    .forEach((span) => {
      styleSpan(span, changes);
    });
}

function removeSpans(id) {
  document
    .querySelectorAll(`span[data-highlight-id="${id}"]`)
    .forEach((span) => {
      const parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
      parent.normalize();
    });
}
