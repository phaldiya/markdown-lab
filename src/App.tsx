import { useCallback, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';

import DocsPage from './components/DocsPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import StatusBar from './components/layout/StatusBar';
import ErrorBoundary from './components/shared/ErrorBoundary';
import SplitView from './components/split/SplitView';
import { AppProvider, useAppContext } from './context/AppContext';
import { loadMarkdownFromUrl } from './lib/fileLoader';
import { processMarkdown } from './lib/markdownPipeline';
import { applyTheme } from './lib/themes';
import { computeWordCount } from './lib/wordCount';
import type { ViewMode } from './types';

const pathToMode: Record<string, ViewMode> = {
  '/view': 'view',
  '/edit': 'edit',
  '/split': 'split',
};

function ModeSync() {
  const location = useLocation();
  const { dispatch } = useAppContext();

  useEffect(() => {
    const mode = pathToMode[location.pathname];
    if (mode) {
      dispatch({ type: 'SET_MODE', mode });
    }
  }, [location.pathname, dispatch]);

  return null;
}

function UrlLoader() {
  const [searchParams] = useSearchParams();
  const { dispatch } = useAppContext();

  useEffect(() => {
    const url = searchParams.get('url');
    if (!url) return;

    loadMarkdownFromUrl(url)
      .then((content) => {
        dispatch({ type: 'SET_CONTENT', content });
        dispatch({ type: 'SET_FILE_SOURCE', source: url });
      })
      .catch((err) => {
        console.error('Failed to load URL:', err);
      });
  }, [searchParams, dispatch]);

  return null;
}

function PipelineRunner() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const stats = computeWordCount(state.editor.content);
    dispatch({ type: 'SET_STATS', stats });

    let cancelled = false;
    processMarkdown(state.editor.content).then((result) => {
      if (!cancelled) {
        dispatch({ type: 'SET_PREVIEW', html: result.html, toc: result.toc, frontmatter: result.frontmatter });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [state.editor.content, dispatch]);

  return null;
}

function ThemeApplicator() {
  const { state } = useAppContext();

  useEffect(() => {
    applyTheme(state.settings.theme);
  }, [state.settings.theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.settings.darkMode);
  }, [state.settings.darkMode]);

  return null;
}

function MarkdownLayout() {
  return (
    <div className="flex h-dvh flex-col bg-[var(--color-bg)]">
      <a href="#main-content" id="skip-nav">
        Skip to content
      </a>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main id="main-content" className="flex flex-1 flex-col overflow-hidden">
          <ErrorBoundary>
            <SplitView />
          </ErrorBoundary>
        </main>
      </div>
      <StatusBar />
      <ModeSync />
      <UrlLoader />
      <PipelineRunner />
      <ThemeApplicator />
    </div>
  );
}

function DragDropHandler({ children }: { children: React.ReactNode }) {
  const { dispatch } = useAppContext();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !file.name.match(/\.(md|markdown|txt)$/i)) return;

      const reader = new FileReader();
      reader.onload = () => {
        dispatch({ type: 'SET_CONTENT', content: reader.result as string });
        dispatch({ type: 'SET_FILE_SOURCE', source: file.name });
      };
      reader.readAsText(file);
    },
    [dispatch],
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: drag-drop zone needs these handlers
    <div onDragOver={handleDragOver} onDrop={handleDrop} className="contents">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DragDropHandler>
        <Routes>
          <Route index element={<Navigate to="/split" replace />} />
          <Route path="/view" element={<MarkdownLayout />} />
          <Route path="/edit" element={<MarkdownLayout />} />
          <Route path="/split" element={<MarkdownLayout />} />
          <Route path="/docs/*" element={<DocsPage />} />
        </Routes>
      </DragDropHandler>
    </AppProvider>
  );
}
