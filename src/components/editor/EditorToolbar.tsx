import { redo, undo } from '@codemirror/commands';
import { openSearchPanel } from '@codemirror/search';
import type { EditorView, KeyBinding } from '@codemirror/view';

import {
  BoldIcon,
  CodeBlockIcon,
  CodeIcon,
  HeadingIcon,
  HorizontalRuleIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  OrderedListIcon,
  QuoteIcon,
  RedoIcon,
  SearchIcon,
  StrikethroughIcon,
  TableIcon,
  TaskListIcon,
  UndoIcon,
} from '../shared/Icons';

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

function formatShortcut(key: string): string {
  const parts = key.split('-');
  if (isMac) {
    return parts
      .map((p) => {
        if (p === 'Mod') return '⌘';
        if (p === 'Shift') return '⇧';
        if (p === 'Alt') return '⌥';
        return p.toUpperCase();
      })
      .join('');
  }
  return parts
    .map((p) => {
      if (p === 'Mod') return 'Ctrl';
      return p.length === 1 ? p.toUpperCase() : p;
    })
    .join('+');
}

interface MarkdownAction {
  kind: 'markdown';
  icon: React.ReactNode;
  label: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  block?: boolean;
  shortcut?: string;
  nativeShortcut?: boolean;
}

interface CommandAction {
  kind: 'command';
  icon: React.ReactNode;
  label: string;
  run: (view: EditorView) => void;
  shortcut?: string;
  nativeShortcut?: boolean;
}

type ToolbarAction = MarkdownAction | CommandAction;

type ToolbarGroup = { label: string; actions: ToolbarAction[] };

function insertCodeBlock(view: EditorView) {
  const { state } = view;
  const range = state.selection.main;
  const selected = state.sliceDoc(range.from, range.to);

  if (selected) {
    const insert = `\`\`\`\n${selected}\n\`\`\``;
    view.dispatch({
      changes: { from: range.from, to: range.to, insert },
      selection: { anchor: range.from + 4, head: range.from + 4 + selected.length },
    });
  } else {
    const insert = '```\ncode\n```';
    view.dispatch({
      changes: { from: range.from, to: range.to, insert },
      selection: { anchor: range.from + 4, head: range.from + 8 },
    });
  }
  view.focus();
}

function insertTable(view: EditorView) {
  const { state } = view;
  const range = state.selection.main;
  const table =
    '| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |';
  view.dispatch({
    changes: { from: range.from, to: range.to, insert: table },
    selection: { anchor: range.from + 2, head: range.from + 10 },
  });
  view.focus();
}

function insertHorizontalRule(view: EditorView) {
  const { state } = view;
  const range = state.selection.main;
  const insert = '\n---\n';
  view.dispatch({
    changes: { from: range.from, to: range.to, insert },
    selection: { anchor: range.from + insert.length },
  });
  view.focus();
}

function runUndo(view: EditorView) {
  undo(view);
  view.focus();
}

function runRedo(view: EditorView) {
  redo(view);
  view.focus();
}

function runSearch(view: EditorView) {
  openSearchPanel(view);
}

