import { expect, test } from '@playwright/test';

const editorSelector = '.cm-content';
const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';

async function getEditorText(page: import('@playwright/test').Page) {
  return page.locator(editorSelector).innerText();
}

async function clearEditorAndType(page: import('@playwright/test').Page, text = '') {
  const editor = page.locator(editorSelector);
  await editor.click();
  await page.keyboard.press(`${modifier}+a`);
  await page.keyboard.press('Backspace');
  if (text) {
    await page.keyboard.type(text);
  }
}

async function selectAllEditorText(page: import('@playwright/test').Page) {
  const editor = page.locator(editorSelector);
  await editor.click();
  await page.keyboard.press(`${modifier}+a`);
}

// ─── Accessibility ──────────────────────────────────────────────────

test.describe('Toolbar accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/split');
  });

  test('toolbar has role="toolbar" with aria-label', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Markdown formatting' });
    await expect(toolbar).toBeVisible();
  });

  test('has 5 named groups', async ({ page }) => {
    const groups = ['Text Formatting', 'Structure', 'Insert', 'Edit', 'Advanced'];
    for (const name of groups) {
      const group = page.getByRole('group', { name });
      await expect(group).toBeVisible();
    }
  });

  test('group separators are aria-hidden', async ({ page }) => {
    const separators = page.locator('[aria-hidden="true"]').filter({
      has: page.locator('xpath=self::div[contains(@class, "w-px")]'),
    });
    // 5 separators: 4 between groups + 1 before Copy HTML button
    await expect(separators).toHaveCount(5);
  });

  test('all buttons have aria-label', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Markdown formatting' });
    const buttons = toolbar.getByRole('button');
    const count = await buttons.count();
    expect(count).toBe(18);
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveAttribute('aria-label');
    }
  });

  test('all buttons have title tooltip', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Markdown formatting' });
    const buttons = toolbar.getByRole('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveAttribute('title');
    }
  });

  test('shortcut buttons include shortcut in title', async ({ page }) => {
    const boldBtn = page.getByRole('button', { name: 'Bold' });
    const title = await boldBtn.getAttribute('title');
    // Should contain either ⌘B (Mac) or Ctrl+B (Linux/Windows)
    expect(title).toMatch(/Bold \((⌘B|Ctrl\+B)\)/);
  });

  test('Undo button includes shortcut in title', async ({ page }) => {
    const undoBtn = page.getByRole('button', { name: 'Undo' });
    const title = await undoBtn.getAttribute('title');
    expect(title).toMatch(/Undo \((⌘Z|Ctrl\+Z)\)/);
  });

  test('Find & Replace button includes shortcut in title', async ({ page }) => {
    const searchBtn = page.getByRole('button', { name: 'Find & Replace' });
    const title = await searchBtn.getAttribute('title');
    expect(title).toMatch(/Find & Replace \((⌘F|Ctrl\+F)\)/);
  });

  test('buttons without shortcuts have plain title', async ({ page }) => {
    const headingBtn = page.getByRole('button', { name: 'Heading' });
    const title = await headingBtn.getAttribute('title');
    expect(title).toBe('Heading');
  });

  test('toolbar is keyboard navigable', async ({ page }) => {
    const boldBtn = page.getByRole('button', { name: 'Bold' });
    await boldBtn.focus();
    await expect(boldBtn).toBeFocused();
    await page.keyboard.press('Tab');
    const italicBtn = page.getByRole('button', { name: 'Italic' });
    await expect(italicBtn).toBeFocused();
  });
});

// ─── Text Formatting Group ──────────────────────────────────────────

