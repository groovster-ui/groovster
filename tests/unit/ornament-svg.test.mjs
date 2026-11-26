import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ERAS_DIR = path.join(REPO, 'packages/css/dist/eras');

/** Match data-URI SVGs in CSS custom properties / url("…"). Quotes required — payloads may contain ')'. */
function dataUriMatches(css) {
  return [...css.matchAll(/url\(\s*"data:image\/svg\+xml,([^"]+)"\s*\)/gi)];
}

const VALID_COLOR_RE =
  /^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(?:rgba?|hsla?|oklch)\(\s*[-+\d.eE%]+(?:[\s,/]+[-+\d.eE%]+){2,3}\s*\)|currentColor|none|transparent|[a-z]+)$/i;

test('SVG color validation accepts complete functions and rejects malformed or encoded colors', () => {
  for (const color of ['oklch(58% 0.14 250)', 'oklch(0.58 0.14 250 / 0.5)', 'rgb(12, 34, 56)', 'rgba(12,34,56,0.5)', 'hsl(120 50% 25%)', '#abc', '#abcd', '#aabbcc', '#aabbccdd', 'currentColor', 'none']) {
    assert.ok(VALID_COLOR_RE.test(color), color);
  }
  for (const color of ['oklch(', 'rgb(', 'oklch()', 'oklch(58% 0.14)', 'oklch(58% invalid 250)', 'oklch(58% 0.14 250', '%23aabbcc', '#12345', '#1234567']) {
    assert.equal(VALID_COLOR_RE.test(color), false, color);
  }
});

function decodeDataUriPayload(payload) {
  let raw = payload.trim();
  // CSS may leave %XX encoding; decode fully.
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // already decoded or malformed — keep as-is for assertion below
  }
  return raw;
}

function extractColors(svg) {
  const colors = [];
  const attrRe = /\b(?:stroke|fill|stop-color|color)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(svg))) {
    colors.push(m[1]);
  }
  const styleRe = /(?:stroke|fill|stop-color)\s*:\s*([^;}"']+)/gi;
  while ((m = styleRe.exec(svg))) {
    colors.push(m[1].trim());
  }
  return colors;
}

function countDrawnPaths(svg) {
  const tags = svg.match(/<(?:path|polyline|polygon|line|circle|ellipse|rect)\b/gi);
  return tags ? tags.length : 0;
}

test('every generated era data-URI SVG has valid colors and ≥1 drawn path', () => {
  const files = fs.readdirSync(ERAS_DIR).filter((f) => f.endsWith('.css'));
  assert.ok(files.length > 0, 'expected generated era CSS files');

  let uriCount = 0;
  for (const file of files) {
    const css = fs.readFileSync(path.join(ERAS_DIR, file), 'utf8');
    const era = file.replace(/\.css$/, '');
    for (const match of dataUriMatches(css)) {
      uriCount += 1;
      const svg = decodeDataUriPayload(match[1]);
      assert.ok(
        svg.includes('<svg') || svg.includes('<SVG'),
        `${era}: data-URI did not decode to SVG (starts ${svg.slice(0, 40)})`
      );

      const paths = countDrawnPaths(svg);
      assert.ok(paths >= 1, `${era}: SVG has no drawn paths\n${svg.slice(0, 200)}`);

      for (const color of extractColors(svg)) {
        // Reject double-encoded hex like %23B08D2C or literal "%23…"
        assert.ok(
          !color.includes('%23') && !/%[0-9A-Fa-f]{2}/.test(color),
          `${era}: color still URL-encoded: ${color}`
        );
        assert.ok(
          VALID_COLOR_RE.test(color) || color.startsWith('url('),
          `${era}: invalid SVG color "${color}"`
        );
        // Hex must be real #RGB, not #23B08D2C from a leftover encoding artifact
        if (color.startsWith('#')) {
          assert.match(color, /^#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/);
        }
      }
    }
  }
  assert.ok(uriCount >= 4, `expected several data-URI SVGs, found ${uriCount}`);
});

test('deco stepped corners use real #hex strokes (not %23…)', () => {
  const css = fs.readFileSync(path.join(ERAS_DIR, 'deco.css'), 'utf8');
  const stepUris = dataUriMatches(css).filter((m) => {
    const svg = decodeDataUriPayload(m[1]);
    return /d="M2 28/.test(svg);
  });
  assert.ok(stepUris.length >= 4, `expected stepped corner SVGs, found ${stepUris.length}`);
  for (const m of stepUris) {
    const svg = decodeDataUriPayload(m[1]);
    assert.equal(svg.includes('%23'), false, 'step corner still has %23');
    assert.match(svg, /stroke="#(?:B08D2C|D4AF37)"/);
  }
});
