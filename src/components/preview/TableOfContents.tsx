import { useAppContext } from '../../context/AppContext';

export default function TableOfContents() {
  const { state } = useAppContext();
  const { toc } = state.preview;

  if (toc.length === 0) {
    return <p className="text-[var(--color-text-secondary)] text-xs italic">No headings found</p>;
  }

  return (
    <nav aria-label="Table of contents">
      {toc.map((heading) => (
        <a
          key={heading.id}
          href={`#user-content-${heading.id}`}
          className="toc-item"
          style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
