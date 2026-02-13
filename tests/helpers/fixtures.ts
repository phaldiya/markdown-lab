export const BASIC_MARKDOWN = `# Hello World

This is a paragraph.

## Second Heading

- Item 1
- Item 2
`;

export const GFM_MARKDOWN = `# GFM Features

| Name | Value |
|------|-------|
| A    | 1     |
| B    | 2     |

- [x] Done
- [ ] Not done

~~strikethrough~~
`;

export const MATH_MARKDOWN = `# Math

Inline math: $E = mc^2$

Display math:

$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
`;

export const MERMAID_MARKDOWN = `# Diagrams

\`\`\`mermaid
graph TD
    A --> B
    B --> C
\`\`\`
`;

export const FRONTMATTER_MARKDOWN = `---
title: Test Document
author: Test Author
date: 2024-01-01
tags:
  - markdown
  - test
---

# Content After Frontmatter

Some text here.
`;

export const EMOJI_MARKDOWN = `# Emojis

This is :thumbsup: great! :rocket:
`;

export const COMPLEX_MARKDOWN = `---
title: Complex Document
---

# Main Title

## Introduction

This is a **bold** and *italic* text with \`inline code\`.

### Table

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

### Code Block

\`\`\`typescript
const x: number = 42;
console.log(x);
\`\`\`

### Math

Inline: $a^2 + b^2 = c^2$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

### Checklist

- [x] Task 1
- [ ] Task 2
- [x] Task 3

> A blockquote

---

[A link](https://example.com)

![An image](image.png)
`;
