import type { Frontmatter } from '../../types';

export default function FrontmatterDisplay({ frontmatter }: { frontmatter: Frontmatter }) {
  const entries = Object.entries(frontmatter).filter(([, v]) => v != null);

  if (entries.length === 0) return null;

  return (
    <dl className="frontmatter-card">
      {entries.map(([key, value]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>{Array.isArray(value) ? value.join(', ') : String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
