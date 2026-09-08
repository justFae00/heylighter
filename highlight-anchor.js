function findAnchor(node) {
  // we might need to go back to parents node on simple case
  let current = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;

  // climb up the DOM tree until we find an element with an ID or class, or reach the body
  while (current && current !== document.body) {
    if (current.id) {
      return { element: current, selector: `#${current.id}` };
    }
    if (current.className && typeof current.className === "string") {
      return {
        element: current,
        selector: `.${current.className.trim().split(/\s+/).join(".")}`,
      };
    }
    current = current.parentNode;
  }
  return { element: document.body, selector: "body" };
}

// This function takes a node and traverses up the DOM tree to find the nearest ancestor element
function resolveAnchor(selector) {
  return document.querySelector(selector);
}
