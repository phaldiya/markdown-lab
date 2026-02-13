export type ViewMode = 'view' | 'edit' | 'split';

export type ThemeId = 'github-light' | 'github-dark' | 'dracula' | 'solarized-light' | 'solarized-dark';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface Frontmatter {
  title?: string;
  author?: string;
  date?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface WordCountStats {
  words: number;
  chars: number;
  lines: number;
  readTime: number;
}

export interface EditorState {
  content: string;
  cursorLine: number;
  cursorCol: number;
}

export interface PreviewState {
  html: string;
  toc: TocHeading[];
  frontmatter: Frontmatter | null;
}

export interface SettingsState {
  theme: ThemeId;
  darkMode: boolean;
  syncScroll: boolean;
  fontSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  customCss: string;
}

export interface AppState {
  mode: ViewMode;
  editor: EditorState;
  preview: PreviewState;
  settings: SettingsState;
  fileSource: string | null;
  stats: WordCountStats;
  sidebarOpen: boolean;
}

export type AppAction =
  | { type: 'SET_MODE'; mode: ViewMode }
  | { type: 'SET_CONTENT'; content: string }
  | { type: 'SET_CURSOR'; line: number; col: number }
  | { type: 'SET_PREVIEW'; html: string; toc: TocHeading[]; frontmatter: Frontmatter | null }
  | { type: 'SET_STATS'; stats: WordCountStats }
  | { type: 'SET_FILE_SOURCE'; source: string | null }
  | { type: 'SET_THEME'; theme: ThemeId }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SYNC_SCROLL' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_FONT_SIZE'; size: number }
  | { type: 'TOGGLE_LINE_NUMBERS' }
  | { type: 'TOGGLE_WORD_WRAP' }
  | { type: 'SET_CUSTOM_CSS'; css: string }
  | { type: 'LOAD_STATE'; state: Partial<AppState> };

export interface MarkdownResult {
  html: string;
  toc: TocHeading[];
  frontmatter: Frontmatter | null;
}
