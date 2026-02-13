import { useCallback, useRef } from 'react';

import { useAppContext } from '../../context/AppContext';
import { themes } from '../../lib/themes';
import type { ThemeId, ViewMode } from '../../types';
import {
  DownloadIcon,
  EditIcon,
  ExternalLinkIcon,
  EyeIcon,
  LogoIcon,
  MoonIcon,
  PrintIcon,
  SplitIcon,
  SunIcon,
} from '../shared/Icons';

function ModeButton({
  mode,
  icon,
  label,
  tooltip,
  active,
}: {
  mode: ViewMode;
  icon: React.ReactNode;
  label: string;
  tooltip: string;
  active: boolean;
}) {
  return (
    <a
      href={`#/${mode}`}
      title={tooltip}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium text-xs transition-colors ${
        active
          ? 'bg-[var(--color-primary)] text-white'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

export default function Header() {
  const { state, dispatch } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileOpen = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        dispatch({ type: 'SET_CONTENT', content: reader.result as string });
        dispatch({ type: 'SET_FILE_SOURCE', source: file.name });
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [dispatch],
  );

  const handleExportHtml = useCallback(async () => {
    const { exportAsHtml } = await import('../../lib/exportHtml');
    exportAsHtml(state.preview.html, state.preview.frontmatter?.title ?? 'markdown-export');
  }, [state.preview.html, state.preview.frontmatter?.title]);

  const handleExportPdf = useCallback(async () => {
    const { exportAsPdf } = await import('../../lib/exportPdf');
    exportAsPdf(state.preview.html, state.preview.frontmatter?.title ?? 'markdown-export');
  }, [state.preview.html, state.preview.frontmatter?.title]);

  const handleNewTab = useCallback(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'OPEN_NEW_TAB' });
    } else {
      window.open(window.location.href, '_blank');
    }
  }, []);

  return (
    <header className="flex items-center gap-2 border-[var(--color-border)] border-b bg-[var(--color-surface)] px-3 py-2">
      <LogoIcon width={22} height={22} className="shrink-0" />
      <h1 className="mr-2 font-bold text-[var(--color-text)] text-sm">Markdown Lab</h1>

      {state.fileSource && (
        <span className="hidden truncate rounded bg-[var(--color-surface-alt)] px-2 py-0.5 text-[var(--color-text-secondary)] text-xs sm:block">
          {state.fileSource}
        </span>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-1 rounded-lg bg-[var(--color-surface-alt)] p-0.5">
        <ModeButton
          mode="view"
          icon={<EyeIcon width={14} height={14} />}
          label="View"
          tooltip="Preview rendered markdown"
          active={state.mode === 'view'}
        />
        <ModeButton
          mode="edit"
          icon={<EditIcon width={14} height={14} />}
          label="Edit"
          tooltip="Edit markdown source"
          active={state.mode === 'edit'}
        />
        <ModeButton
          mode="split"
          icon={<SplitIcon width={14} height={14} />}
          label="Split"
          tooltip="Side-by-side editor and preview"
          active={state.mode === 'split'}
        />
      </div>

      <select
        aria-label="Theme"
        value={state.settings.theme}
        onChange={(e) => dispatch({ type: 'SET_THEME', theme: e.target.value as ThemeId })}
        className="hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[var(--color-text)] text-xs md:block"
      >
        {Object.entries(themes).map(([id, theme]) => (
          <option key={id} value={id}>
            {theme.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleFileOpen}
          title="Open a .md, .markdown, or .txt file"
          aria-label="Open file"
          className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          <DownloadIcon className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={handleExportHtml}
          title="Export as standalone HTML file"
          aria-label="Export HTML"
          className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          <DownloadIcon />
        </button>
        <button
          type="button"
          onClick={handleExportPdf}
          title="Print or export as PDF"
          aria-label="Print / Export PDF"
          className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          <PrintIcon />
        </button>
        <button
          type="button"
          onClick={handleNewTab}
          title="Open in a new browser tab"
          aria-label="Open in new tab"
          className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          <ExternalLinkIcon />
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          title={state.settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={state.settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          {state.settings.darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <a
          href="#/docs"
          title="Documentation and feature guide"
          className="px-3 py-1.5 text-[var(--color-text-secondary)] text-sm transition-colors hover:text-[var(--color-primary)]"
        >
          Docs
        </a>
      </div>
    </header>
  );
}
