# Markdown Lab

[![Deploy to GitHub Pages](https://github.com/phaldiya/markdown-lab/actions/workflows/deploy.yml/badge.svg)](https://github.com/phaldiya/markdown-lab/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://phaldiya.github.io/markdown-lab/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Bun](https://img.shields.io/badge/Bun-runtime-f9f1e1?logo=bun)](https://bun.sh/)

A feature-rich markdown viewer and editor that ships as both a web app and a Chrome extension. Write and preview markdown with GFM support, render LaTeX math, visualize Mermaid diagrams, and export to HTML or PDF — all client-side with zero backend.

## Features

- **GitHub Flavored Markdown** — Tables, task lists, strikethrough, autolinks, footnotes, and emoji
- **LaTeX Math** — Inline and block math rendering with KaTeX
- **Mermaid Diagrams** — Flowcharts, sequence diagrams, Gantt charts, pie charts, and more
- **Syntax Highlighting** — 100+ languages via highlight.js
- **Rich Editor Toolbar** — Grouped formatting, structure, insert, edit, and search actions with keyboard shortcuts
- **Split View** — Side-by-side editing with live preview and synchronized scrolling
- **Themes** — Multiple color themes with dark mode support, persisted across sessions
- **Table of Contents** — Auto-generated from headings with click-to-navigate
- **Frontmatter** — YAML frontmatter parsing and display
- **Export** — Standalone HTML export and PDF via print
- **Chrome Extension** — View `.md` files directly in the browser via side panel

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7 + SWC
- Tailwind CSS v4
- CodeMirror 6
- unified / remark / rehype pipeline
- Biome (lint/format)
- Vitest (unit tests) + Playwright (E2E)
- Bun as package manager/runtime

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server (port 5005)
bun run dev

# Run tests
bun run test

# Lint and format
bun run lint

# Production build
bun run build
```

## Keyboard Shortcuts

All shortcuts work in Edit and Split view modes.

### Markdown Formatting

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+B` | Bold |
| `Ctrl/Cmd+I` | Italic |
| `Ctrl/Cmd+Shift+X` | Strikethrough |
| `Ctrl/Cmd+E` | Inline Code |
| `Ctrl/Cmd+K` | Insert Link |
| `Ctrl/Cmd+F` | Find & Replace |

### Editor

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+Z` | Undo |
| `Ctrl/Cmd+Shift+Z` | Redo |
| `Tab` | Indent |
| `Shift+Tab` | Outdent |
| `Ctrl/Cmd+/` | Toggle comment |

## Editor Toolbar

The toolbar is organized into five groups:

1. **Text Formatting** — Bold, Italic, Strikethrough, Inline Code
2. **Structure** — Heading, Ordered List, Unordered List, Task List, Blockquote, Horizontal Rule
3. **Insert** — Link, Image, Code Block, Table
4. **Edit** — Undo, Redo
5. **Advanced** — Find & Replace

Select text and click a toolbar button to wrap the selection, or click with no selection to insert a placeholder.

## View Modes

- **View** (`/view`) — Full-width rendered preview with sidebar TOC
- **Edit** (`/edit`) — Full-width editor with toolbar
- **Split** (`/split`) — Side-by-side editor and preview with draggable divider

## Chrome Extension

Build and load the extension for viewing `.md` files directly in Chrome:

```bash
# Build extension
bun run build:extension

# Package as ZIP
bun run extension:zip
```

Load `dist-extension/` in `chrome://extensions` with Developer Mode enabled.

## Project Structure

```
src/
  main.tsx              # Entry point
  App.tsx               # Routes, pipeline runner, theme applicator
  index.css             # Tailwind + CSS variables + preview styles
  context/AppContext.tsx # State management (useReducer + Context)
  lib/                  # Markdown pipeline, TOC, export, themes, etc.
  components/
    layout/             # Header, Sidebar, StatusBar
    editor/             # EditorPanel, EditorToolbar
    preview/            # PreviewPanel, MermaidBlock, TableOfContents
    split/              # SplitView, ResizeDivider
    shared/             # Icons, ErrorBoundary, LoadingSpinner
extension/              # Chrome Extension (Manifest V3)
tests/                  # Unit tests (smoke + deep)
e2e/                    # Playwright E2E tests
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Dev server (port 5005) |
| `bun run build` | Type-check + production build |
| `bun run test` | Unit tests |
| `bun run test:smoke` | Smoke tests only |
| `bun run test:deep` | Deep tests only |
| `bun run lint` | Lint + format (auto-fix) |
| `bun run e2e` | Playwright E2E tests |
| `bun run verify` | Full verify: tests + E2E |
| `bun run build:extension` | Build Chrome extension |
| `bun run extension:zip` | Package extension as ZIP |

## License

MIT
