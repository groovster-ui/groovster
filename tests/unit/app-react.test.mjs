import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const wrappers = await import(pathToFileURL(path.join(root, 'packages/react/src/index.ts')).href);

const cases = [
  ['Badge', { children: '3' }, 'span', 'status'],
  ['Chip', { children: 'Filter', 'aria-pressed': 'true' }, 'ew-chip', 'button'],
  ['Code', { children: 'print' }, 'ew-code', null],
  ['EmptyState', { children: 'None' }, 'div', null],
  ['List', { children: 'Row' }, 'ul', null],
  ['MediaCard', { children: 'Title' }, 'a', null],
  ['Meter', { children: '40' }, 'div', null],
  ['NavRail', { children: 'Inbox' }, 'nav', null],
  ['Pagination', { children: '1' }, 'ew-pagination', null],
  ['Search', { children: 'Find' }, 'ew-search', null],
  ['Segmented', { children: 'Grid' }, 'ew-segmented', null],
  ['Shelf', { children: 'Row' }, 'ew-shelf', null],
  ['Skeleton', {}, 'div', null],
  ['Stat', { children: '12' }, 'div', null],
  ['Table', { children: 'Cell' }, 'table', null],
  ['Toolbar', { role: 'toolbar', 'aria-label': 'Mailbox' }, 'div', 'toolbar'],
  ['TypingIndicator', { children: '…' }, 'span', null],
  ['Density', { children: 'Inbox' }, 'div', null],
];

for (const [name, props, tag] of cases) {
  test(`${name} renders its root`, () => {
    const html = renderToStaticMarkup(React.createElement(wrappers[name], props));
    assert.match(html, new RegExp(`^<${tag}\\b`));
    assert.match(html, new RegExp(`class="ew-${name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-/, '')}`));
  });
}

test('Avatar presence renders a shaped status dot', () => {
  const html = renderToStaticMarkup(React.createElement(wrappers.Avatar, { presence: 'busy', children: 'M' }));
  assert.match(html, /class="ew-avatar__presence"/);
  assert.match(html, /data-presence="busy"/);
});
