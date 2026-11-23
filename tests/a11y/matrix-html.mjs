import { listEraIds } from '../../tools/gen/src/era-catalog.js';

const MODES = ['light', 'dark'];
const BANDS = ['costume', 'whisper'];

function widgetKey(era) {
  return era === 'mcm-atomic' ? 'atomic' : era;
}

function caseHtml(era, mode, band) {
  const whisper = band === 'whisper';
  const suffix = whisper ? `${era}-${mode}-whisper` : `${era}-${mode}`;
  const widget = whisper ? `${widgetKey(era)}-${mode}-whisper` : `${widgetKey(era)}-${mode}`;
  const label = whisper ? `${era} / ${mode} / whisper` : `${era} / ${mode}`;
  return `<section class="ew-root case" data-era="${era}" data-mode="${mode}" data-fidelity-band="${band}" data-testid="case-${suffix}">
  <h1 style="font-family:system-ui;font-size:14px;opacity:.7">${label}</h1>
  <article class="ew-card" data-variant="raised">
    <header class="ew-card__header"><h2>Plan</h2></header>
    <div class="ew-card__body"><p>Accessibility sample.</p></div>
    <footer class="ew-card__footer">
      <button type="button" class="ew-button">Primary</button>
      <button type="button" class="ew-button" data-variant="secondary">Secondary</button>
    </footer>
  </article>
  <div class="ew-text-field">
    <label class="ew-text-field__label" for="email-${suffix}">Email</label>
    <input id="email-${suffix}" class="ew-text-field__control" type="email" autocomplete="email" />
  </div>
  <label class="ew-switch">
    <input class="ew-switch__control" type="checkbox" role="switch" aria-checked="false" />
    <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
    <span class="ew-switch__label">Notifications</span>
  </label>
  <ew-tabs class="ew-tabs">
    <div role="tablist" aria-label="Plans">
      <button type="button" role="tab" id="t1-${suffix}" aria-selected="true" aria-controls="p1-${suffix}">Basic</button>
      <button type="button" role="tab" id="t2-${suffix}" aria-selected="false" aria-controls="p2-${suffix}" tabindex="-1">Pro</button>
    </div>
    <div role="tabpanel" id="p1-${suffix}" aria-labelledby="t1-${suffix}">Basic panel</div>
    <div role="tabpanel" id="p2-${suffix}" aria-labelledby="t2-${suffix}" hidden>Pro panel</div>
  </ew-tabs>
  <dialog class="ew-dialog" open aria-labelledby="dtitle-${suffix}">
    <header class="ew-dialog__header"><h2 id="dtitle-${suffix}">Dialog</h2></header>
    <div class="ew-dialog__body"><p>Native dialog sample (open attribute).</p></div>
    <footer class="ew-dialog__footer">
      <form method="dialog"><button type="submit" class="ew-button" data-variant="ghost">Close</button></form>
    </footer>
  </dialog>
  <ew-select class="ew-select" data-testid="select-${widget}">
    <label class="ew-select__label" for="country-${suffix}">Country</label>
    <select id="country-${suffix}" class="ew-select__control">
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="mx">Mexico</option>
    </select>
  </ew-select>
  <ew-menu class="ew-menu" data-testid="menu-${widget}">
    <button type="button" class="ew-button ew-menu__trigger" aria-haspopup="menu">Actions</button>
    <div class="ew-menu__panel" role="menu" id="menu-panel-${suffix}">
      <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
      <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
    </div>
  </ew-menu>
  <ew-popover class="ew-popover" data-testid="popover-${widget}">
    <button type="button" class="ew-button ew-popover__trigger" popovertarget="pop-${suffix}">Details</button>
    <div id="pop-${suffix}" class="ew-popover__panel" popover>
      <p>Popover content for ${suffix}.</p>
    </div>
  </ew-popover>
  <ew-tooltip class="ew-tooltip" data-testid="tooltip-${widget}">
    <button type="button" class="ew-button" aria-describedby="tip-${suffix}">Info</button>
    <span id="tip-${suffix}" class="ew-tooltip__tip" role="tooltip">More detail</span>
  </ew-tooltip>
  <ew-slider class="ew-slider" data-testid="slider-${widget}">
    <label class="ew-slider__label" for="vol-${suffix}">Volume</label>
    <input id="vol-${suffix}" class="ew-slider__control" type="range" min="0" max="100" value="40" />
    <output class="ew-slider__value" for="vol-${suffix}">40</output>
  </ew-slider>
  <ew-toast-region class="ew-toast-region" data-testid="toast-${widget}" aria-live="polite"></ew-toast-region>
</section>`;
}

export function matrixDocument(repoRoot) {
  const eras = listEraIds(repoRoot);
  const cases = [];
  for (const band of BANDS) {
    for (const era of eras) {
      for (const mode of MODES) cases.push(caseHtml(era, mode, band));
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
${cases.join('\n')}
</body>
</html>
`;
}
