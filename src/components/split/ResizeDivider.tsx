import { useCallback, useEffect, useRef, useState } from 'react';

interface ResizeDividerProps {
  onResize: (leftPercent: number) => void;
  onReset: () => void;
}

export default function ResizeDivider({ onResize, onReset }: ResizeDividerProps) {
  const [dragging, setDragging] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDoubleClick = useCallback(() => {
    onReset();
  }, [onReset]);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const parent = dividerRef.current?.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(80, Math.max(20, percent));
      onResize(clamped);
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, onResize]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: div with role=separator is correct for a draggable resize handle
    <div
      ref={dividerRef}
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={50}
      aria-label="Resize panels"
      tabIndex={0}
      className={`resize-divider ${dragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onResize(-5);
        if (e.key === 'ArrowRight') onResize(5);
      }}
    />
  );
}
