document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const selectedText = selection.toString();
  if (selectedText.length === 0) return;

  const range = selection.getRangeAt(0);

  // ONE id for this whole highlight action
  const highlightID = crypto.randomUUID();

  function wrapInSpan(node) {
    const span = document.createElement("span");
    span.style.backgroundColor = "pink";
    span.dataset.highlightId = highlightID;
    node.parentNode.replaceChild(span, node);
    span.appendChild(node);
  }

  // simple case: selection is within a single text node
  if (
    range.startContainer === range.endContainer &&
    range.startContainer.nodeType === Node.TEXT_NODE
  ) {
    const start = range.startOffset;
    const end = range.endOffset;

    const selectedNode = range.startContainer.splitText(start);
    selectedNode.splitText(end - start);
    wrapInSpan(selectedNode);
    return;
  }

  // complex case: selection spans multiple nodes
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
  );

  const nodesToHighlight = [];
  let node;
  while ((node = walker.nextNode())) {
    if (range.intersectsNode(node)) {
      nodesToHighlight.push(node);
    }
  }

  nodesToHighlight.forEach((textNode) => {
    const isStart = textNode === range.startContainer;
    const isEnd = textNode === range.endContainer;

    let target = textNode;

    if (isStart) {
      target = textNode.splitText(range.startOffset);
    }
    if (isEnd) {
      const cutPoint = isStart
        ? range.endOffset - range.startOffset
        : range.endOffset;
      target.splitText(cutPoint);
    }

    wrapInSpan(target);
  });

  //const highlightSpan = document.createElement("span");
  //highlightSpan.style.backgroundColor = "pink";

  //range.surroundContents(highlightSpan);

  //selection.removeAllRanges();
});
