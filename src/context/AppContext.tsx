import { createContext, type ReactNode, useContext, useEffect, useReducer } from 'react';

import { loadState, saveState } from '../lib/storage';
import type { AppAction, AppState } from '../types';

const DEFAULT_CONTENT = `# Welcome to Markdown Lab

Write your markdown here and see it rendered in real-time.

## Features

- **GFM** support (tables, task lists, strikethrough)
- LaTeX math: $E = mc^2$
- Mermaid diagrams
- Syntax highlighting
- Table of contents
- Dark mode

## Example

\`\`\`javascript
function hello() {
  console.log('Hello, Markdown Lab!');
}
\`\`\`

> Start editing to see the preview update!
`;

export const initialState: AppState = {
  mode: 'split',
  editor: {
    content: DEFAULT_CONTENT,
    cursorLine: 1,
    cursorCol: 1,
  },
  preview: {
    html: '',
    toc: [],
    frontmatter: null,
  },
  settings: {
    theme: 'github-light',
    darkMode: false,
    syncScroll: true,
    fontSize: 14,
    lineNumbers: true,
    wordWrap: true,
    customCss: '',
  },
  fileSource: null,
  stats: { words: 0, chars: 0, lines: 0, readTime: 0 },
  sidebarOpen: false,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return state.mode === action.mode ? state : { ...state, mode: action.mode };

    case 'SET_CONTENT':
      return state.editor.content === action.content
        ? state
        : { ...state, editor: { ...state.editor, content: action.content } };

    case 'SET_CURSOR':
      return state.editor.cursorLine === action.line && state.editor.cursorCol === action.col
        ? state
        : { ...state, editor: { ...state.editor, cursorLine: action.line, cursorCol: action.col } };

    case 'SET_PREVIEW':
      return {
        ...state,
        preview: { html: action.html, toc: action.toc, frontmatter: action.frontmatter },
      };

    case 'SET_STATS':
      return { ...state, stats: action.stats };

    case 'SET_FILE_SOURCE':
      return { ...state, fileSource: action.source };

    case 'SET_THEME':
      return { ...state, settings: { ...state.settings, theme: action.theme } };

    case 'TOGGLE_DARK_MODE':
      return { ...state, settings: { ...state.settings, darkMode: !state.settings.darkMode } };

    case 'TOGGLE_SYNC_SCROLL':
      return { ...state, settings: { ...state.settings, syncScroll: !state.settings.syncScroll } };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'SET_FONT_SIZE':
      return { ...state, settings: { ...state.settings, fontSize: action.size } };

    case 'TOGGLE_LINE_NUMBERS':
      return { ...state, settings: { ...state.settings, lineNumbers: !state.settings.lineNumbers } };

    case 'TOGGLE_WORD_WRAP':
      return { ...state, settings: { ...state.settings, wordWrap: !state.settings.wordWrap } };

    case 'SET_CUSTOM_CSS':
      return { ...state, settings: { ...state.settings, customCss: action.css } };

    case 'LOAD_STATE': {
      const loaded = action.state;
      return {
        ...state,
        mode: loaded.mode ?? state.mode,
        editor: {
          ...state.editor,
          content: loaded.editor?.content ?? state.editor.content,
        },
        settings: {
          ...state.settings,
          ...loaded.settings,
        },
      };
    }

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      dispatch({ type: 'LOAD_STATE', state: saved });
    }
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.settings.darkMode);
  }, [state.settings.darkMode]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
