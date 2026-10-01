chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "exportPage") {
    const pageUrl = window.location.href;

    chrome.storage.local.get(pageUrl, (result) => {
      const highlights = result[pageUrl] || [];

      if (message.format === "json") {
        downloadAsJson(pageUrl, highlights);
      } else {
        buildAndDownloadDoc(pageUrl, highlights);
      }
    });
  }
});

function downloadAsJson(pageUrl, highlights) {
  const exportData = { url: pageUrl, highlights };
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "highlights.json";
  link.click();
  URL.revokeObjectURL(url);
}

function buildAndDownloadDoc(pageUrl, highlights) {
  const urlParagraph = new docx.Paragraph({
    children: [new docx.TextRun({ text: pageUrl, italics: true })],
  });

  const highlightParagraphs = highlights.map((h) => {
    return new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: h.text,
          highlight: mapColorToWordHighlight(h.color),
          underline: h.underlined ? {} : undefined,
        }),
      ],
    });
  });

  const doc = new docx.Document({
    sections: [
      {
        children: [
          urlParagraph,
          new docx.Paragraph(""),
          ...highlightParagraphs,
        ],
      },
    ],
  });

  docx.Packer.toBlob(doc).then((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "highlights.docx";
    link.click();
    URL.revokeObjectURL(url);
  });
}

function mapColorToWordHighlight(color) {
  if (!color) return undefined;

  // color is an rgba(...) string — pull out the RGB numbers
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return undefined;

  const [, r, g, b] = match.map(Number);

  const wordColors = {
    yellow: [255, 255, 0],
    pink: [255, 105, 180],
    green: [60, 179, 113],
    blue: [30, 144, 255],
  };

  let closest = "yellow";
  let closestDistance = Infinity;

  for (const [name, [wr, wg, wb]] of Object.entries(wordColors)) {
    const distance = (r - wr) ** 2 + (g - wg) ** 2 + (b - wb) ** 2;
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = name;
    }
  }

  return closest;
}
