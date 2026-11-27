import fs from 'node:fs';
import { bandSel, costumeSel } from './band.js';

const print = JSON.parse(fs.readFileSync(new URL('../../../spec/eras/groovy/print.spec.json', import.meta.url), 'utf8'));
const n = v => Number(v.toFixed(1));
const url = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const svg = (body, box = '0 0 1200 400') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">${body}</svg>`;

/** Closed Catmull–Rom to cubic Bézier. Shared tangents are continuous at every join,
 * including the seam. Unequal lobes prevent compass-drawn flower halos. */
export function groovyBloomPath(radius, lobes, phase) {
  const points = Array.from({ length: lobes * 4 }, (_, i) => {
    const a = i * Math.PI * 2 / (lobes * 4);
    const r = radius * (0.78 + 0.18 * Math.cos(lobes * a + phase)) * (1 + 0.08 * Math.sin(3 * a + phase));
    return [r * Math.cos(a), r * Math.sin(a)];
  });
  const p = i => points[(i + points.length) % points.length];
  let d = `M${p(0).map(n).join(' ')}`;
  for (let i = 0; i < points.length; i++) {
    const [a, b, c, e] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    d += `C${[b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6, ...c].map(n).join(' ')}`;
  }
  return d + 'Z';
}

export function groovyPrintSvg() {
  const p = print.palette;
  const ribbons = print.ribbon.widths.map((w, i) => `<path d="${print.ribbon.path}" fill="none" stroke="${p[print.ribbon.colors[i]]}" stroke-width="${w}"/>`).join('');
  const stems = `<g fill="${p.teal}" stroke="${p.plum}" stroke-width="${print.lineWidth}" stroke-linejoin="round"><path d="M1190 410 C1020 340 1110 180 1040 95 M1100 330 C1050 280 970 330 910 295 M1110 360 C1160 330 1160 290 1130 260" fill="none"/><path d="M1100 330 C1000 325 1010 230 1040 225 C1080 240 1060 300 1100 330Z M1090 240 C1120 170 1180 180 1190 150 C1210 220 1150 250 1090 240Z M1150 345 C1170 290 1210 285 1230 280 C1230 340 1190 365 1150 345Z"/></g>`;
  const defs = `<defs>${print.flowers.map((f,i) => `<path id="b${i}" d="${groovyBloomPath(100,f.lobes,f.phase)}"/>`).join('')}<path id="heart" d="${groovyBloomPath(100,5,0.3)}"/></defs>`;
  const blooms = print.flowers.map((f,i) => `<g transform="translate(${f.x} ${f.y}) scale(${f.radius / 100})" stroke="${p.plum}" stroke-width="${print.lineWidth}"><use href="#b${i}" fill="${p[f.fill]}" vector-effect="non-scaling-stroke"/><use href="#b${i}" transform="scale(.62)" fill="${p.cream}" vector-effect="non-scaling-stroke"/><use href="#heart" transform="scale(.25)" fill="${p.marigold}" vector-effect="non-scaling-stroke"/></g>`).join('');
  return svg(defs + ribbons + stems + blooms);
}

