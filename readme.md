# Heylighter

A browser extension (Chrome & Edge) for highlighting and annotating any webpage, with highlights saved locally and restored automatically the next time you visit.

## Features

- **Highlight any text** on any page, in one of several colors
- **Underline** text, independently of (or combined with) a highlight color
- **Hover menu** on existing highlights to change color, toggle underline, or remove them
- **Persistent across reloads** — highlights are saved locally and reapplied automatically when you revisit a page, even if the page content has shifted somewhat
- **Toolbar popup** with:
  - Live highlight count for the current page
  - Show/hide all highlights
  - Filter view to show only one color or only underlines at a time
  - Export all highlights on the page as a **Word document** (`.docx`, with matching highlight colors) or as raw **JSON**
  - Clear all highlights on the current page (with confirmation)
- Light/dark theme support, following your system preference

## Installation (unpacked / developer mode)

1. Download or clone this repository.
2. Open `edge://extensions` (or `chrome://extensions`) in your browser.
3. Enable **Developer mode** (toggle, usually top-right).
4. Click **Load unpacked** and select this project's folder.
5. The Heylighter icon should appear in your toolbar.

## How it works

- Selecting text on a page shows a small menu to apply a color or underline.
- Hovering an existing highlight shows the same menu, plus an option to remove it.
- Each highlight is saved with its text, some surrounding context, which numbered occurrence it is, and a reference to its nearest identifiable container element. On reload, this combination is used to relocate the highlight even if the page isn't pixel-for-pixel identical to when it was created.
- All data is stored locally via `chrome.storage.local`, keyed by page URL — nothing is sent to a server.

## Project structure

| File                                    | Responsibility                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| `manifest.json`                         | Extension configuration and permissions                                               |
| `content.js`                            | Orchestrates the highlight-creation flow on text selection                            |
| `highlight-anchor.js`                   | Finds/resolves a nearby identifiable container element for a highlight                |
| `highlight-model.js`                    | Builds and relocates highlight data (text, context, occurrence)                       |
| `highlight-dom.js`                      | Creates, restyles, and removes the actual `<span>` elements on the page               |
| `highlight-options.js`                  | Builds the shared menu button list (colors, underline, remove)                        |
| `highlight-hover.js`                    | Shows the menu when hovering an existing highlight                                    |
| `highlight-visibility.js`               | Show/hide and filter logic for highlights                                             |
| `highlight-settings.js`                 | Enable/disable the selection and hover menu                                           |
| `clearing.js`                           | Clears all highlights on the current page                                             |
| `export.js`                             | Exports highlights as `.docx` or `.json`                                              |
| `storage.js`                            | Reads/writes highlight data to `chrome.storage.local`                                 |
| `menu.js` / `menu.css`                  | The floating in-page menu UI                                                          |
| `colors.js`                             | Shared list of highlight colors                                                       |
| `popup.html` / `popup.css` / `popup.js` | Toolbar popup UI and logic                                                            |
| `docx.min.js`                           | Third-party library ([docx](https://www.npmjs.com/package/docx)) used for Word export |
