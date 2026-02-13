import { describe, expect, it } from 'vitest';

import { getToolbarKeymap } from '../../src/components/editor/EditorToolbar';

function createMockView(content = '', selFrom = 0, selTo = 0) {
  const doc = {
    lineAt: (_pos: number) => ({ from: 0, number: 1 }),
    toString: () => content,
    length: content.length,
  };
  const state = {
    selection: { main: { from: selFrom, to: selTo, head: selTo } },
    doc,
    sliceDoc: (from: number, to: number) => content.slice(from, to),
  };
  const dispatched: unknown[] = [];
  return {
    state,
    dispatch: (tr: unknown) => dispatched.push(tr),
    focus: () => {},
    dispatched,
  };
}

describe('getToolbarKeymap', () => {
  it('returns an array of keybindings', () => {
    const keymap = getToolbarKeymap();
    expect(Array.isArray(keymap)).toBe(true);
    expect(keymap.length).toBeGreaterThan(0);
  });

  it('returns exactly 5 custom keybindings', () => {
    const keymap = getToolbarKeymap();
    expect(keymap).toHaveLength(5);
  });

  it('includes Bold shortcut (Mod-b)', () => {
    const keymap = getToolbarKeymap();
    const bold = keymap.find((k) => k.key === 'Mod-b');
    expect(bold).toBeDefined();
    expect(typeof bold!.run).toBe('function');
  });

  it('includes Italic shortcut (Mod-i)', () => {
    const keymap = getToolbarKeymap();
    const italic = keymap.find((k) => k.key === 'Mod-i');
    expect(italic).toBeDefined();
  });

  it('includes Strikethrough shortcut (Mod-Shift-x)', () => {
    const keymap = getToolbarKeymap();
    const strike = keymap.find((k) => k.key === 'Mod-Shift-x');
    expect(strike).toBeDefined();
  });

  it('includes Inline Code shortcut (Mod-e)', () => {
    const keymap = getToolbarKeymap();
    const code = keymap.find((k) => k.key === 'Mod-e');
    expect(code).toBeDefined();
  });

  it('includes Link shortcut (Mod-k)', () => {
    const keymap = getToolbarKeymap();
    const link = keymap.find((k) => k.key === 'Mod-k');
    expect(link).toBeDefined();
  });

  it('excludes native Undo shortcut (Mod-z)', () => {
    const keymap = getToolbarKeymap();
    const undo = keymap.find((k) => k.key === 'Mod-z');
    expect(undo).toBeUndefined();
  });

  it('excludes native Redo shortcut (Mod-Shift-z)', () => {
    const keymap = getToolbarKeymap();
    const redo = keymap.find((k) => k.key === 'Mod-Shift-z');
    expect(redo).toBeUndefined();
  });

  it('excludes native Find shortcut (Mod-f)', () => {
    const keymap = getToolbarKeymap();
    const find = keymap.find((k) => k.key === 'Mod-f');
    expect(find).toBeUndefined();
  });

  it('all bindings have unique keys', () => {
    const keymap = getToolbarKeymap();
    const keys = keymap.map((k) => k.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('all run functions return true', () => {
    const keymap = getToolbarKeymap();
    const view = createMockView();
    for (const binding of keymap) {
      // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
      const result = binding.run!(view as any, {} as any);
      expect(result).toBe(true);
    }
  });
});

describe('toolbar keybinding actions', () => {
  it('Bold inserts **bold text** at cursor', () => {
    const view = createMockView();
    const keymap = getToolbarKeymap();
    const bold = keymap.find((k) => k.key === 'Mod-b')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    bold.run!(view as any, {} as any);
    expect(view.dispatched).toHaveLength(1);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('**bold text**');
  });

  it('Italic inserts *italic text* at cursor', () => {
    const view = createMockView();
    const keymap = getToolbarKeymap();
    const italic = keymap.find((k) => k.key === 'Mod-i')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    italic.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('*italic text*');
  });

  it('Strikethrough inserts ~~strikethrough~~ at cursor', () => {
    const view = createMockView();
    const keymap = getToolbarKeymap();
    const strike = keymap.find((k) => k.key === 'Mod-Shift-x')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    strike.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('~~strikethrough~~');
  });

  it('Inline Code inserts `code` at cursor', () => {
    const view = createMockView();
    const keymap = getToolbarKeymap();
    const code = keymap.find((k) => k.key === 'Mod-e')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    code.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('`code`');
  });

  it('Link inserts [link text](url) at cursor', () => {
    const view = createMockView();
    const keymap = getToolbarKeymap();
    const link = keymap.find((k) => k.key === 'Mod-k')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    link.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('[link text](url)');
  });

  it('Bold wraps selected text', () => {
    const view = createMockView('hello', 0, 5);
    const keymap = getToolbarKeymap();
    const bold = keymap.find((k) => k.key === 'Mod-b')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    bold.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('**hello**');
  });

  it('Italic wraps selected text', () => {
    const view = createMockView('world', 0, 5);
    const keymap = getToolbarKeymap();
    const italic = keymap.find((k) => k.key === 'Mod-i')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    italic.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('*world*');
  });

  it('Strikethrough wraps selected text', () => {
    const view = createMockView('deleted', 0, 7);
    const keymap = getToolbarKeymap();
    const strike = keymap.find((k) => k.key === 'Mod-Shift-x')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    strike.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { changes: { insert: string } };
    expect(tr.changes.insert).toBe('~~deleted~~');
  });

  it('dispatches correct selection range for Bold placeholder', () => {
    const view = createMockView();
    const keymap = getToolbarKeymap();
    const bold = keymap.find((k) => k.key === 'Mod-b')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    bold.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { selection: { anchor: number; head: number } };
    // "**bold text**" -> cursor selects "bold text" (from 2 to 11)
    expect(tr.selection.anchor).toBe(2);
    expect(tr.selection.head).toBe(11);
  });

  it('dispatches correct selection range for Link placeholder', () => {
    const view = createMockView();
    const keymap = getToolbarKeymap();
    const link = keymap.find((k) => k.key === 'Mod-k')!;
    // biome-ignore lint/suspicious/noExplicitAny: mock EditorView for testing
    link.run!(view as any, {} as any);
    const tr = view.dispatched[0] as { selection: { anchor: number; head: number } };
    // "[link text](url)" -> cursor selects "link text" (from 1 to 10)
    expect(tr.selection.anchor).toBe(1);
    expect(tr.selection.head).toBe(10);
  });
});
