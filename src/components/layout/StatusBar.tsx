import { useAppContext } from '../../context/AppContext';

export default function StatusBar() {
  const { state } = useAppContext();
  const { stats, editor, fileSource, mode } = state;

  return (
    <footer className="flex items-center gap-4 border-[var(--color-border)] border-t bg-[var(--color-surface)] px-3 py-1 text-[var(--color-text-secondary)] text-xs">
      <span>{stats.words} words</span>
      <span>{stats.chars} chars</span>
      <span>{stats.lines} lines</span>
      <span>{stats.readTime} min read</span>
      {(mode === 'edit' || mode === 'split') && (
        <span>
          Ln {editor.cursorLine}, Col {editor.cursorCol}
        </span>
      )}
      <div className="flex-1" />
      {fileSource && <span className="truncate">{fileSource}</span>}
      <span className="capitalize">{mode}</span>
    </footer>
  );
}