export function groovyDecoratorCss() {
  const p = print.palette;
  const field = url(groovyPrintSvg());
  const rule = url(svg(`<path d="M-20 18 C90 -12 140 48 240 18 S390 -12 500 18 S650 48 780 18" fill="none" stroke="${p.raspberry}" stroke-width="14"/><path d="M-20 18 C90 -12 140 48 240 18 S390 -12 500 18 S650 48 780 18" fill="none" stroke="${p.marigold}" stroke-width="5"/>`, '0 0 760 38'));
  const frame = url(svg(`<path d="M30 6 C140 16 260 -4 370 6 C392 8 394 30 392 52 C386 110 402 180 391 226 C386 246 364 246 340 242 C240 230 140 256 36 242 C10 238 4 224 8 192 C16 130 -2 72 8 34 C12 14 16 8 30 6Z" fill="none" stroke="${p.raspberry}" stroke-width="4" vector-effect="non-scaling-stroke"/>`, '0 0 400 250').replace('<svg ', '<svg preserveAspectRatio="none" '));
  const bloom = url(svg(`<path d="${groovyBloomPath(24, 6, 0.18)}" transform="translate(30 30)" fill="${p.marigold}" stroke="${p.plum}" stroke-width="2.5"/>`, '0 0 60 60'));
  const band = id => {
    const b = print.bands[id];
    return `--ew-groovy-line:${b.line}; --ew-groovy-panel:${b.panelRadius}; --ew-groovy-control:${b.controlRadius}; --ew-groovy-rim:${b.rim};`;
  };
  return `
  [data-era="groovy"] {
    --ew-groovy-ink: ${p.plum}; --ew-groovy-paper: ${p.cream};
    --ew-groovy-raspberry: ${p.raspberry}; --ew-groovy-gold: ${p.marigold};
    --ew-groovy-teal: ${p.teal}; --ew-groovy-orange: ${p.orange};
    --ew-groovy-field: 12px 18px 10px 16px;
    --ew-groovy-heading-bg: transparent; --ew-groovy-heading-fg: var(--ew-color-fg-default);
    --ew-groovy-heading-pad: 0; --ew-groovy-heading-margin: 0;
    --ew-groovy-control-font: var(--ew-font-display); --ew-groovy-control-size: 1.125rem;
    --ew-groovy-control-weight: 400; --ew-groovy-ornament: none;
    --ew-groovy-header-rule: none; --ew-groovy-inset: none; --ew-groovy-frame: none; --ew-groovy-figure-rim: none;
    ${band('standard')}
  }
  ${costumeSel('groovy')} {
    ${band('costume')}
    --ew-groovy-ornament: ${field};
    --ew-groovy-inset: inset 0 0 0 3px var(--ew-color-bg-surface), inset 0 0 0 4px var(--ew-color-border-strong);
    --ew-groovy-heading-bg: var(--ew-groovy-ink); --ew-groovy-heading-fg: var(--ew-groovy-paper);
    --ew-groovy-heading-pad: 10px 16px 12px; --ew-groovy-heading-margin: -10px -10px 0;
    --ew-groovy-header-rule: ${rule}; --ew-groovy-frame: ${frame};
    --ew-groovy-figure-rim: inset 0 0 0 2px var(--ew-groovy-gold);
  }
  ${bandSel('groovy', 'whisper')} {
    ${band('whisper')}
    --ew-groovy-control-font: var(--ew-font-body); --ew-groovy-control-size: 1rem;
    --ew-groovy-control-weight: 700;
  }
  ${bandSel('groovy', ['standard','signature','default'])} {
    --ew-groovy-heading-fg: var(--ew-color-violet);
    --ew-groovy-inset: inset 0 -3px 0 var(--ew-color-tangerine);
  }
  [data-era="groovy"] :is(h1,h2,h3,.ew-hero__title) {
    font-family: var(--ew-font-display); font-weight: 400; letter-spacing: -0.025em;
    line-height: 1.12; text-wrap: balance; overflow-wrap: anywhere;
  }
  [data-era="groovy"] ::selection { background: var(--ew-groovy-gold); color: var(--ew-groovy-ink); }
  [data-era="groovy"] :is(.ew-button,.ew-icon-button) {
    min-height: 44px; border: var(--ew-groovy-line) solid var(--ew-color-border-strong);
    border-radius: var(--ew-groovy-control); background: var(--ew-groovy-raspberry); color: var(--ew-groovy-paper);
    box-shadow: inset 0 0 0 2px var(--ew-groovy-paper);
    font-family: var(--ew-groovy-control-font); font-size: var(--ew-groovy-control-size);
    font-weight: var(--ew-groovy-control-weight); line-height: 1.2; letter-spacing: 0;
    white-space: normal; overflow-wrap: anywhere;
  }
  [data-era="groovy"] .ew-icon-button { min-width: 44px; padding: 8px; font-family: var(--ew-font-body); font-size: 1.5rem; font-weight: 700; }
  [data-era="groovy"] :is(.ew-button,.ew-icon-button)[data-variant="secondary"] {
    background: var(--ew-groovy-teal); color: var(--ew-groovy-paper); border-color: var(--ew-color-border-strong);
  }
  [data-era="groovy"] :is(.ew-button,.ew-icon-button)[data-variant="ghost"],
  [data-era="groovy"] .ew-icon-button:not([data-variant]) {
    background: transparent; color: var(--ew-color-fg-default); border-color: transparent; box-shadow: none;
  }
  [data-era="groovy"] .ew-button[data-variant="danger"] {
    background: var(--ew-color-danger-bg); color: var(--ew-color-danger-fg);
  }
  [data-era="groovy"] :is(.ew-button,.ew-icon-button):not(:disabled):hover {
    text-decoration: underline; text-underline-offset: 0.2em;
    filter: brightness(1.08);
  }
  [data-era="groovy"] :is(.ew-button,.ew-icon-button):not(:disabled):active { transform: translateY(1px); }
  [data-era="groovy"] :is(.ew-button,.ew-icon-button):disabled { transform: none; }
  [data-era="groovy"] :is(.ew-text-field__control,.ew-textarea__control,.ew-select__control,.ew-select__trigger) {
    min-height: 44px; border: var(--ew-groovy-line) solid var(--ew-color-border-strong);
    border-radius: var(--ew-groovy-field); background: var(--ew-color-field-bg); color: var(--ew-color-fg-default);
    box-shadow: inset 0 -3px 0 color-mix(in srgb,var(--ew-color-tangerine) 45%,transparent);
    font-family: var(--ew-font-body); font-size: 1rem;
  }
  [data-era="groovy"] .ew-textarea__control { min-height: 96px; border-radius: var(--ew-groovy-panel); padding: 14px; }
  [data-era="groovy"] :is(.ew-text-field__control,.ew-textarea__control)::placeholder { color: var(--ew-color-fg-muted); opacity: 1; }
  [data-era="groovy"] :is(.ew-text-field,.ew-textarea)[data-invalid="true"] :is(input,textarea) {
    border-color: var(--ew-color-danger-bg); border-style: double; border-width: 3px;
  }
  [data-era="groovy"] :is(.ew-checkbox,.ew-radio,.ew-switch) { min-height: 44px; }
  [data-era="groovy"] :is(.ew-checkbox__box,.ew-radio__disc) {
    width: 24px; height: 24px; flex-shrink: 0; border: 2px solid var(--ew-color-border-strong);
    background: var(--ew-color-bg-surface); box-shadow: none;
  }
  [data-era="groovy"] .ew-checkbox__box { border-radius: 7px 10px 6px 9px; }
  [data-era="groovy"] .ew-checkbox__control:checked + .ew-checkbox__box {
    background: var(--ew-groovy-raspberry); border-color: var(--ew-color-border-strong);
  }
  [data-era="groovy"] .ew-checkbox__box::after { border-color: var(--ew-groovy-paper); }
  [data-era="groovy"] .ew-radio__disc::after { width: 12px; height: 12px; background: var(--ew-color-fg-default); border-radius: 40% 56% 44% 50%; }
  [data-era="groovy"] .ew-switch__track {
    width: 56px; height: 30px; padding: 3px; border: 2px solid var(--ew-color-border-strong);
    border-radius: 16px 20px 15px 18px; background: var(--ew-color-bg-surface); box-shadow: none;
  }
  [data-era="groovy"] .ew-switch__thumb {
    width: 20px; height: 20px; border: 2px solid var(--ew-groovy-ink);
    border-radius: 45% 55% 42% 58%; background: var(--ew-groovy-paper); box-shadow: none;
  }
  [data-era="groovy"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb { background: var(--ew-color-fg-default); border-color: var(--ew-color-bg-surface); }
  [data-era="groovy"] .ew-switch__control:checked + .ew-switch__track { background: var(--ew-groovy-teal); }
  [data-era="groovy"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb { transform: translateX(24px); background: var(--ew-groovy-gold); }
  [data-era="groovy"] .ew-slider__control {
    appearance: none; height: 12px; margin: 16px 0; border: 2px solid var(--ew-color-border-strong);
    border-radius: var(--ew-groovy-control); background: var(--ew-color-bg-surface); accent-color: var(--ew-color-action-bg);
  }
  [data-era="groovy"] .ew-slider__control::-webkit-slider-thumb {
    appearance: none; width: 28px; height: 28px; border: 2px solid var(--ew-groovy-ink);
    border-radius: 42% 58% 46% 54%; background: var(--ew-groovy-gold); box-shadow: inset 0 0 0 3px var(--ew-groovy-paper);
  }
  [data-era="groovy"] .ew-slider__control::-moz-range-thumb {
    width: 24px; height: 24px; border: 2px solid var(--ew-groovy-ink);
    border-radius: 42% 58% 46% 54%; background: var(--ew-groovy-gold); box-shadow: inset 0 0 0 3px var(--ew-groovy-paper);
  }
  [data-era="groovy"] :is(.ew-tabs,ew-tabs) [role="tablist"] { border: 0; gap: 8px; flex-wrap: wrap; }
  [data-era="groovy"] :is(.ew-tabs,ew-tabs) [role="tab"],
  [data-era="groovy"] .ew-link[data-variant="nav"] {
    display: inline-flex; align-items: center; justify-content: center; min-height: 44px;
    padding: 8px 18px; border: var(--ew-groovy-line) solid var(--ew-color-border-strong);
    border-radius: var(--ew-groovy-control); background: var(--ew-color-bg-surface); color: var(--ew-color-fg-default);
    font: var(--ew-groovy-control-weight) var(--ew-groovy-control-size)/1.2 var(--ew-groovy-control-font);
    text-decoration: none; box-shadow: none;
  }
  [data-era="groovy"] :is(.ew-tabs,ew-tabs) [role="tab"][aria-selected="true"],
  [data-era="groovy"] .ew-link[data-variant="nav"][aria-current="page"] {
    background: var(--ew-groovy-gold); color: var(--ew-groovy-ink);
    box-shadow: inset 0 0 0 2px var(--ew-groovy-paper); border-color: var(--ew-color-border-strong);
  }
  [data-era="groovy"] .ew-link:not([data-variant="nav"]) {
    color: var(--ew-color-violet); text-decoration: underline wavy; text-underline-offset: 0.22em; text-decoration-thickness: 1px;
  }
  [data-era="groovy"] :is(.ew-card,.ew-dialog,.ew-menu__panel,.ew-popover__panel,.ew-select__list) {
    border: var(--ew-groovy-line) solid var(--ew-color-border-strong);
    border-radius: var(--ew-groovy-panel); background: var(--ew-color-bg-surface);
    color: var(--ew-color-fg-default); box-shadow: var(--ew-groovy-rim);
  }
  [data-era="groovy"] .ew-card { overflow: visible; gap: 12px; min-width: 0; max-width: 100%; }
  [data-era="groovy"] .ew-card > * { min-width: 0; max-width: 100%; }
  ${costumeSel('groovy',' .ew-card:nth-child(3n+2)')} {
    --ew-groovy-heading-bg: var(--ew-groovy-raspberry);
    border-radius: 42px 28px 40px 26px / 28px 40px 26px 38px;
  }
  ${costumeSel('groovy',' .ew-card:nth-child(3n)')} {
    --ew-groovy-heading-bg: var(--ew-groovy-teal);
    border-radius: 26px 38px 30px 44px / 40px 26px 38px 28px;
  }
  [data-era="groovy"] .ew-card::after {
    content: ""; position: absolute; inset: -5px; pointer-events: none;
    background: var(--ew-groovy-frame) center / 100% 100% no-repeat; z-index: 0;
  }
  [data-era="groovy"] .ew-card::before {
    content: ""; inset: 5px; border: 1px solid var(--ew-color-border-strong); border-radius: inherit;
    opacity: var(--ew-structure-card-ornament-opacity,0); background: none;
  }
  [data-era="groovy"] .ew-card[data-variant="raised"] { box-shadow: var(--ew-groovy-rim); }
  [data-era="groovy"] .ew-card[data-variant="outline"] { box-shadow: none; }
  [data-era="groovy"] .ew-card[data-variant="flat"] { border-color: transparent; box-shadow: none; }
  [data-era="groovy"] .ew-card:is([data-variant="flat"],[data-variant="outline"])::after { content: none; }
  [data-era="groovy"] .ew-card[data-variant="inset"] { box-shadow: var(--ew-groovy-inset); }
  [data-era="groovy"] :is(.ew-card__header,.ew-dialog__header) {
    background: var(--ew-groovy-heading-bg); color: var(--ew-groovy-heading-fg);
    border-radius: var(--ew-groovy-panel); padding: var(--ew-groovy-heading-pad); margin: var(--ew-groovy-heading-margin);
  }
  [data-era="groovy"] .ew-card__header :is(h2,h3) { font-size: 1.65rem; letter-spacing: -0.025em; line-height: 1.12; }
  [data-era="groovy"] .ew-card__header::after { content: none; }
  [data-era="groovy"] .ew-dialog__header { margin-bottom: 16px; padding-inline-end: 42px; }
  [data-era="groovy"] .ew-dialog__header h2 { margin: 0; }
  [data-era="groovy"] .ew-dialog__close { color: var(--ew-groovy-heading-fg); }
  [data-era="groovy"] :is(.ew-alert,.ew-toast) {
    border: var(--ew-groovy-line) solid var(--ew-color-border-strong); border-inline-start-width: 8px;
    border-inline-start-color: var(--ew-color-violet); border-radius: var(--ew-groovy-field);
    background: var(--ew-color-bg-surface); color: var(--ew-color-fg-default); box-shadow: none;
  }
  [data-era="groovy"] :is(.ew-alert,.ew-toast)[data-variant="success"] { border-inline-start-color: var(--ew-color-aqua); }
  [data-era="groovy"] :is(.ew-alert,.ew-toast)[data-variant="danger"] { border-inline-start-color: var(--ew-color-danger-bg); }
  [data-era="groovy"] :is(.ew-alert,.ew-toast)[data-variant="warning"] { border-inline-start-color: var(--ew-color-rust); }
  [data-era="groovy"] :is(.ew-select__option,.ew-menu__item) { min-height: 44px; border-radius: var(--ew-groovy-field); }
  [data-era="groovy"] :is(.ew-select__option[aria-selected="true"],.ew-select__option:hover,.ew-menu__item:hover,.ew-menu__item:focus-visible) {
    background: var(--ew-groovy-gold); color: var(--ew-groovy-ink);
  }
  [data-era="groovy"] .ew-tooltip__tip {
    border: 1px solid var(--ew-color-border-strong); border-radius: var(--ew-groovy-field);
    background: var(--ew-groovy-ink); color: var(--ew-groovy-paper); box-shadow: none;
  }
  [data-era="groovy"] .ew-avatar { border: 2px solid var(--ew-color-border-strong); background: var(--ew-groovy-teal); color: var(--ew-groovy-paper); box-shadow: var(--ew-groovy-rim); }
  [data-era="groovy"] .ew-avatar[data-variant="square"] { border-radius: var(--ew-groovy-field); }
  [data-era="groovy"] .ew-breadcrumb__list { gap: 10px; align-items: center; }
  [data-era="groovy"] .ew-breadcrumb__separator { color: var(--ew-color-violet); }
  [data-era="groovy"] .ew-ornament-divider {
    height: 2px; border: 0; background: var(--ew-color-border-strong); overflow: visible;
  }
  [data-era="groovy"] .ew-ornament-divider::before { content: none; }
  ${costumeSel('groovy',' .ew-ornament-divider[data-variant="ornament"]')} {
    height: 32px; background: ${rule} center / 100% 32px no-repeat;
  }
  [data-era="groovy"] .ew-hero {
    position: relative; isolation: isolate; overflow: hidden; min-height: 0;
    padding: clamp(18px,2vw,28px); border: var(--ew-groovy-line) solid var(--ew-color-border-strong);
    border-radius: var(--ew-groovy-panel); background: var(--ew-color-bg-surface); box-shadow: var(--ew-groovy-rim);
  }
  [data-era="groovy"] :is(.ew-hero__backdrop,.ew-hero__stage) { position: absolute; inset: 0; pointer-events: none; z-index: -1; }
  [data-era="groovy"] .ew-hero__backdrop { background: var(--ew-groovy-ornament) right center / cover no-repeat; }
  [data-era="groovy"] .ew-hero__panel {
    width: fit-content; max-width: 70%; padding: 16px 24px; border-radius: var(--ew-groovy-panel);
    background: var(--ew-groovy-heading-bg); color: var(--ew-groovy-heading-fg);
  }
  [data-era="groovy"] .ew-hero__title { margin: 0; font-size: clamp(2.4rem,5.2vw,5.5rem); line-height: 0.98; letter-spacing: -0.035em; color: inherit; text-shadow: none; }
  [data-era="groovy"] .ew-hero__subtitle { max-width: 52ch; margin: 12px 0 0; font-size: 1rem; line-height: 1.5; }
  [data-era="groovy"] :is(.ew-hero__rays,.ew-hero__fan) { display: none; }
  ${costumeSel('groovy',' .ew-hero__fan')} { display: block; width: 42px; height: 42px; background: ${bloom} center / contain no-repeat; }
  /* Native data primitives retain their real values; no invented chart component/API. */
  [data-era="groovy"] :is(meter,progress) { width: 100%; height: 20px; accent-color: var(--ew-color-aqua); }
  [data-era="groovy"] meter::-webkit-meter-bar,
  [data-era="groovy"] progress::-webkit-progress-bar {
    border: 1px solid var(--ew-color-border-strong); border-radius: var(--ew-groovy-control); background: var(--ew-color-bg-surface);
  }
  [data-era="groovy"] meter::-webkit-meter-optimum-value,
  [data-era="groovy"] progress::-webkit-progress-value {
    border-radius: var(--ew-groovy-control); background: var(--ew-color-aqua);
  }
  [data-era="groovy"] meter::-moz-meter-bar { background: var(--ew-color-aqua); }
  [data-era="groovy"] progress::-moz-progress-bar { background: var(--ew-color-aqua); }
  [data-era="groovy"] .ew-card figure { margin: 0; padding: 12px; border: var(--ew-groovy-line) solid var(--ew-color-border-strong); border-radius: var(--ew-groovy-panel); box-shadow: var(--ew-groovy-figure-rim); }
  [data-era="groovy"] .ew-card figcaption { font-family: var(--ew-font-display); font-size: 1.25rem; margin-bottom: 8px; }
  [data-era="groovy"] .ew-card svg[role="img"] { max-width: 100%; height: auto; color: var(--ew-color-aqua); }
  [data-era="groovy"] .ew-card svg[role="img"] text { font-family: var(--ew-font-body); fill: var(--ew-color-fg-default); }
  [data-era="groovy"] .ew-card table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  [data-era="groovy"] .ew-card :is(th,td) { padding: 9px 8px; text-align: start; border-bottom: 1px solid color-mix(in srgb,var(--ew-color-border-strong) 28%,transparent); }
  [data-era="groovy"] .ew-card th { font-weight: 700; }
  [data-era="groovy"] :is(.ew-button,.ew-icon-button,.ew-link,.ew-text-field__control,.ew-textarea__control,.ew-select__control,.ew-select__trigger,.ew-slider__control,[role="tab"],.ew-menu__item):focus-visible,
  [data-era="groovy"] :is(.ew-checkbox__control,.ew-radio__control,.ew-switch__control):focus-visible + span {
    outline: 3px solid var(--ew-color-field-focus); outline-offset: 4px;
  }
  @media (max-width: 600px) {
    [data-era="groovy"] .ew-hero { padding: 14px; }
    [data-era="groovy"] .ew-hero__panel { max-width: 100%; padding: 16px; }
    [data-era="groovy"] .ew-hero__backdrop { background-size: auto 100%; }
    [data-era="groovy"] .ew-card__header :is(h2,h3) { font-size: 1.45rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-era="groovy"] *, [data-era="groovy"] *::before, [data-era="groovy"] *::after { animation: none; transition: none; }
  }
  @media (forced-colors: active) {
    [data-era="groovy"] { --ew-groovy-heading-bg: Canvas !important; --ew-groovy-heading-fg: CanvasText !important; --ew-groovy-rim: none !important; --ew-groovy-ornament: none !important; --ew-groovy-frame: none !important; --ew-groovy-figure-rim: none !important; }
    [data-era="groovy"] :is(.ew-button,.ew-icon-button,.ew-card,.ew-dialog,[role="tab"],.ew-checkbox__box,.ew-radio__disc,.ew-switch__track,.ew-switch__thumb) { border-color: ButtonText; box-shadow: none; }
    [data-era="groovy"] :is(.ew-button,.ew-icon-button,.ew-tooltip__tip) { background: ButtonFace !important; color: ButtonText !important; }
    [data-era="groovy"] :is([role="tab"][aria-selected="true"],.ew-link[aria-current="page"]) { background: Highlight !important; color: HighlightText !important; }
    [data-era="groovy"] .ew-checkbox__control:checked + .ew-checkbox__box { background: Highlight; }
    [data-era="groovy"] .ew-checkbox__box::after { border-color: HighlightText; }
    [data-era="groovy"] .ew-radio__disc::after { background: Highlight; }
    [data-era="groovy"] :is(.ew-hero__fan,.ew-ornament-divider)::before { content: none; }
  }
`;
}
