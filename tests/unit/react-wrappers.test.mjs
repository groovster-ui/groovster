/**
 * Render each generated React wrapper and compare to spec canonicalHtml.
 * Run: node --import tsx --test tests/unit/react-wrappers.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SPEC_DIR = path.join(REPO, 'spec/components');
const REACT_SRC = path.join(REPO, 'packages/react/src');

const SIMPLE_IDS = new Set(['button', 'link', 'ornament-divider', 'toast']);

function toPascal(id) {
  return id
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function stripComments(html) {
  return String(html || '').replace(/<!--[\s\S]*?-->/g, '');
}

function normalizeHtml(html) {
  return String(html)
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+\/>/g, '/>')
    .replace(/ = /g, '=')
    .trim();
}

/** Parse the first/root element of an HTML snippet. */
function parseRoot(html) {
  const cleaned = stripComments(html).trim();
  const open = cleaned.match(/^<([a-zA-Z][\w-]*)\b([^>]*)>/);
  if (!open) {
    throw new Error(`Could not parse root tag from: ${cleaned.slice(0, 80)}`);
  }
  const tag = open[1];
  const attrStr = open[2] || '';
  const attrs = {};
  const attrRe = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = attrRe.exec(attrStr))) {
    const name = m[1];
    if (name === '/') continue;
    attrs[name] = m[2] ?? m[3] ?? m[4] ?? true;
  }
  const selfClosing = /\/\s*>$/.test(open[0]) || cleaned.startsWith(`<${tag}`) && /\/\s*>/.test(open[0]);
  let inner = '';
  if (!selfClosing) {
    const close = cleaned.lastIndexOf(`</${tag}>`);
    if (close !== -1) {
      inner = cleaned.slice(open[0].length, close);
    }
  }
  return { tag, attrs, inner, raw: cleaned };
}

function classTokens(className) {
  return String(className || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function pickDataAttrs(attrs) {
  const out = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('data-') && typeof v === 'string') out[k] = v;
  }
  return out;
}

function propsFromCanonical(root, { simple }) {
  const props = { ...pickDataAttrs(root.attrs) };
  for (const [k, v] of Object.entries(root.attrs)) {
    if (k === 'class' || k.startsWith('data-')) continue;
    if (v === true) props[k] = true;
    else props[k] = v;
  }
  // Map data-variant / data-size on simple components via wrapper props when present
  if (root.attrs['data-variant'] != null) {
    props.variant = root.attrs['data-variant'];
    delete props['data-variant'];
  }
  if (root.attrs['data-size'] != null) {
    props.size = root.attrs['data-size'];
    delete props['data-size'];
  }

  if (simple) {
    const text = root.inner.replace(/<[^>]+>/g, '').trim();
    if (text) props.children = text;
    else if (root.inner.trim()) {
      props.dangerouslySetInnerHTML = { __html: root.inner };
    }
  } else if (root.inner.trim()) {
    props.dangerouslySetInnerHTML = { __html: root.inner };
  }
  return props;
}

function loadSpecs() {
  return fs
    .readdirSync(SPEC_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => {
      const spec = JSON.parse(fs.readFileSync(path.join(SPEC_DIR, f), 'utf8'));
      return spec;
    });
}

const wrappers = await import(pathToFileURL(path.join(REACT_SRC, 'index.ts')).href);
const { EraRoot } = wrappers;

test('EraRoot sets data-era and data-mode', () => {
  const html = renderToStaticMarkup(
    React.createElement(EraRoot, { era: 'deco', mode: 'dark' }, 'hi')
  );
  assert.match(html, /data-era="deco"/);
  assert.match(html, /data-mode="dark"/);
  assert.match(html, /class="ew-root"/);
  assert.match(html, /^<div\b/);
});

test('EraRoot defaults mode to light', () => {
  const html = renderToStaticMarkup(React.createElement(EraRoot, { era: 'neon' }, null));
  assert.match(html, /data-era="neon"/);
  assert.match(html, /data-mode="light"/);
});

const specs = loadSpecs();
assert.ok(specs.length >= 20, `expected component specs, got ${specs.length}`);

