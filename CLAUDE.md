# Markdown Lab

Markdown viewer/editor that ships as both a web app and a Chrome extension. Supports GFM, LaTeX math (KaTeX), Mermaid diagrams, syntax highlighting, split-view editing, and themes.

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7 + SWC
- Tailwind CSS v4 (`@tailwindcss/vite`)
- CodeMirror 6 for editing
- unified/remark/rehype pipeline for markdown processing
- Biome 2.3 (lint/format)
- Vitest 4 (unit tests) + Playwright (E2E)
- Bun as package manager/runtime
- Chrome Extension Manifest V3

## Commands

```bash
bun run dev            # Dev server (port 5005)
bun run build          # Type-check + production build
bun run test           # Unit tests (vitest)
bun run test:watch     # Unit tests in watch mode
bun run test:smoke     # Smoke tests only
bun run test:deep      # Deep tests only
bun run lint           # Lint + format (auto-fix)
bun run lint:check     # Lint check (no fix)
bun run e2e            # Playwright E2E tests
bun run build:extension    # Build Chrome extension
bun run extension:icons    # Generate extension icons
bun run extension:zip      # Package extension as ZIP
bun run verify         # Full verify: tests + E2E
```

## Project Structure

```
src/
  main.tsx              # Entry: StrictMode + HashRouter
  App.tsx               # Routes (/view, /edit, /split), pipeline runner, theme applicator
  index.css             # Tailwind + CSS variables + markdown preview styles
  types/index.ts        # All TypeScript interfaces
  context/AppContext.tsx # useReducer + Provider + localStorage persistence
  lib/
    markdownPipeline.ts # unified/remark/rehype chain -> {html, toc, frontmatter}
    tocExtractor.ts     # Standalone TOC from markdown headings
    frontmatterParser.ts # YAML frontmatter extraction
    wordCount.ts        # Words, chars, lines, read time
    syncScroll.ts       # Proportional scroll sync between containers
    fileLoader.ts       # Load from URL + auto-reload polling
    exportHtml.ts       # Standalone HTML export
    exportPdf.ts        # PDF via window.print()
    storage.ts          # localStorage save/load
    themes.ts           # Theme definitions and CSS variable application
  components/
    layout/    Header, Sidebar (TOC), StatusBar
    shared/    ErrorBoundary, Icons, LoadingSpinner
    editor/    EditorPanel (CodeMirror 6), EditorToolbar
    preview/   PreviewPanel, MermaidBlock, TableOfContents, FrontmatterDisplay
    split/     SplitView, ResizeDivider
extension/
  manifest.json         # MV3: sidePanel + contextMenus + file access
  service-worker.js     # Side panel, new tab, .md URL detection
tests/
  smoke/   Quick pipeline, toc, frontmatter, wordcount, fileloader tests
  deep/    Thorough pipeline, GFM, math, mermaid, emoji, export, reducer tests
e2e/
  functional/  Navigation and feature tests
  visual/      Screenshot comparison tests
```

## Conventions

- **State:** React Context + useReducer (AppContext.tsx). All state changes via dispatch.
- **Routing:** HashRouter for GitHub Pages / extension compatibility. Routes: /view, /edit, /split.
- **Theming:** CSS custom properties in :root / .dark. Themes applied via `applyTheme()`.
- **Markdown:** Content -> unified pipeline -> {html, toc, frontmatter}. Mermaid rendered client-side after DOM insertion.
- **Lint:** Biome with strict rules. Run `bun run lint` before committing.
- **Tests:** Vitest with node environment. localStorage mocked in tests/setup.ts.
- **Extension:** Dual vite config. Extension build outputs to dist-extension/ with relative paths.