test.describe('Text Formatting buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/split');
    await clearEditorAndType(page);
  });

  test('Bold inserts **bold text** placeholder', async ({ page }) => {
    await page.getByRole('button', { name: 'Bold' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('**bold text**');
  });

  test('Bold wraps selected text', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.type('hello');
    await page.keyboard.press(`${modifier}+a`);
    await page.getByRole('button', { name: 'Bold' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('**hello**');
  });

  test('Italic inserts *italic text* placeholder', async ({ page }) => {
    await page.getByRole('button', { name: 'Italic' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('*italic text*');
  });

  test('Strikethrough inserts ~~strikethrough~~ placeholder', async ({ page }) => {
    await page.getByRole('button', { name: 'Strikethrough' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('~~strikethrough~~');
  });

  test('Inline Code inserts `code` placeholder', async ({ page }) => {
    await page.getByRole('button', { name: 'Inline Code' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('`code`');
  });
});

// ─── Structure Group ────────────────────────────────────────────────

test.describe('Structure buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/split');
    await clearEditorAndType(page);
  });

  test('Heading inserts ## prefix', async ({ page }) => {
    await page.getByRole('button', { name: 'Heading' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('## Heading');
  });

  test('Ordered List inserts 1. prefix', async ({ page }) => {
    await page.getByRole('button', { name: 'Ordered List', exact: true }).click();
    const text = await getEditorText(page);
    expect(text).toContain('1. list item');
  });

  test('Unordered List inserts - prefix', async ({ page }) => {
    await page.getByRole('button', { name: 'Unordered List' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('- list item');
  });

  test('Task List inserts - [ ] prefix', async ({ page }) => {
    await page.getByRole('button', { name: 'Task List' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('- [ ] task');
  });

  test('Blockquote inserts > prefix', async ({ page }) => {
    await page.getByRole('button', { name: 'Blockquote' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('> quote');
  });

  test('Horizontal Rule inserts ---', async ({ page }) => {
    await page.getByRole('button', { name: 'Horizontal Rule' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('---');
  });

  test('Heading renders as h2 in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Heading' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('h2')).toBeVisible();
  });

  test('Blockquote renders in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Blockquote' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('blockquote')).toBeVisible();
  });
});

// ─── Insert Group ───────────────────────────────────────────────────

test.describe('Insert buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/split');
    await clearEditorAndType(page);
  });

  test('Link inserts [link text](url)', async ({ page }) => {
    await page.getByRole('button', { name: 'Link' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('[link text](url)');
  });

  test('Image inserts ![alt text](url)', async ({ page }) => {
    await page.getByRole('button', { name: 'Image' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('![alt text](url)');
  });

  test('Code Block inserts fenced code block', async ({ page }) => {
    await page.getByRole('button', { name: 'Code Block' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('```');
    expect(text).toContain('code');
  });

  test('Code Block wraps selected text', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.type('const x = 1;');
    await page.keyboard.press(`${modifier}+a`);
    await page.getByRole('button', { name: 'Code Block' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('```');
    expect(text).toContain('const x = 1;');
  });

  test('Table inserts 3-column table template', async ({ page }) => {
    await page.getByRole('button', { name: 'Table' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('| Header 1 |');
    expect(text).toContain('| Header 2 |');
    expect(text).toContain('| Header 3 |');
    expect(text).toContain('| -------- |');
    expect(text).toContain('| Cell 1');
  });

  test('Table renders in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Table' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('table')).toBeVisible();
    await expect(preview.locator('th')).toHaveCount(3);
    await expect(preview.locator('td')).toHaveCount(6);
  });
});

// ─── Edit Group ─────────────────────────────────────────────────────

test.describe('Edit buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/split');
    await clearEditorAndType(page);
  });

  test('Undo reverts last change', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.type('first');
    await page.keyboard.type(' second');
    await page.getByRole('button', { name: 'Undo' }).click();
    const text = await getEditorText(page);
    expect(text).not.toContain('second');
  });

  test('Redo restores undone change', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.type('hello');
    await page.getByRole('button', { name: 'Undo' }).click();
    await page.getByRole('button', { name: 'Redo' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('hello');
  });
});

// ─── Advanced Group ─────────────────────────────────────────────────

test.describe('Advanced buttons', () => {
  test('Find & Replace opens search panel', async ({ page }) => {
    await page.goto('#/split');
    await page.getByRole('button', { name: 'Find & Replace' }).click();
    const findInput = page.locator('.cm-search input[name="search"]');
    await expect(findInput).toBeVisible();
  });

  test('Find & Replace panel has replace input', async ({ page }) => {
    await page.goto('#/split');
    await page.getByRole('button', { name: 'Find & Replace' }).click();
    const replaceInput = page.locator('.cm-search input[name="replace"]');
    await expect(replaceInput).toBeVisible();
  });

  test('Find & Replace panel can be closed', async ({ page }) => {
    await page.goto('#/split');
    await page.getByRole('button', { name: 'Find & Replace' }).click();
    const panel = page.locator('.cm-search');
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
  });
});

// ─── Keyboard Shortcuts ─────────────────────────────────────────────

test.describe('Keyboard shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/split');
    await clearEditorAndType(page);
  });

  test('Ctrl/Cmd+B inserts bold', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.press(`${modifier}+b`);
    const text = await getEditorText(page);
    expect(text).toContain('**bold text**');
  });

  test('Ctrl/Cmd+I inserts italic', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.press(`${modifier}+i`);
    const text = await getEditorText(page);
    expect(text).toContain('*italic text*');
  });

  test('Ctrl/Cmd+Shift+X inserts strikethrough', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.press(`${modifier}+Shift+x`);
    const text = await getEditorText(page);
    expect(text).toContain('~~strikethrough~~');
  });

  test('Ctrl/Cmd+E inserts inline code', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.press(`${modifier}+e`);
    const text = await getEditorText(page);
    expect(text).toContain('`code`');
  });

  test('Ctrl/Cmd+K inserts link', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.press(`${modifier}+k`);
    const text = await getEditorText(page);
    expect(text).toContain('[link text](url)');
  });

  test('Ctrl/Cmd+B wraps selected text in bold', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.type('wrap me');
    await selectAllEditorText(page);
    await page.keyboard.press(`${modifier}+b`);
    const text = await getEditorText(page);
    expect(text).toContain('**wrap me**');
  });

  test('Ctrl/Cmd+F opens Find & Replace', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.press(`${modifier}+f`);
    const panel = page.locator('.cm-search');
    await expect(panel).toBeVisible();
  });

  test('Ctrl/Cmd+Z undoes last change', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.type('typed text');
    await page.keyboard.press(`${modifier}+z`);
    const text = await getEditorText(page);
    expect(text).not.toContain('typed text');
  });

  test('Ctrl/Cmd+Shift+Z redoes', async ({ page }) => {
    await page.locator(editorSelector).click();
    await page.keyboard.type('redo me');
    await page.keyboard.press(`${modifier}+z`);
    await page.keyboard.press(`${modifier}+Shift+z`);
    const text = await getEditorText(page);
    expect(text).toContain('redo me');
  });
});

