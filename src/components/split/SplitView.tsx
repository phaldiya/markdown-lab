import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppContext } from '../../context/AppContext';
import { syncScroll } from '../../lib/syncScroll';
import EditorPanel from '../editor/EditorPanel';
import PreviewPanel from '../preview/PreviewPanel';
import ResizeDivider from './ResizeDivider';

export default function SplitView() {
  const { state } = useAppContext();
  const [leftPercent, setLeftPercent] = useState(50);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const isSplit = state.mode === 'split';
  const isEdit = state.mode === 'edit';
  const isView = state.mode === 'view';

  const handleResize = useCallback((percent: number) => {
    setLeftPercent(percent);
  }, []);

  const handleReset = useCallback(() => {
    setLeftPercent(50);
  }, []);

  useEffect(() => {
    if (!state.settings.syncScroll || !isSplit) return;

    const editorScroller = editorContainerRef.current?.querySelector('.cm-scroller') as HTMLElement | null;
    const previewEl = previewContainerRef.current;

    if (!editorScroller || !previewEl) return;

    const handleEditorScroll = () => syncScroll(editorScroller, previewEl);
    const handlePreviewScroll = () => syncScroll(previewEl, editorScroller);

    editorScroller.addEventListener('scroll', handleEditorScroll, { passive: true });
    previewEl.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      editorScroller.removeEventListener('scroll', handleEditorScroll);
      previewEl.removeEventListener('scroll', handlePreviewScroll);
    };
  }, [state.settings.syncScroll, isSplit]);

  return (
    <div className="flex h-full overflow-hidden">
      {!isView && (
        <div
          ref={editorContainerRef}
          className="flex min-w-0 overflow-hidden"
          style={isSplit ? { width: `${leftPercent}%` } : { width: '100%' }}
        >
          <EditorPanel />
        </div>
      )}
      {isSplit && <ResizeDivider onResize={handleResize} onReset={handleReset} />}
      {!isEdit && (
        <div ref={previewContainerRef} className="min-w-0 flex-1 overflow-y-auto">
          <PreviewPanel />
        </div>
      )}
    </div>
  );
}