for (const spec of specs) {
  const name = toPascal(spec.id);
  const Component = wrappers[name];
  const expectedClass =
    spec.id === 'toast' ? 'ew-toast-region' : spec.className;

  test(`${name} wrapper matches canonical root shell`, () => {
    assert.equal(typeof Component, 'object', `${name} export missing`);
    const root = parseRoot(spec.canonicalHtml);
    // Prefer the element that carries the component class when root differs (e.g. radio group)
    let target = root;
    if (!classTokens(root.attrs.class).includes(expectedClass)) {
      const html = stripComments(spec.canonicalHtml);
      const tagRe = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;
      let m;
      while ((m = tagRe.exec(html))) {
        const attrs = {};
        const attrRe = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
        let a;
        while ((a = attrRe.exec(m[2] || ''))) {
          attrs[a[1]] = a[2] ?? a[3] ?? a[4] ?? true;
        }
        if (classTokens(attrs.class).includes(expectedClass)) {
          // Reconstruct a minimal root for this element (void or with empty inner for shell checks)
          const start = m.index;
          const openEnd = start + m[0].length;
          const closeTag = `</${m[1]}>`;
          const close = html.indexOf(closeTag, openEnd);
          const inner = close === -1 ? '' : html.slice(openEnd, close);
          target = { tag: m[1], attrs, inner, raw: html.slice(start, close === -1 ? openEnd : close + closeTag.length) };
          break;
        }
      }
    }

    assert.ok(
      classTokens(target.attrs.class).includes(expectedClass),
      `${name}: canonical should include class ${expectedClass}`
    );

    const simple = SIMPLE_IDS.has(spec.id);
    const props = propsFromCanonical(target, { simple });
    const rendered = renderToStaticMarkup(React.createElement(Component, props));
    const renderedRoot = parseRoot(rendered);

    assert.equal(
      renderedRoot.tag.toLowerCase(),
      target.tag.toLowerCase(),
      `${name}: root tag`
    );
    assert.ok(
      classTokens(renderedRoot.attrs.class).includes(expectedClass),
      `${name}: rendered class should include ${expectedClass}, got ${renderedRoot.attrs.class}`
    );

    for (const [k, v] of Object.entries(pickDataAttrs(target.attrs))) {
      assert.equal(
        renderedRoot.attrs[k],
        v,
        `${name}: data attr ${k}`
      );
    }

    if (simple) {
      const normRendered = normalizeHtml(rendered);
      // Attribute order may differ; compare tag, class, key attrs, and body text
      if (spec.id === 'button' || spec.id === 'link') {
        assert.equal(renderedRoot.tag, target.tag);
        assert.ok(classTokens(renderedRoot.attrs.class).includes(expectedClass));
        const renderedText = renderedRoot.inner.replace(/<[^>]+>/g, '').trim();
        const canonicalText = target.inner.replace(/<[^>]+>/g, '').trim();
        assert.equal(renderedText, canonicalText, `${name}: text content`);
        if (target.attrs.type) {
          assert.equal(renderedRoot.attrs.type, target.attrs.type);
        }
        if (target.attrs.href) {
          assert.equal(renderedRoot.attrs.href, target.attrs.href);
        }
      } else if (spec.id === 'ornament-divider') {
        assert.match(normRendered, new RegExp(`^<hr\\b[^>]*\\bclass="[^"]*${expectedClass}`));
        assert.equal(renderedRoot.attrs['data-variant'], target.attrs['data-variant']);
      } else if (spec.id === 'toast') {
        assert.equal(renderedRoot.tag, 'ew-toast-region');
        assert.ok(classTokens(renderedRoot.attrs.class).includes('ew-toast-region'));
        if (target.attrs['aria-live']) {
          assert.equal(renderedRoot.attrs['aria-live'], target.attrs['aria-live']);
        }
        // Empty region: structural match after normalize
        assert.equal(
          normalizeHtml(rendered).replace(/\s/g, ''),
          normalizeHtml(
            `<ew-toast-region class="ew-toast-region" aria-live="${target.attrs['aria-live'] || 'polite'}"></ew-toast-region>`
          ).replace(/\s/g, '')
        );
      } else {
        assert.ok(normRendered.includes(expectedClass));
      }
    }
  });
}