const groups: ToolbarGroup[] = [
  {
    label: 'Text Formatting',
    actions: [
      {
        kind: 'markdown',
        icon: <BoldIcon />,
        label: 'Bold',
        prefix: '**',
        suffix: '**',
        placeholder: 'bold text',
        shortcut: 'Mod-b',
      },
      {
        kind: 'markdown',
        icon: <ItalicIcon />,
        label: 'Italic',
        prefix: '*',
        suffix: '*',
        placeholder: 'italic text',
        shortcut: 'Mod-i',
      },
      {
        kind: 'markdown',
        icon: <StrikethroughIcon />,
        label: 'Strikethrough',
        prefix: '~~',
        suffix: '~~',
        placeholder: 'strikethrough',
        shortcut: 'Mod-Shift-x',
      },
      {
        kind: 'markdown',
        icon: <CodeIcon />,
        label: 'Inline Code',
        prefix: '`',
        suffix: '`',
        placeholder: 'code',
        shortcut: 'Mod-e',
      },
    ],
  },
  {
    label: 'Structure',
    actions: [
      {
        kind: 'markdown',
        icon: <HeadingIcon />,
        label: 'Heading',
        prefix: '## ',
        suffix: '',
        placeholder: 'Heading',
        block: true,
      },
      {
        kind: 'markdown',
        icon: <OrderedListIcon />,
        label: 'Ordered List',
        prefix: '1. ',
        suffix: '',
        placeholder: 'list item',
        block: true,
      },
      {
        kind: 'markdown',
        icon: <ListIcon />,
        label: 'Unordered List',
        prefix: '- ',
        suffix: '',
        placeholder: 'list item',
        block: true,
      },
      {
        kind: 'markdown',
        icon: <TaskListIcon />,
        label: 'Task List',
        prefix: '- [ ] ',
        suffix: '',
        placeholder: 'task',
        block: true,
      },
      {
        kind: 'markdown',
        icon: <QuoteIcon />,
        label: 'Blockquote',
        prefix: '> ',
        suffix: '',
        placeholder: 'quote',
        block: true,
      },
      { kind: 'command', icon: <HorizontalRuleIcon />, label: 'Horizontal Rule', run: insertHorizontalRule },
    ],
  },
  {
    label: 'Insert',
    actions: [
      {
        kind: 'markdown',
        icon: <LinkIcon />,
        label: 'Link',
        prefix: '[',
        suffix: '](url)',
        placeholder: 'link text',
        shortcut: 'Mod-k',
      },
      {
        kind: 'markdown',
        icon: <ImageIcon />,
        label: 'Image',
        prefix: '![',
        suffix: '](url)',
        placeholder: 'alt text',
      },
      { kind: 'command', icon: <CodeBlockIcon />, label: 'Code Block', run: insertCodeBlock },
      { kind: 'command', icon: <TableIcon />, label: 'Table', run: insertTable },
    ],
  },
  {
    label: 'Edit',
    actions: [
      { kind: 'command', icon: <UndoIcon />, label: 'Undo', run: runUndo, shortcut: 'Mod-z', nativeShortcut: true },
      {
        kind: 'command',
        icon: <RedoIcon />,
        label: 'Redo',
        run: runRedo,
        shortcut: 'Mod-Shift-z',
        nativeShortcut: true,
      },
    ],
  },
  {
    label: 'Advanced',
    actions: [
      {
        kind: 'command',
        icon: <SearchIcon />,
        label: 'Find & Replace',
        run: runSearch,
        shortcut: 'Mod-f',
        nativeShortcut: true,
      },
    ],
  },
];

function insertMarkdown(view: EditorView, action: MarkdownAction) {
  const { state } = view;
  const range = state.selection.main;
  const selected = state.sliceDoc(range.from, range.to);
  const text = selected || action.placeholder;

  if (action.block) {
    const lineStart = state.doc.lineAt(range.from).from;
    const insert = action.prefix + text + action.suffix;
    const cursorFrom = lineStart + action.prefix.length;
    view.dispatch({
      changes: { from: lineStart, to: range.to, insert },
      selection: { anchor: cursorFrom, head: cursorFrom + text.length },
    });
  } else {
    const insert = action.prefix + text + action.suffix;
    const cursorFrom = range.from + action.prefix.length;
    view.dispatch({
      changes: { from: range.from, to: range.to, insert },
      selection: { anchor: cursorFrom, head: cursorFrom + text.length },
    });
  }

  view.focus();
}

function handleAction(view: EditorView, action: ToolbarAction) {
  if (action.kind === 'markdown') {
    insertMarkdown(view, action);
  } else {
    action.run(view);
  }
}

function actionTitle(action: ToolbarAction): string {
  if (action.shortcut) {
    return `${action.label} (${formatShortcut(action.shortcut)})`;
  }
  return action.label;
}

export function getToolbarKeymap(): KeyBinding[] {
  const bindings: KeyBinding[] = [];
  for (const group of groups) {
    for (const action of group.actions) {
      if (action.shortcut && !action.nativeShortcut) {
        bindings.push({
          key: action.shortcut,
          run: (view) => {
            handleAction(view, action);
            return true;
          },
        });
      }
    }
  }
  return bindings;
}

export default function EditorToolbar({ editorView }: { editorView: EditorView | null }) {
  return (
    <div
      role="toolbar"
      aria-label="Markdown formatting"
      className="flex flex-wrap items-center gap-0.5 overflow-x-auto border-[var(--color-border)] border-b bg-[var(--color-surface)] px-2 py-1"
    >
      {groups.map((group, gi) => (
        <div key={group.label} className="contents">
          {gi > 0 && <div className="mx-1 h-5 w-px bg-[var(--color-border)]" aria-hidden="true" />}
          {/* biome-ignore lint/a11y/useSemanticElements: role="group" inside role="toolbar" is the correct WAI-ARIA pattern */}
          <div role="group" aria-label={group.label} className="flex items-center gap-0.5">
            {group.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                aria-label={action.label}
                title={actionTitle(action)}
                disabled={!editorView}
                onClick={() => editorView && handleAction(editorView, action)}
                className="rounded p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-alt)] disabled:opacity-40"
              >
                {action.icon}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
