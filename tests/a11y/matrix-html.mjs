/**
 * Accessibility fixture for every era in spec/eras.
 * Costume and whisper × light and dark. Generated at runtime; the committed
 * HTML is a mirror (`node tests/a11y/matrix-html.mjs --write`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { listEraIds } from '../../tools/gen/src/era-catalog.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const MATRIX_PATH = '/tests/a11y/fixtures/matrix.html';
export const MODES = ['light', 'dark'];
export const FIDELITIES = ['costume', 'whisper'];

export function isMatrixUrl(url) {
  return url === '/' || url === '/matrix.html' || url === MATRIX_PATH;
}

/** Widget test ids. mcm-atomic keeps the historical `atomic-` prefix. */
export function widgetSid(era, mode, fidelity = 'costume') {
  const name = era === 'mcm-atomic' ? 'atomic' : era;
  return fidelity === 'whisper' ? `${name}-${mode}-whisper` : `${name}-${mode}`;
}

export function caseTestId(era, mode, fidelity = 'costume') {
  return fidelity === 'whisper' ? `case-${era}-${mode}-whisper` : `case-${era}-${mode}`;
}

function section(era, mode, fidelity) {
  const slug = fidelity === 'whisper' ? `${era}-${mode}-whisper` : `${era}-${mode}`;
  const sid = widgetSid(era, mode, fidelity);
  const heading = fidelity === 'whisper' ? `${era} / ${mode} / whisper` : `${era} / ${mode}`;
  return `<section class="ew-root case" data-era="${era}" data-mode="${mode}" data-fidelity-band="${fidelity}" data-testid="${caseTestId(era, mode, fidelity)}">
  <h1 style="font-family:system-ui;font-size:14px;opacity:.7">${heading}</h1>
  <article class="ew-card" data-variant="raised">
    <header class="ew-card__header"><h2>Plan</h2></header>
    <div class="ew-card__body"><p>Accessibility sample.</p></div>
    <footer class="ew-card__footer">
      <button type="button" class="ew-button">Primary</button>
      <button type="button" class="ew-button" data-variant="secondary">Secondary</button>
      <button type="button" class="ew-button" data-variant="danger">Delete</button>
    </footer>
  </article>
  <div class="ew-text-field">
    <label class="ew-text-field__label" for="email-${slug}">Email</label>
    <input id="email-${slug}" class="ew-text-field__control" type="email" autocomplete="email" />
  </div>
  <label class="ew-switch">
    <input class="ew-switch__control" type="checkbox" role="switch" aria-checked="false" />
    <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
    <span class="ew-switch__label">Notifications</span>
  </label>
  <ew-tabs class="ew-tabs">
    <div role="tablist" aria-label="Plans">
      <button type="button" role="tab" id="t1-${slug}" aria-selected="true" aria-controls="p1-${slug}">Basic</button>
      <button type="button" role="tab" id="t2-${slug}" aria-selected="false" aria-controls="p2-${slug}" tabindex="-1">Pro</button>
    </div>
    <div role="tabpanel" id="p1-${slug}" aria-labelledby="t1-${slug}">Basic panel</div>
    <div role="tabpanel" id="p2-${slug}" aria-labelledby="t2-${slug}" hidden>Pro panel</div>
  </ew-tabs>
  <dialog class="ew-dialog" open aria-labelledby="dtitle-${slug}">
    <header class="ew-dialog__header"><h2 id="dtitle-${slug}">Dialog</h2></header>
    <div class="ew-dialog__body"><p>Native dialog sample (open attribute).</p></div>
    <footer class="ew-dialog__footer">
      <form method="dialog"><button type="submit" class="ew-button" data-variant="ghost">Close</button></form>
    </footer>
  </dialog>
  <ew-select class="ew-select" data-testid="select-${sid}">
    <label class="ew-select__label" for="country-${slug}">Country</label>
    <select id="country-${slug}" class="ew-select__control">
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="mx">Mexico</option>
    </select>
  </ew-select>
  <ew-menu class="ew-menu" data-testid="menu-${sid}">
    <button type="button" class="ew-button ew-menu__trigger" aria-haspopup="menu">Actions</button>
    <div class="ew-menu__panel" role="menu" id="menu-panel-${slug}">
      <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
      <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
    </div>
  </ew-menu>
  <ew-popover class="ew-popover" data-testid="popover-${sid}">
    <button type="button" class="ew-button ew-popover__trigger" popovertarget="pop-${slug}">Details</button>
    <div id="pop-${slug}" class="ew-popover__panel" popover>
      <p>Popover content for ${slug}.</p>
    </div>
  </ew-popover>
  <ew-tooltip class="ew-tooltip" data-testid="tooltip-${sid}">
    <button type="button" class="ew-button" aria-describedby="tip-${slug}">Info</button>
    <span id="tip-${slug}" class="ew-tooltip__tip" role="tooltip">More detail</span>
  </ew-tooltip>
  <ew-slider class="ew-slider" data-testid="slider-${sid}">
    <label class="ew-slider__label" for="vol-${slug}">Volume</label>
    <input id="vol-${slug}" class="ew-slider__control" type="range" min="0" max="100" value="40" />
    <output class="ew-slider__value" for="vol-${slug}">40</output>
  </ew-slider>
  <a class="ew-link" href="#plan-${slug}">Read the note</a>
  <div class="ew-list">
    <button type="button" class="ew-list-item is-selected is-unread" aria-pressed="true">Maya Okafor</button>
  </div>
  <ew-toast-region class="ew-toast-region" data-testid="toast-${sid}" aria-live="polite"></ew-toast-region>
</section>`;
}

export function matrixDocument(repoRoot = REPO) {
  const eras = listEraIds(repoRoot);
  const sections = [];
  for (const fidelity of FIDELITIES) {
    for (const era of eras) {
      for (const mode of MODES) sections.push(section(era, mode, fidelity));
    }
  }
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Era Widgets a11y fixtures</title>
  <link rel="stylesheet" href="../../../packages/css/dist/era-widgets.css" />
  <script src="../../../packages/elements/dist/era-elements.js"></script>
  <style>
    body { margin: 0; display: grid; gap: 32px; padding: 24px; }
    .case { padding: 24px; display: grid; gap: 16px; }
  </style>
</head>
<body>
<!-- Generated from spec/eras by tests/a11y/matrix-html.mjs. Do not hand-edit. -->
${sections.join('\n')}
</body>
</html>
`;
}

export function expectedAxeCases(repoRoot = REPO) {
  return listEraIds(repoRoot).length * MODES.length * FIDELITIES.length;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain && process.argv.includes('--write')) {
  const file = path.join(REPO, 'tests/a11y/fixtures/matrix.html');
  fs.writeFileSync(file, matrixDocument(REPO));
  console.log(`Wrote ${file} (${expectedAxeCases(REPO)} cases).`);
}
