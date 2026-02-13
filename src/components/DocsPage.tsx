import DOMPurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { processMarkdown } from '../lib/markdownPipeline';
import MermaidBlock from './preview/MermaidBlock';
import { LogoIcon } from './shared/Icons';

const PURIFY_CONFIG = {
  ADD_TAGS: [
    'math',
    'mi',
    'mo',
    'mn',
    'ms',
    'mtext',
    'mrow',
    'mfrac',
    'msup',
    'msub',
    'mover',
    'munder',
    'msqrt',
    'mroot',
    'mtable',
    'mtr',
    'mtd',
    'semantics',
    'annotation',
  ],
  ADD_ATTR: ['class', 'style', 'id', 'data-mermaid', 'aria-hidden', 'xmlns', 'encoding'],
};

const sections = [
  { id: 'overview', label: 'Overview', tooltip: 'Features, capabilities, and quick stats' },
  { id: 'markdown', label: 'Markdown', tooltip: 'GFM tables, task lists, autolinks, and footnotes' },
  { id: 'math', label: 'Math', tooltip: 'LaTeX math rendering with KaTeX' },
  { id: 'mermaid', label: 'Mermaid', tooltip: 'Flowcharts, sequence diagrams, and more' },
  { id: 'code', label: 'Code', tooltip: 'Syntax highlighting for 100+ languages' },
  { id: 'editor', label: 'Editor', tooltip: 'CodeMirror 6 with toolbar and markdown shortcuts' },
  { id: 'split-view', label: 'Split View', tooltip: 'Side-by-side editing with live preview' },
  { id: 'frontmatter', label: 'Frontmatter', tooltip: 'YAML frontmatter parsing and display' },
  { id: 'toc', label: 'TOC', tooltip: 'Auto-generated table of contents from headings' },
  { id: 'themes', label: 'Themes', tooltip: 'Multiple themes with dark mode support' },
  { id: 'export', label: 'Export', tooltip: 'Export as standalone HTML or PDF' },
  { id: 'shortcuts', label: 'Shortcuts', tooltip: 'Keyboard shortcuts and editor commands' },
  { id: 'extension', label: 'Extension', tooltip: 'Chrome extension for viewing .md files' },
  { id: 'accessibility', label: 'Accessibility', tooltip: 'Keyboard navigation and screen reader support' },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-indigo-600 text-sm dark:bg-slate-800 dark:text-indigo-400">
      {children}
    </code>
  );
}

function ExampleCard({ title, input, output }: { title: string; input: string; output: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="border-slate-200 border-b bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
        <span className="font-medium text-slate-500 text-xs dark:text-slate-400">{title}</span>
      </div>
      <div className="flex flex-col gap-1 px-4 py-3">
        <div className="flex items-start gap-2">
          <span className="font-mono text-slate-400 text-xs">Input:</span>
          <span className="font-mono text-slate-800 text-sm dark:text-slate-200">{input}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-mono text-slate-400 text-xs">Output:</span>
          <span className="font-mono font-semibold text-indigo-600 text-sm dark:text-indigo-400">{output}</span>
        </div>
      </div>
    </div>
  );
}

interface MermaidInfo {
  code: string;
  id: string;
}

function extractMermaidBlocks(html: string): MermaidInfo[] {
  const blocks: MermaidInfo[] = [];
  if (typeof DOMParser === 'undefined') return blocks;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('.mermaid-block').forEach((block, i) => {
    const code = block.querySelector('code')?.textContent ?? '';
    if (code) blocks.push({ code, id: `doc-${i}-${code.slice(0, 20).replace(/\W/g, '')}` });
  });
  return blocks;
}

