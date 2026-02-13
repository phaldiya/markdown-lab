import { useAppContext } from '../../context/AppContext';
import TableOfContents from '../preview/TableOfContents';
import { CloseIcon } from '../shared/Icons';

export default function Sidebar() {
  const { state, dispatch } = useAppContext();

  if (!state.sidebarOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close sidebar"
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        tabIndex={-1}
      />

      <aside
        aria-label="Table of Contents"
        className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-[var(--color-border)] border-r bg-[var(--color-surface)] shadow-xl md:relative md:z-0 md:shadow-none"
      >
        <div className="flex items-center justify-between border-[var(--color-border)] border-b px-3 py-2">
          <span className="font-semibold text-[var(--color-text)] text-sm">Table of Contents</span>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 transition-colors hover:bg-[var(--color-surface-alt)] md:hidden"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <TableOfContents />
        </div>
      </aside>
    </>
  );
}
