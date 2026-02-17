import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { search } from '@codemirror/search';
import type { EditorView } from '@codemirror/view';
import { keymap } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useRef } from 'react';

import { useAppContext } from '../../context/AppContext';
import EditorToolbar, { getToolbarKeymap } from './EditorToolbar';

export default function EditorPanel({ className = '' }: { className?: string }) {
  const { state, dispatch } = useAppContext();
  const viewRef = useRef<EditorView | null>(null);

  const handleChange = useCallback(
    (value: string) => {
      dispatch({ type: 'SET_CONTENT', content: value });
    },
    [dispatch],
  );

  const handleCreateEditor = useCallback((view: EditorView) => {
    viewRef.current = view;
  }, []);

  const handleUpdate = useCallback(
    (update: {
      state: {
        selection: { main: { head: number } };
        doc: { lineAt: (pos: number) => { number: number; from: number } };
      };
    }) => {
      const pos = update.state.selection.main.head;
      const line = update.state.doc.lineAt(pos);
      dispatch({ type: 'SET_CURSOR', line: line.number, col: pos - line.from + 1 });
    },
    [dispatch],
  );

  const extensions = [
    keymap.of(getToolbarKeymap()),
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    search(),
  ];

  return (
    <div className={`flex flex-1 flex-col overflow-hidden ${className}`}>
      <EditorToolbar
        editorView={viewRef.current}
        previewHtml={state.preview.html}
        title={state.preview.frontmatter?.title}
      />
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={state.editor.content}
          onChange={handleChange}
          onCreateEditor={handleCreateEditor}
          onUpdate={handleUpdate}
          extensions={extensions}
          basicSetup={{
            lineNumbers: state.settings.lineNumbers,
            foldGutter: true,
            highlightActiveLine: true,
            bracketMatching: true,
            autocompletion: false,
          }}
          theme={state.settings.darkMode ? 'dark' : 'light'}
          style={{ height: '100%', fontSize: `${state.settings.fontSize}px` }}
        />
      </div>
    </div>
  );
}