function LiveExample({ title, source }: { title: string; source: string }) {
  const [html, setHtml] = useState('');
  const [mermaidBlocks, setMermaidBlocks] = useState<MermaidInfo[]>([]);

  useEffect(() => {
    let cancelled = false;
    processMarkdown(source).then((result) => {
      if (!cancelled) {
        // Content is sanitized by both rehype-sanitize in the pipeline and DOMPurify here
        const sanitized = DOMPurify.sanitize(result.html, PURIFY_CONFIG);
        setHtml(sanitized);
        setMermaidBlocks(extractMermaidBlocks(sanitized));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="border-slate-200 border-b bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
        <span className="font-medium text-slate-500 text-xs dark:text-slate-400">{title}</span>
      </div>
      <div className="flex flex-col divide-y divide-slate-200 sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-slate-700">
        <div className="flex-1 bg-slate-50/50 px-4 py-3 dark:bg-slate-900/50">
          <div className="mb-1 font-mono text-[10px] text-slate-400 uppercase tracking-wider">Markdown</div>
          <pre className="whitespace-pre-wrap font-mono text-slate-700 text-xs leading-relaxed dark:text-slate-300">
            {source}
          </pre>
        </div>
        <div className="flex-1 px-4 py-3">
          <div className="mb-1 font-mono text-[10px] text-slate-400 uppercase tracking-wider">Preview</div>
          <div
            className="markdown-preview text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by rehype-sanitize + DOMPurify
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {mermaidBlocks.map((block) => (
            <MermaidBlock key={block.id} code={block.code} id={block.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-300 dark:border-slate-700 dark:hover:border-indigo-700">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 text-sm dark:text-slate-200">{title}</h4>
        <p className="mt-0.5 text-slate-500 text-sm dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function MarkdownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M7 15V9l3 3 3-3v6" />
      <path d="M19 13l-2 2-2-2" />
      <line x1="17" y1="9" x2="17" y2="15" />
    </svg>
  );
}

function MathIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M4 20h4l4-16h4" />
      <line x1="16" y1="8" x2="22" y2="8" />
      <line x1="19" y1="5" x2="19" y2="11" />
    </svg>
  );
}

function DiagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="3" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="8" y="16" width="8" height="5" rx="1" />
      <line x1="6.5" y1="8" x2="12" y2="16" />
      <line x1="17.5" y1="8" x2="12" y2="16" />
    </svg>
  );
}

function CodeHighlightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function EditorFeatureIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ThemeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx={12} cy={12} r={5} />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export default function DocsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const segment = location.pathname.replace(/^\/docs\/?/, '');
  const [activeSection, setActiveSection] = useState(segment || 'overview');
  const suppressSpy = useRef(false);
  const isUserNav = useRef(false);

  useEffect(() => {
    if (!segment) return;
    if (isUserNav.current) {
      isUserNav.current = false;
      return;
    }
    suppressSpy.current = true;
    requestAnimationFrame(() => {
      const el = document.getElementById(segment);
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        setActiveSection(segment);
      }
      setTimeout(() => {
        suppressSpy.current = false;
      }, 500);
    });
  }, [segment]);

  useEffect(() => {
    const navigateRef = navigate;
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressSpy.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            isUserNav.current = true;
            navigateRef(`/docs/${entry.target.id}`, { replace: true });
          }
        }
      },
      { rootMargin: '-20% 0px -75% 0px' },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [navigate]);

  const scrollTo = (id: string) => {
    suppressSpy.current = true;
    setActiveSection(id);
    isUserNav.current = true;
    navigate(`/docs/${id}`, { replace: true });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      suppressSpy.current = false;
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-slate-200 border-b bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 rounded" />
            <h1 className="font-bold text-slate-800 text-xl dark:text-white">Markdown Lab</h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-medium text-indigo-700 text-xs dark:bg-indigo-900 dark:text-indigo-300">
              Docs
            </span>
          </div>
          <Link
            to="/split"
            className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-indigo-600"
          >
            Open App
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        {/* Side nav */}
        <nav aria-label="Documentation sections" className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-24 flex flex-col gap-1">
            {sections.map((s) => (
              <div key={s.id} className="group relative">
                <button
                  type="button"
                  aria-current={activeSection === s.id ? 'true' : undefined}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    activeSection === s.id
                      ? 'bg-indigo-50 font-medium text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-white text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:bg-slate-700">
                  {s.tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Overview */}
          <section id="overview" className="mb-16">
            <div className="mb-8">
              <h2 className="mb-3 font-bold text-3xl text-slate-800 dark:text-white">
                A powerful markdown viewer and editor in your browser
              </h2>
              <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400">
                Markdown Lab is a feature-rich markdown toolkit built with React. Write and preview markdown with GFM
                support, render LaTeX math, visualize Mermaid diagrams, and export to HTML or PDF — all client-side with
                zero backend.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2">
              <FeatureCard
                icon={<MarkdownIcon />}
                title="GitHub Flavored Markdown"
                description="Full GFM support: tables, task lists, strikethrough, autolinks, and footnotes."
              />
              <FeatureCard
                icon={<MathIcon />}
                title="LaTeX Math (KaTeX)"
                description="Inline and block math rendering with KaTeX — fast, accurate typesetting."
              />
              <FeatureCard
                icon={<DiagramIcon />}
                title="Mermaid Diagrams"
                description="Flowcharts, sequence diagrams, Gantt charts, and more rendered from code blocks."
              />
              <FeatureCard
                icon={<CodeHighlightIcon />}
                title="Syntax Highlighting"
                description="Code blocks with language-aware highlighting for 100+ programming languages."
              />
              <FeatureCard
                icon={<EditorFeatureIcon />}
                title="CodeMirror 6 Editor"
                description="Rich text editing with markdown syntax support, toolbar, and keyboard shortcuts."
              />
              <FeatureCard
                icon={<ThemeIcon />}
                title="Themes & Dark Mode"
                description="Multiple color themes with automatic dark mode. Preference persists across sessions."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-3 dark:bg-slate-900">
              <div className="text-center">
                <div className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">3</div>
                <div className="mt-1 text-slate-500 text-xs dark:text-slate-400">View Modes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">100+</div>
                <div className="mt-1 text-slate-500 text-xs dark:text-slate-400">Languages Highlighted</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">0</div>
                <div className="mt-1 text-slate-500 text-xs dark:text-slate-400">Backend Required</div>
              </div>
            </div>
          </section>

          {/* Markdown */}
          <section id="markdown" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Markdown Pipeline</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Markdown Lab uses a unified/remark/rehype pipeline to transform your content into beautifully rendered
              HTML. Full GitHub Flavored Markdown (GFM) support is included out of the box.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Headings</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample title="H1" source="# Heading 1" />
                  <LiveExample title="H2" source="## Heading 2" />
                  <LiveExample title="H3" source="### Heading 3" />
                  <LiveExample title="H4" source="#### Heading 4" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Inline Formatting</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample title="Bold" source="**bold text**" />
                  <LiveExample title="Italic" source="*italic text*" />
                  <LiveExample title="Strikethrough" source="~~deleted text~~" />
                  <LiveExample title="Inline code" source="`console.log('hello')`" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Links & Images</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample title="Link" source="[Visit Example](https://example.com)" />
                  <LiveExample title="Autolink" source="https://example.com" />
                  <LiveExample
                    title="Footnote"
                    source={'Text with a footnote[^1]\n\n[^1]: This is the footnote content.'}
                  />
                  <LiveExample
                    title="Image"
                    source="![Alt text](https://via.placeholder.com/120x40/6366f1/fff?text=Image)"
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">GFM Tables</h3>
                <p className="mb-3 text-slate-500 dark:text-slate-400">
                  Create tables using pipes <CodeBlock>|</CodeBlock> and hyphens <CodeBlock>-</CodeBlock>. Alignment is
                  controlled with colons in the separator row.
                </p>
                <LiveExample
                  title="Table with alignment"
                  source={
                    '| Feature | Status | Notes |\n|:--------|:------:|------:|\n| GFM | Done | Full support |\n| Math | Done | KaTeX |\n| Mermaid | Done | Client-side |'
                  }
                />
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Lists</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample
                    title="Unordered list"
                    source={'- Item 1\n- Item 2\n  - Nested item\n  - Another nested'}
                  />
                  <LiveExample title="Ordered list" source={'1. First\n2. Second\n3. Third'} />
                  <LiveExample title="Task list" source={'- [x] Done task\n- [ ] Pending task\n- [x] Another done'} />
                  <LiveExample title="Blockquote" source={'> This is a blockquote\n>\n> It can span multiple lines'} />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Horizontal Rule & Emoji</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample title="Horizontal rule" source={'Above the line\n\n---\n\nBelow the line'} />
                  <LiveExample title="Emoji" source=":rocket: :heart: :star: :fire:" />
                </div>
              </div>
            </div>
          </section>

          {/* Math */}
          <section id="math" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Math (KaTeX)</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Write LaTeX math expressions that are rendered with KaTeX for fast, high-quality typesetting. Supports
              both inline math with <CodeBlock>$...$</CodeBlock> and display math with <CodeBlock>$$...$$</CodeBlock>.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Inline Math</h3>
                <p className="mb-3 text-slate-500 dark:text-slate-400">
                  Wrap expressions in single dollar signs for inline rendering within text.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample title="Simple equation" source="Einstein's equation: $E = mc^2$" />
                  <LiveExample title="Greek letters" source="$\\alpha + \\beta = \\gamma$" />
                  <LiveExample title="Fractions" source="The result is $\\frac{a}{b}$" />
                  <LiveExample title="Subscripts" source="Variables: $x_1, x_2, \\ldots, x_n$" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Display Math</h3>
                <p className="mb-3 text-slate-500 dark:text-slate-400">
                  Wrap expressions in double dollar signs for centered, block-level rendering.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample title="Integral" source="$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$" />
                  <LiveExample title="Summation" source="$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$" />
                  <LiveExample title="Matrix" source="$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$" />
                  <LiveExample title="Limit" source="$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$" />
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50 p-4 text-indigo-700 text-sm dark:bg-indigo-950 dark:text-indigo-300">
                <strong>Tip:</strong> KaTeX renders math much faster than MathJax. All standard LaTeX math commands are
                supported including <CodeBlock>{'\\sqrt{}'}</CodeBlock>, <CodeBlock>{'\\frac{}{}'}</CodeBlock>,{' '}
                <CodeBlock>{'\\sum'}</CodeBlock>, <CodeBlock>{'\\int'}</CodeBlock>, Greek letters, and more.
              </div>
            </div>
          </section>

          {/* Mermaid */}
          <section id="mermaid" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Mermaid Diagrams</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Create diagrams and visualizations using Mermaid syntax inside fenced code blocks with the{' '}
              <CodeBlock>mermaid</CodeBlock> language tag. Diagrams are rendered client-side after the preview DOM is
              inserted.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Flowchart</h3>
                <LiveExample
                  title="Flowchart diagram"
                  source={
                    '```mermaid\ngraph TD\n    A[Start] --> B{Is it markdown?}\n    B -->|Yes| C[Parse with remark]\n    B -->|No| D[Show error]\n    C --> E[Render HTML]\n    E --> F[Display preview]\n```'
                  }
                />
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Sequence Diagram</h3>
                <LiveExample
                  title="Sequence diagram"
                  source={
                    '```mermaid\nsequenceDiagram\n    User->>Editor: Type markdown\n    Editor->>Pipeline: Process content\n    Pipeline->>Preview: Render HTML\n    Preview-->>User: Display result\n```'
                  }
                />
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Pie Chart</h3>
                <LiveExample
                  title="Pie chart"
                  source={
                    '```mermaid\npie title Markdown Lab Features\n    "GFM" : 30\n    "Math" : 25\n    "Mermaid" : 20\n    "Code" : 25\n```'
                  }
                />
              </div>

              <div className="rounded-xl bg-indigo-50 p-4 text-indigo-700 text-sm dark:bg-indigo-950 dark:text-indigo-300">
                <strong>Note:</strong> Mermaid blocks are detected during the remark/rehype pipeline and rendered
                asynchronously after the preview DOM updates. Complex diagrams may take a moment to appear.
              </div>
            </div>
          </section>

          {/* Code */}
          <section id="code" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Syntax Highlighting</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Fenced code blocks are automatically highlighted based on the language tag. The pipeline uses
              rehype-highlight powered by highlight.js to support 100+ programming languages.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Language Examples</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <LiveExample
                    title="JavaScript"
                    source={'```js\nconst greeting = "Hello, world!";\nconsole.log(greeting);\n```'}
                  />
                  <LiveExample
                    title="Python"
                    source={
                      '```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n```'
                    }
                  />
                  <LiveExample
                    title="TypeScript"
                    source={
                      '```ts\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = { name: "Alice", age: 30 };\n```'
                    }
                  />
                  <LiveExample
                    title="Rust"
                    source={'```rust\nfn main() {\n    let x: i32 = 42;\n    println!("Value: {x}");\n}\n```'}
                  />
                  <LiveExample
                    title="HTML"
                    source={'```html\n<div class="container">\n  <h1>Hello</h1>\n  <p>World</p>\n</div>\n```'}
                  />
                  <LiveExample
                    title="CSS"
                    source={'```css\n.container {\n  display: flex;\n  gap: 1rem;\n  color: #6366f1;\n}\n```'}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Inline Code</h3>
                <LiveExample
                  title="Inline code in text"
                  source="Use `console.log()` for debugging and `typeof` to check types."
                />
              </div>
            </div>
          </section>

          {/* Editor */}
          <section id="editor" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Editor</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              The built-in editor is powered by CodeMirror 6, providing a modern editing experience with markdown syntax
              support. The editor toolbar provides quick access to common formatting operations.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-lg text-slate-800 dark:text-white">Toolbar Groups</h3>
                <p className="mb-3 text-slate-500 text-sm dark:text-slate-400">
                  The toolbar is organized into five groups separated by dividers. Buttons with keyboard shortcuts show
                  them in their tooltips.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      group: 'Text Formatting',
                      items: [
                        ['Bold', '**text**', 'Ctrl/Cmd+B'],
                        ['Italic', '*text*', 'Ctrl/Cmd+I'],
                        ['Strikethrough', '~~text~~', 'Ctrl/Cmd+Shift+X'],
                        ['Inline Code', '`code`', 'Ctrl/Cmd+E'],
                      ],
                    },
                    {
                      group: 'Structure',
                      items: [
                        ['Heading', '## prefix', ''],
                        ['Ordered List', '1. prefix', ''],
                        ['Unordered List', '- prefix', ''],
                        ['Task List', '- [ ] prefix', ''],
                        ['Blockquote', '> prefix', ''],
                        ['Horizontal Rule', '\\n---\\n', ''],
                      ],
                    },
                    {
                      group: 'Insert',
                      items: [
                        ['Link', '[text](url)', 'Ctrl/Cmd+K'],
                        ['Image', '![alt](url)', ''],
                        ['Code Block', '``` fenced block', ''],
                        ['Table', '3x3 table template', ''],
                      ],
                    },
                    {
                      group: 'Edit',
                      items: [
                        ['Undo', 'Undo last change', 'Ctrl/Cmd+Z'],
                        ['Redo', 'Redo last change', 'Ctrl/Cmd+Shift+Z'],
                      ],
                    },
                    {
                      group: 'Advanced',
                      items: [['Find & Replace', 'Search panel', 'Ctrl/Cmd+F']],
                    },
                  ].map(({ group, items }) => (
                    <div key={group}>
                      <h4 className="mb-2 font-medium text-slate-700 text-sm dark:text-slate-300">{group}</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-slate-200 border-b dark:border-slate-700">
                              <th className="py-1.5 pr-4 font-medium text-slate-600 text-xs dark:text-slate-400">
                                Action
                              </th>
                              <th className="py-1.5 pr-4 font-medium text-slate-600 text-xs dark:text-slate-400">
                                Inserts
                              </th>
                              <th className="py-1.5 font-medium text-slate-600 text-xs dark:text-slate-400">
                                Shortcut
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-500 dark:text-slate-400">
                            {items.map(([action, inserts, shortcut]) => (
                              <tr key={action} className="border-slate-100 border-b dark:border-slate-800">
                                <td className="py-1.5 pr-4">{action}</td>
                                <td className="py-1.5 pr-4">
                                  <CodeBlock>{inserts}</CodeBlock>
                                </td>
                                <td className="py-1.5">
                                  {shortcut ? (
                                    <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-slate-600 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                      {shortcut}
                                    </kbd>
                                  ) : (
                                    <span className="text-slate-300 dark:text-slate-600">&mdash;</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50 p-4 text-indigo-700 text-sm dark:bg-indigo-950 dark:text-indigo-300">
                <strong>Tip:</strong> Select text first, then click a toolbar button to wrap the selection. If nothing
                is selected, placeholder text is inserted at the cursor position.
              </div>
            </div>
          </section>

          {/* Split View */}
          <section id="split-view" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Split View</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Work in three view modes, accessible from the header toggle. The split view shows the editor and preview
              side by side with a draggable resize divider and synchronized scrolling.
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                <h3 className="mb-2 font-semibold text-base text-slate-800 dark:text-white">View Mode</h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                  Full-width rendered preview of your markdown. Ideal for reading documents, reviewing exported content,
                  or presenting. The sidebar table of contents is available for quick navigation.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                <h3 className="mb-2 font-semibold text-base text-slate-800 dark:text-white">Edit Mode</h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                  Full-width CodeMirror editor with toolbar. Best for focused writing without distraction from the
                  preview. All toolbar actions and keyboard shortcuts are available.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                <h3 className="mb-2 font-semibold text-base text-slate-800 dark:text-white">Split Mode</h3>
                <p className="mb-3 text-slate-500 text-sm dark:text-slate-400">
                  Editor on the left, live preview on the right. Changes appear in real-time as you type. The divider
                  can be dragged to resize the panels. Scroll position is synchronized proportionally between the editor
                  and preview.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <ExampleCard title="Resize" input="Drag divider" output="Custom panel width ratio" />
                  <ExampleCard
                    title="Scroll sync"
                    input="Scroll either panel"
                    output="Other panel follows proportionally"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Frontmatter */}
          <section id="frontmatter" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Frontmatter</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              YAML frontmatter at the top of your document is automatically parsed and displayed. Frontmatter is wrapped
              in triple dashes <CodeBlock>---</CodeBlock> and can contain metadata like title, author, date, and tags.
            </p>

            <div className="space-y-4">
              <LiveExample
                title="Frontmatter with content"
                source={
                  '---\ntitle: My Document\nauthor: Jane Doe\ndate: 2024-01-15\ntags: [markdown, docs, tutorial]\n---\n\n# Content starts here\n\nThe frontmatter above is parsed as YAML metadata.'
                }
              />

              <div className="rounded-xl bg-indigo-50 p-4 text-indigo-700 text-sm dark:bg-indigo-950 dark:text-indigo-300">
                <strong>Note:</strong> Frontmatter is stripped from the rendered preview. It appears in a separate
                metadata display above the content. The title field is also used as the filename when exporting. Any
                valid YAML key/value pairs work — <CodeBlock>title</CodeBlock>, <CodeBlock>author</CodeBlock>,{' '}
                <CodeBlock>tags</CodeBlock>, <CodeBlock>date</CodeBlock>, or custom fields like{' '}
                <CodeBlock>status: draft</CodeBlock>.
              </div>
            </div>
          </section>

          {/* TOC */}
          <section id="toc" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Table of Contents</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              A table of contents is automatically generated from your document's headings. It appears in the
              collapsible sidebar and updates in real-time as you edit. Click any heading to scroll to that section.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <ExampleCard title="Extraction" input="# H1, ## H2, ### H3" output="Nested TOC hierarchy" />
                <ExampleCard title="Navigation" input="Click TOC entry" output="Smooth scroll to heading" />
                <ExampleCard title="Nesting" input="H2 under H1, H3 under H2" output="Indented tree structure" />
                <ExampleCard title="Real-time" input="Add/remove headings" output="TOC updates instantly" />
              </div>

              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
                <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">Sidebar Toggle</h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                  The sidebar can be toggled with the sidebar icon in the header. On smaller screens, it collapses
                  automatically. The TOC supports headings from H1 through H6 with proper nesting and indentation.
                </p>
              </div>
            </div>
          </section>

          {/* Themes */}
          <section id="themes" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Themes & Dark Mode</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Choose from multiple color themes via the dropdown in the header. Toggle dark mode with the sun/moon icon.
              Preferences are saved to localStorage and persist across sessions.
            </p>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
                <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">Theme System</h3>
                <p className="mb-3 text-slate-500 text-sm dark:text-slate-400">
                  Themes are applied via CSS custom properties on the <CodeBlock>{':root'}</CodeBlock> element. Each
                  theme defines colors for background, text, primary accent, surfaces, and borders. The{' '}
                  <CodeBlock>applyTheme()</CodeBlock> function swaps these variables at runtime.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Default', 'Ocean', 'Forest', 'Sunset', 'Minimal'].map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                <h3 className="mb-2 font-semibold text-base text-slate-800 dark:text-white">Dark Mode</h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                  Click the moon/sun icon in the header to toggle dark mode. The <CodeBlock>.dark</CodeBlock> class is
                  toggled on the root element, and all theme variables adapt accordingly. Your preference is saved
                  automatically.
                </p>
              </div>
            </div>
          </section>

          {/* Export */}
          <section id="export" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Export</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Export your rendered markdown as a standalone HTML file or print to PDF. Both options are available from
              the header toolbar.
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                <h3 className="mb-2 font-semibold text-base text-slate-800 dark:text-white">HTML Export</h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                  Generates a self-contained HTML file with all styles inlined. The exported file includes the rendered
                  markdown, syntax highlighting styles, and KaTeX CSS. The frontmatter <CodeBlock>title</CodeBlock>{' '}
                  field is used as the filename. Open the file in any browser — no server needed.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                <h3 className="mb-2 font-semibold text-base text-slate-800 dark:text-white">PDF Export</h3>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                  Uses the browser's built-in print dialog (<CodeBlock>window.print()</CodeBlock>) with optimized print
                  styles. The preview content is rendered in a print-friendly layout. Use your browser's "Save as PDF"
                  option for the best results.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <ExampleCard title="HTML" input="Click download icon" output="document-title.html" />
                <ExampleCard title="PDF" input="Click print icon" output="Browser print dialog" />
              </div>
            </div>
          </section>

          {/* Shortcuts */}
          <section id="shortcuts" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Keyboard Shortcuts</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              The editor supports standard keyboard shortcuts for common formatting operations. All shortcuts work in
              both Edit and Split view modes.
            </p>

            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
              <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">Markdown Formatting</h3>
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {[
                  ['Ctrl/Cmd+B', 'Bold'],
                  ['Ctrl/Cmd+I', 'Italic'],
                  ['Ctrl/Cmd+Shift+X', 'Strikethrough'],
                  ['Ctrl/Cmd+E', 'Inline Code'],
                  ['Ctrl/Cmd+K', 'Insert Link'],
                  ['Ctrl/Cmd+F', 'Find & Replace'],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-center gap-3">
                    <kbd className="shrink-0 rounded border border-slate-200 bg-white px-2 py-1 font-mono text-slate-600 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {key}
                    </kbd>
                    <span className="text-slate-500 dark:text-slate-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
              <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">Editor Shortcuts</h3>
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {[
                  ['Ctrl/Cmd+Z', 'Undo'],
                  ['Ctrl/Cmd+Shift+Z', 'Redo'],
                  ['Tab', 'Indent line'],
                  ['Shift+Tab', 'Outdent line'],
                  ['Ctrl/Cmd+A', 'Select all'],
                  ['Ctrl/Cmd+D', 'Select word'],
                  ['Ctrl/Cmd+/', 'Toggle comment'],
                  ['Enter', 'New line (auto-indent)'],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-center gap-3">
                    <kbd className="shrink-0 rounded border border-slate-200 bg-white px-2 py-1 font-mono text-slate-600 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {key}
                    </kbd>
                    <span className="text-slate-500 dark:text-slate-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
              <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">URL Navigation</h3>
              <p className="mb-3 text-slate-500 text-sm dark:text-slate-400">
                Each view mode has its own URL route, so you can bookmark or share a direct link to a specific mode.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                {[
                  ['/view', 'Preview only'],
                  ['/edit', 'Editor only'],
                  ['/split', 'Side by side'],
                  ['/docs', 'Documentation'],
                ].map(([path, label]) => (
                  <div key={path} className="flex items-center gap-2">
                    <CodeBlock>{path}</CodeBlock>
                    <span className="text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Extension */}
          <section id="extension" className="mb-16">
            <h2 className="mb-2 font-bold text-2xl text-slate-800 dark:text-white">Chrome Extension</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Markdown Lab ships as a Chrome Extension (Manifest V3) that lets you view <CodeBlock>.md</CodeBlock> files
              directly in the browser. It adds a side panel and context menu integration for seamless markdown viewing.
            </p>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
                <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">Extension Features</h3>
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  {[
                    ['Side Panel', "Opens Markdown Lab in Chrome's side panel for quick reference while browsing."],
                    ['Context Menu', 'Right-click any .md link to open it in Markdown Lab.'],
                    ['New Tab', 'Open a fresh Markdown Lab instance in a new tab from the extension.'],
                    ['URL Detection', 'Automatically detects .md file URLs and offers to render them.'],
                  ].map(([title, desc]) => (
                    <div key={title} className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{title}</span>
                      <span className="text-slate-500 dark:text-slate-400">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50 p-4 text-indigo-700 text-sm dark:bg-indigo-950 dark:text-indigo-300">
                <strong>Build:</strong> Run <CodeBlock>bun run build:extension</CodeBlock> to build the extension, then
                load the <CodeBlock>dist-extension/</CodeBlock> directory in Chrome via{' '}
                <CodeBlock>chrome://extensions</CodeBlock> with Developer Mode enabled.
              </div>
            </div>
          </section>

          {/* Accessibility */}
          <section id="accessibility" className="mb-16">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-bold text-2xl text-slate-800 dark:text-white">Accessibility</h2>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 font-semibold text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                WCAG 2.1
              </span>
            </div>
            <p className="mb-6 text-slate-500 dark:text-slate-400">
              Markdown Lab is designed with accessibility in mind. Every interactive element is keyboard-reachable,
              properly labeled, and announced by screen readers.
            </p>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
                <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">Features</h3>
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  {[
                    [
                      'Skip Navigation',
                      'Press Tab on page load to reveal a "Skip to content" link that bypasses the header.',
                    ],
                    [
                      'Landmark Regions',
                      'Semantic <main>, <nav>, and role attributes let screen readers jump between sections.',
                    ],
                    [
                      'Focus Management',
                      'All interactive elements have visible focus indicators for keyboard navigation.',
                    ],
                    ['Form Labels', 'Every input, select, and button has an accessible name via aria-label.'],
                    ['Color Contrast', 'Text meets WCAG contrast requirements against its background.'],
                    [
                      'Keyboard Support',
                      'Full keyboard navigation for view switching, sidebar toggle, and all controls.',
                    ],
                    ['Error Boundary', 'Graceful error handling with ErrorBoundary prevents full-page crashes.'],
                    ['Responsive', 'Layout adapts from mobile to desktop with accessible controls at all breakpoints.'],
                  ].map(([title, desc]) => (
                    <div key={title} className="flex flex-col gap-1">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{title}</span>
                      <span className="text-slate-500 dark:text-slate-400">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
                <h3 className="mb-3 font-semibold text-base text-slate-800 dark:text-white">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React 19',
                    'TypeScript 5.9',
                    'Vite 7',
                    'Tailwind CSS v4',
                    'CodeMirror 6',
                    'unified/remark/rehype',
                    'KaTeX',
                    'Mermaid',
                    'Biome',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-slate-200 border-t pt-8 pb-12 text-center text-slate-400 text-sm dark:border-slate-800">
            Built with React, TypeScript, and the unified ecosystem
          </footer>
        </main>
      </div>
    </div>
  );
}