// ─── Toolbar in Edit Mode ───────────────────────────────────────────

test.describe('Toolbar in edit mode', () => {
  test('toolbar is visible in edit mode', async ({ page }) => {
    await page.goto('#/edit');
    const toolbar = page.getByRole('toolbar', { name: 'Markdown formatting' });
    await expect(toolbar).toBeVisible();
  });

  test('toolbar buttons work in edit mode', async ({ page }) => {
    await page.goto('#/edit');
    await clearEditorAndType(page);
    await page.getByRole('button', { name: 'Bold' }).click();
    const text = await getEditorText(page);
    expect(text).toContain('**bold text**');
  });

  test('keyboard shortcuts work in edit mode', async ({ page }) => {
    await page.goto('#/edit');
    await clearEditorAndType(page);
    await page.locator(editorSelector).click();
    await page.keyboard.press(`${modifier}+b`);
    const text = await getEditorText(page);
    expect(text).toContain('**bold text**');
  });
});

// ─── Toolbar NOT in View Mode ───────────────────────────────────────

test.describe('Toolbar in view mode', () => {
  test('toolbar is not visible in view mode', async ({ page }) => {
    await page.goto('#/split');
    await page.getByRole('link', { name: 'View' }).click();
    await expect(page).toHaveURL(/#\/view/);
    const toolbar = page.getByRole('toolbar', { name: 'Markdown formatting' });
    await expect(toolbar).toHaveCount(0);
  });
});

// ─── Preview Integration ────────────────────────────────────────────

test.describe('Toolbar preview integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/split');
    await clearEditorAndType(page);
  });

  test('Bold renders as <strong> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Bold' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('strong')).toBeVisible();
  });

  test('Italic renders as <em> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Italic' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('em')).toBeVisible();
  });

  test('Strikethrough renders as <del> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Strikethrough' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('del')).toBeVisible();
  });

  test('Inline Code renders as <code> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Inline Code' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('code')).toBeVisible();
  });

  test('Link renders as <a> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Link' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('a')).toBeVisible();
  });

  test('Ordered List renders as <ol> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Ordered List', exact: true }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('ol')).toBeVisible();
  });

  test('Unordered List renders as <ul> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Unordered List' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('ul')).toBeVisible();
  });

  test('Horizontal Rule renders as <hr> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Horizontal Rule' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('hr')).toBeVisible();
  });

  test('Code Block renders as <pre><code> in preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Code Block' }).click();
    await page.waitForTimeout(300);
    const preview = page.locator('.markdown-preview');
    await expect(preview.locator('pre code')).toBeVisible();
  });
});
