import { describe, expect, it } from 'vitest';

import { appReducer, initialState } from '../../src/context/AppContext';
import { reduceActions } from '../helpers/testReducer';

describe('appReducer', () => {
  it('returns initial state for unknown action', () => {
    const result = appReducer(initialState, { type: 'UNKNOWN' } as never);
    expect(result).toBe(initialState);
  });

  it('SET_MODE changes view mode', () => {
    const result = appReducer(initialState, { type: 'SET_MODE', mode: 'edit' });
    expect(result.mode).toBe('edit');
  });

  it('SET_CONTENT updates editor content', () => {
    const result = appReducer(initialState, { type: 'SET_CONTENT', content: '# New' });
    expect(result.editor.content).toBe('# New');
  });

  it('SET_CURSOR updates cursor position', () => {
    const result = appReducer(initialState, { type: 'SET_CURSOR', line: 5, col: 10 });
    expect(result.editor.cursorLine).toBe(5);
    expect(result.editor.cursorCol).toBe(10);
  });

  it('SET_PREVIEW updates preview state', () => {
    const toc = [{ id: 'h1', text: 'Hello', level: 1 }];
    const fm = { title: 'Test' };
    const result = appReducer(initialState, {
      type: 'SET_PREVIEW',
      html: '<h1>Hello</h1>',
      toc,
      frontmatter: fm,
    });
    expect(result.preview.html).toBe('<h1>Hello</h1>');
    expect(result.preview.toc).toEqual(toc);
    expect(result.preview.frontmatter).toEqual(fm);
  });

  it('SET_STATS updates word count stats', () => {
    const stats = { words: 100, chars: 500, lines: 20, readTime: 1 };
    const result = appReducer(initialState, { type: 'SET_STATS', stats });
    expect(result.stats).toEqual(stats);
  });

  it('SET_FILE_SOURCE sets file source', () => {
    const result = appReducer(initialState, { type: 'SET_FILE_SOURCE', source: 'file:///test.md' });
    expect(result.fileSource).toBe('file:///test.md');
  });

  it('SET_FILE_SOURCE clears file source with null', () => {
    const withSource = appReducer(initialState, { type: 'SET_FILE_SOURCE', source: 'file:///test.md' });
    const result = appReducer(withSource, { type: 'SET_FILE_SOURCE', source: null });
    expect(result.fileSource).toBeNull();
  });

  it('SET_THEME changes theme', () => {
    const result = appReducer(initialState, { type: 'SET_THEME', theme: 'dracula' });
    expect(result.settings.theme).toBe('dracula');
  });

  it('TOGGLE_DARK_MODE toggles dark mode', () => {
    expect(initialState.settings.darkMode).toBe(false);
    const toggled = appReducer(initialState, { type: 'TOGGLE_DARK_MODE' });
    expect(toggled.settings.darkMode).toBe(true);
    const toggledBack = appReducer(toggled, { type: 'TOGGLE_DARK_MODE' });
    expect(toggledBack.settings.darkMode).toBe(false);
  });

  it('TOGGLE_SYNC_SCROLL toggles sync scroll', () => {
    expect(initialState.settings.syncScroll).toBe(true);
    const toggled = appReducer(initialState, { type: 'TOGGLE_SYNC_SCROLL' });
    expect(toggled.settings.syncScroll).toBe(false);
  });

  it('TOGGLE_SIDEBAR toggles sidebar', () => {
    expect(initialState.sidebarOpen).toBe(false);
    const toggled = appReducer(initialState, { type: 'TOGGLE_SIDEBAR' });
    expect(toggled.sidebarOpen).toBe(true);
  });

  it('SET_FONT_SIZE changes font size', () => {
    const result = appReducer(initialState, { type: 'SET_FONT_SIZE', size: 18 });
    expect(result.settings.fontSize).toBe(18);
  });

  it('TOGGLE_LINE_NUMBERS toggles line numbers', () => {
    expect(initialState.settings.lineNumbers).toBe(true);
    const toggled = appReducer(initialState, { type: 'TOGGLE_LINE_NUMBERS' });
    expect(toggled.settings.lineNumbers).toBe(false);
  });

  it('TOGGLE_WORD_WRAP toggles word wrap', () => {
    expect(initialState.settings.wordWrap).toBe(true);
    const toggled = appReducer(initialState, { type: 'TOGGLE_WORD_WRAP' });
    expect(toggled.settings.wordWrap).toBe(false);
  });

  it('SET_CUSTOM_CSS updates custom css', () => {
    const result = appReducer(initialState, { type: 'SET_CUSTOM_CSS', css: '.test { color: red; }' });
    expect(result.settings.customCss).toBe('.test { color: red; }');
  });

  it('LOAD_STATE merges partial state', () => {
    const result = appReducer(initialState, {
      type: 'LOAD_STATE',
      state: {
        mode: 'view',
        editor: { content: 'loaded content', cursorLine: 1, cursorCol: 1 },
        settings: { ...initialState.settings, darkMode: true, fontSize: 16 },
      },
    });
    expect(result.mode).toBe('view');
    expect(result.editor.content).toBe('loaded content');
    expect(result.settings.darkMode).toBe(true);
    expect(result.settings.fontSize).toBe(16);
  });

  it('LOAD_STATE preserves defaults for missing fields', () => {
    const result = appReducer(initialState, {
      type: 'LOAD_STATE',
      state: {},
    });
    expect(result.mode).toBe(initialState.mode);
    expect(result.editor.content).toBe(initialState.editor.content);
  });

  it('handles sequential actions correctly', () => {
    const result = reduceActions([
      { type: 'SET_MODE', mode: 'edit' },
      { type: 'SET_CONTENT', content: '# Test' },
      { type: 'TOGGLE_DARK_MODE' },
      { type: 'SET_FONT_SIZE', size: 16 },
    ]);
    expect(result.mode).toBe('edit');
    expect(result.editor.content).toBe('# Test');
    expect(result.settings.darkMode).toBe(true);
    expect(result.settings.fontSize).toBe(16);
  });
});
