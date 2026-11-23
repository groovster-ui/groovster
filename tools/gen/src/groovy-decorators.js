import { bandSel, costumeSel, muteBandSel } from './band.js';

/**
 * Groovy poster forms from the psychedelic brief: cream or plum paper,
 * a thick ink keyline, sun / daisy / wave motifs, and a hard second-color
 * offset. Fills that carry type (sun, magenta, lime) use a fixed dark ink
 * so dark mode does not flip that type to cream.
 */
export function groovyDecoratorCss() {
  // Hex inside data-URI SVGs. oklch() in an SVG image is not a valid painted color.
  const sun = '#facb39';
  const tangerine = '#f0772d';
  const magenta = '#d6286a';
  const lime = '#89ce5f';
  const aqua = '#24c1c9';
  const inkHex = '#2d1205';

  const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  // Parallel outlined ribbons, the way the Stay Groovy poster is built:
  // one shared curve, a black keyline on every band, daisies in a separate tile
  // so a full-width stretch does not squash the flowers.
  const inkLine = '#1c140f';
  const curve = (y, amp) =>
    `M0 ${y} C120 ${y - amp} 120 ${y - amp} 240 ${y} C360 ${y + amp} 360 ${y + amp} 480 ${y}`;
  const flower = (cx, cy, petal, r) => {
    let petals = '';
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      const px = (cx + Math.cos(angle) * r * 0.62).toFixed(1);
      const py = (cy + Math.sin(angle) * r * 0.62).toFixed(1);
      const rot = ((angle * 180) / Math.PI).toFixed(1);
      petals += `<ellipse cx='${px}' cy='${py}' rx='${(r * 0.46).toFixed(1)}' ry='${(r * 0.3).toFixed(1)}' transform='rotate(${rot} ${px} ${py})' fill='${petal}' stroke='${inkLine}' stroke-width='1.4'/>`;
    }
    return `${petals}<circle cx='${cx}' cy='${cy}' r='${(r * 0.34).toFixed(1)}' fill='#f2c14b' stroke='${inkLine}' stroke-width='1.4'/>`;
  };
  const sparkle = (x, y, s) =>
    `<path d='M${x} ${y - s} L${(x + s * 0.2).toFixed(1)} ${(y - s * 0.2).toFixed(1)} L${x + s} ${y} L${(x + s * 0.2).toFixed(1)} ${(y + s * 0.2).toFixed(1)} L${x} ${y + s} L${(x - s * 0.2).toFixed(1)} ${(y + s * 0.2).toFixed(1)} L${x - s} ${y} L${(x - s * 0.2).toFixed(1)} ${(y - s * 0.2).toFixed(1)} Z' fill='#fffdf8' stroke='${inkLine}' stroke-width='0.8'/>`;
  const ribbonField = (colors, { amp = 34, gap = 15, weight = 14, ink = inkLine } = {}) => {
    const pad = 20;
    const height = pad * 2 + (colors.length - 1) * gap + weight;
    const y0 = pad + weight / 2;
    const ribbons = colors.map((fill, index) => {
      const d = curve(y0 + index * gap, amp);
      return `<path d='${d}' fill='none' stroke='${ink}' stroke-width='${weight + 3.4}' stroke-linecap='round'/>` +
        `<path d='${d}' fill='none' stroke='${fill}' stroke-width='${weight}' stroke-linecap='round'/>`;
    }).join('');
    return svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='480' height='${height}' viewBox='0 0 480 ${height}'>${ribbons}</svg>`);
  };
  const daisyScatter = svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'>${flower(36, 40, '#e7a0b4', 22)}${flower(176, 78, '#f08a3c', 26)}${flower(108, 176, '#f3b7c6', 16)}${flower(48, 150, '#f0a07a', 12)}${sparkle(120, 36, 7)}${sparkle(70, 96, 5)}${sparkle(168, 150, 6)}</svg>`);
  const pageRibbons = ribbonField(['#e7a23a', '#f08a3c', '#f3c16a', '#f0b7c4', '#e48b9a', '#f6d7b0']);
  const pageRibbonsDark = ribbonField(['#d0892e', '#e07a45', '#e0b15c', '#d9899a', '#c46b78', '#e7c49a'], { ink: '#f6efe4' });
  const heroRibbons = ribbonField(['#f3c16a', '#e7a23a', '#f08a3c', '#e48b9a', '#f0b7c4', '#f6d7b0', '#e7a08a'], { amp: 42, gap: 16, weight: 16 });
  const waveRule = ribbonField(['#e7a23a', '#f08a3c', '#e48b9a'], { amp: 12, gap: 10, weight: 9 });

  const sunThumb = (stroke) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
      <g fill='none' stroke='${stroke}' stroke-width='2' stroke-linecap='round'>
        <path d='M16 2.5v4.5M16 25v4.5M2.5 16h4.5M25 16h4.5M6.2 6.2l3.2 3.2M22.6 22.6l3.2 3.2M25.8 6.2l-3.2 3.2M9.4 22.6l-3.2 3.2'/>
      </g>
      <circle cx='16' cy='16' r='6.5' fill='${sun}' stroke='${stroke}' stroke-width='2'/>
    </svg>`);

  const daisy = (stroke) => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <circle cx='32' cy='14' r='10' fill='${magenta}'/>
      <circle cx='48' cy='24' r='10' fill='${tangerine}'/>
      <circle cx='44' cy='42' r='10' fill='${sun}'/>
      <circle cx='20' cy='42' r='10' fill='${lime}'/>
      <circle cx='16' cy='24' r='10' fill='${aqua}'/>
      <circle cx='32' cy='30' r='8' fill='${sun}' stroke='${stroke}' stroke-width='3'/>
    </svg>`);

  const ink = 'oklch(22% 0.05 45)';
  const paper = 'oklch(97% 0.025 90)';
  const thumbLight = sunThumb(inkHex);
  const daisyLight = daisy(inkHex);
  const costumeDark = costumeSel('groovy').replaceAll('[data-era="groovy"]', '[data-era="groovy"][data-mode="dark"]');
  const whisperShadow = [
    ' .ew-button',
    ' .ew-icon-button',
    ' .ew-checkbox__box',
    ' .ew-radio__disc',
    ' .ew-switch__track',
    ' .ew-text-field__control',
    ' .ew-textarea__control',
    ' .ew-select__trigger',
    ' .ew-select__control',
    ' .ew-tabs [role="tab"]',
    ' ew-tabs [role="tab"]',
    ' .ew-card',
    ' .ew-alert',
    ' .ew-dialog',
    ' .ew-toast',
    ' .ew-menu__panel',
    ' .ew-popover__panel',
    ' .ew-tooltip__tip',
    ' .ew-hero',
  ].map((rest) => bandSel('groovy', 'whisper', rest)).join(',\n  ');

  return `  [data-era="groovy"] {
    --ew-groovy-daisy: ${daisyScatter};
    --ew-groovy-ink: ${ink};
    --ew-groovy-paper: ${paper};
    --ew-groovy-blob: 28px 42px 22px 36px / 36px 22px 40px 26px;
    --ew-groovy-field: 16px 22px 14px 20px / 20px 14px 22px 16px;
  }
  [data-era="groovy"] :is(h1, h2, h3, .ew-hero__title, .ew-card__header :is(h2, h3), .ew-dialog__header :is(h2, h3)) {
    font-family: var(--ew-font-display, "Lilita One", system-ui, sans-serif);
    font-weight: 400;
    letter-spacing: 0.01em;
    line-height: 1.05;
  }
  ${costumeSel('groovy')} {
    background-color: #fffaf4;
    background-image: var(--ew-groovy-daisy), ${pageRibbons};
    background-repeat: repeat, repeat-y;
    background-size: 440px 440px, 100% 520px;
    background-position: center top, center top;
  }
  ${costumeDark} {
    background-color: oklch(24% 0.045 350);
    background-image: var(--ew-groovy-daisy), ${pageRibbonsDark};
  }
  /* The poster stays in the margins and the hero. Body type sits on a plate. */
  ${costumeSel('groovy', ' :is(main, footer)')} {
    background-color: var(--ew-color-bg-elevated);
    background-image: none;
  }
  ${costumeSel('groovy', ' nav:not(.ew-breadcrumb)')} {
    position: relative;
    z-index: 3;
    margin: 12px 0 16px;
    padding: 10px 18px;
    background-color: var(--ew-color-bg-elevated);
    background-image: none;
    border: 3px solid var(--ew-groovy-ink);
    border-radius: 999px;
    box-shadow: 4px 4px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] main :is(h2, h3) {
    display: inline-block;
    padding-bottom: 0.35em;
    background-image: ${waveRule};
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 100% 8px;
  }
  [data-era="groovy"] ::selection {
    background: var(--ew-color-sun);
    color: var(--ew-groovy-ink);
  }
  [data-era="groovy"] .ew-link:not([data-variant="nav"]) {
    color: var(--ew-color-violet);
    text-decoration-line: underline;
    text-decoration-style: wavy;
    text-decoration-color: var(--ew-color-magenta);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.2em;
  }
  [data-era="groovy"] .ew-button,
  [data-era="groovy"] .ew-icon-button {
    border: 3px solid var(--ew-groovy-ink);
    border-radius: 999px;
    background: var(--ew-color-sun);
    color: var(--ew-groovy-ink);
    box-shadow: 4px 4px 0 0 var(--ew-color-magenta);
    font-family: var(--ew-font-body, Mulish, system-ui, sans-serif);
    font-weight: 700;
  }
  [data-era="groovy"] .ew-icon-button {
    width: 44px;
    height: 44px;
  }
  [data-era="groovy"] .ew-button:not([data-variant]):hover,
  [data-era="groovy"] .ew-button[data-variant="primary"]:hover,
  [data-era="groovy"] .ew-icon-button:not([data-variant]):hover,
  [data-era="groovy"] .ew-icon-button[data-variant="primary"]:hover {
    background: color-mix(in oklch, var(--ew-color-sun) 78%, var(--ew-groovy-ink));
  }
  [data-era="groovy"] .ew-button:not([data-variant]):active,
  [data-era="groovy"] .ew-button[data-variant="primary"]:active,
  [data-era="groovy"] .ew-icon-button:not([data-variant]):active,
  [data-era="groovy"] .ew-icon-button[data-variant="primary"]:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-button[data-variant="secondary"],
  [data-era="groovy"] .ew-icon-button[data-variant="secondary"] {
    background: oklch(56% 0.19 5);
    color: var(--ew-groovy-paper);
    border-color: var(--ew-groovy-ink);
    box-shadow: 4px 4px 0 0 var(--ew-color-aqua);
  }
  [data-era="groovy"][data-mode="dark"] .ew-button[data-variant="secondary"],
  [data-era="groovy"][data-mode="dark"] .ew-icon-button[data-variant="secondary"] {
    background: var(--ew-color-magenta);
    color: var(--ew-groovy-ink);
  }
  [data-era="groovy"] .ew-button[data-variant="secondary"]:hover,
  [data-era="groovy"] .ew-icon-button[data-variant="secondary"]:hover {
    background: color-mix(in oklch, oklch(56% 0.19 5) 82%, var(--ew-groovy-ink));
  }
  [data-era="groovy"][data-mode="dark"] .ew-button[data-variant="secondary"]:hover,
  [data-era="groovy"][data-mode="dark"] .ew-icon-button[data-variant="secondary"]:hover {
    background: color-mix(in oklch, var(--ew-color-magenta) 82%, var(--ew-groovy-ink));
  }
  [data-era="groovy"] .ew-button[data-variant="secondary"]:active,
  [data-era="groovy"] .ew-icon-button[data-variant="secondary"]:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 0 var(--ew-color-aqua);
  }
  [data-era="groovy"] .ew-button[data-variant="ghost"],
  [data-era="groovy"] .ew-icon-button[data-variant="ghost"] {
    background: transparent;
    color: var(--ew-color-fg-default);
    border-color: transparent;
    box-shadow: none;
  }
  [data-era="groovy"] .ew-button[data-variant="ghost"]:hover,
  [data-era="groovy"] .ew-icon-button[data-variant="ghost"]:hover {
    background: color-mix(in oklch, var(--ew-color-sun) 55%, transparent);
  }
  [data-era="groovy"] .ew-button[data-variant="ghost"]:active,
  [data-era="groovy"] .ew-icon-button[data-variant="ghost"]:active {
    transform: none;
    box-shadow: none;
  }
  [data-era="groovy"] .ew-button[data-variant="danger"] {
    background: var(--ew-color-danger-bg);
    color: var(--ew-color-danger-fg);
    border-color: var(--ew-groovy-ink);
    box-shadow: 4px 4px 0 0 var(--ew-color-sun);
  }
  [data-era="groovy"] .ew-button[data-variant="danger"]:hover {
    background: color-mix(in oklch, var(--ew-color-danger-bg) 86%, var(--ew-groovy-ink));
  }
  [data-era="groovy"] .ew-button[data-variant="danger"]:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 0 var(--ew-color-sun);
  }
  [data-era="groovy"] .ew-button:focus-visible,
  [data-era="groovy"] .ew-icon-button:focus-visible {
    outline: 3px solid var(--ew-color-violet);
    outline-offset: 3px;
  }
  [data-era="groovy"] .ew-text-field__control,
  [data-era="groovy"] .ew-textarea__control,
  [data-era="groovy"] .ew-select__trigger,
  [data-era="groovy"] .ew-select__control,
  [data-era="groovy"] .ew-text-field[data-variant="filled"] .ew-text-field__control,
  [data-era="groovy"] .ew-text-field[data-variant="underline"] .ew-text-field__control,
  [data-era="groovy"] .ew-text-field:where([data-underline="true"]) .ew-text-field__control {
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    border: 3px solid var(--ew-color-ink);
    border-radius: var(--ew-groovy-field);
    box-shadow: 4px 4px 0 0 var(--ew-color-tangerine);
  }
  [data-era="groovy"] .ew-textarea__control {
    border-radius: var(--ew-groovy-blob);
    box-shadow: 4px 4px 0 0 var(--ew-color-violet);
    min-height: 112px;
  }
  [data-era="groovy"] .ew-text-field__control::placeholder,
  [data-era="groovy"] .ew-textarea__control::placeholder {
    color: var(--ew-color-fg-muted);
  }
  [data-era="groovy"] .ew-text-field__control:focus-visible,
  [data-era="groovy"] .ew-textarea__control:focus-visible,
  [data-era="groovy"] .ew-select__trigger:focus-visible,
  [data-era="groovy"] .ew-select__control:focus-visible {
    outline: 3px solid var(--ew-color-violet);
    outline-offset: 3px;
    border-color: var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-text-field[data-invalid="true"] .ew-text-field__control,
  [data-era="groovy"] .ew-textarea[data-invalid="true"] .ew-textarea__control {
    border-color: var(--ew-color-danger-bg);
    box-shadow: 4px 4px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-select__list {
    border: 3px solid var(--ew-color-ink);
    border-radius: var(--ew-groovy-blob);
    background: var(--ew-color-bg-elevated);
    box-shadow: 5px 5px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-select__option,
  [data-era="groovy"] .ew-menu__item {
    border-radius: 12px;
  }
  [data-era="groovy"] .ew-select__option[aria-selected="true"],
  [data-era="groovy"] .ew-select__option:hover,
  [data-era="groovy"] .ew-menu__item:hover {
    background: var(--ew-color-sun);
    color: var(--ew-groovy-ink);
  }
  [data-era="groovy"] .ew-checkbox__box {
    width: 22px;
    height: 22px;
    border: 3px solid var(--ew-color-ink);
    border-radius: 8px;
    background: var(--ew-color-bg-elevated);
    box-shadow: 3px 3px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-checkbox__box::after {
    border-color: var(--ew-groovy-ink);
  }
  [data-era="groovy"] .ew-checkbox__control:checked + .ew-checkbox__box {
    background: var(--ew-color-sun);
    border-color: var(--ew-color-ink);
  }
  [data-era="groovy"] .ew-checkbox__control:focus-visible + .ew-checkbox__box {
    outline: 3px solid var(--ew-color-violet);
    outline-offset: 3px;
  }
  [data-era="groovy"] .ew-radio__disc {
    width: 22px;
    height: 22px;
    border: 3px solid var(--ew-color-ink);
    background: var(--ew-color-bg-elevated);
    box-shadow: 3px 3px 0 0 var(--ew-color-aqua);
  }
  [data-era="groovy"] .ew-radio__disc::after {
    width: 10px;
    height: 10px;
    background: var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-radio__control:focus-visible + .ew-radio__disc {
    outline: 3px solid var(--ew-color-violet);
    outline-offset: 3px;
  }
  [data-era="groovy"] .ew-switch__track {
    width: 56px;
    height: 30px;
    padding: 2px;
    border-radius: 999px;
    border: 3px solid var(--ew-color-ink);
    background: var(--ew-color-bg-elevated);
    box-shadow: 3px 3px 0 0 var(--ew-color-tangerine);
  }
  [data-era="groovy"] .ew-switch__thumb {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: var(--ew-color-sun);
    border: 2px solid var(--ew-groovy-ink);
    box-shadow: none;
  }
  [data-era="groovy"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-sun);
  }
  [data-era="groovy"] .ew-switch__control:checked + .ew-switch__track {
    background: var(--ew-color-magenta);
    border-color: var(--ew-color-ink);
  }
  [data-era="groovy"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    transform: translateX(24px);
    background: var(--ew-groovy-ink);
  }
  [data-era="groovy"] .ew-switch__control:focus-visible + .ew-switch__track {
    outline: 3px solid var(--ew-color-violet);
    outline-offset: 3px;
  }
  [data-era="groovy"] .ew-slider__control {
    -webkit-appearance: none;
    appearance: none;
    height: 16px;
    margin: 10px 0;
    border: 3px solid var(--ew-color-ink);
    border-radius: 999px;
    background: linear-gradient(90deg, var(--ew-color-sun), var(--ew-color-tangerine) 28%, var(--ew-color-magenta) 52%, var(--ew-color-violet) 74%, var(--ew-color-aqua));
    accent-color: var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-slider__control::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 32px;
    height: 32px;
    margin-top: -8px;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 32px 32px;
    background-image: ${thumbLight};
    box-shadow: none;
  }
  [data-era="groovy"] .ew-slider__control::-moz-range-thumb {
    appearance: none;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 32px 32px;
    background-image: ${thumbLight};
    box-shadow: none;
  }
  [data-era="groovy"] .ew-slider__control:focus-visible {
    outline: 3px solid var(--ew-color-violet);
    outline-offset: 4px;
  }
  [data-era="groovy"] .ew-tabs [role="tablist"],
  [data-era="groovy"] ew-tabs [role="tablist"] {
    border-bottom: 0;
    gap: 10px;
  }
  [data-era="groovy"] .ew-tabs [role="tab"],
  [data-era="groovy"] ew-tabs [role="tab"] {
    border: 3px solid var(--ew-color-ink);
    border-radius: 999px;
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    padding: 8px 16px;
    box-shadow: none;
  }
  [data-era="groovy"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="groovy"] ew-tabs [role="tab"][aria-selected="true"] {
    background: var(--ew-color-sun);
    color: var(--ew-groovy-ink);
    border-color: var(--ew-color-ink);
    box-shadow: 3px 3px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-tabs [role="tab"]:focus-visible,
  [data-era="groovy"] ew-tabs [role="tab"]:focus-visible {
    outline: 3px solid var(--ew-color-violet);
    outline-offset: 3px;
  }
  [data-era="groovy"] .ew-card {
    border: 3px solid var(--ew-color-ink);
    border-radius: var(--ew-groovy-blob);
    background: var(--ew-color-bg-elevated);
    box-shadow: 6px 6px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-card[data-variant="raised"] {
    box-shadow: 7px 7px 0 0 var(--ew-color-tangerine);
  }
  [data-era="groovy"] .ew-card[data-variant="outline"],
  [data-era="groovy"] .ew-card[data-variant="flat"] {
    box-shadow: none;
  }
  ${muteBandSel('groovy', ' .ew-card__header::after')} { display: none; }
  [data-era="groovy"] .ew-card__header::after {
    content: "";
    display: block;
    height: 48px;
    margin-top: 8px;
    border: 0;
    border-radius: 0;
    background-color: #fffaf4;
    background-image: ${waveRule};
    background-repeat: no-repeat;
    background-size: 100% 48px;
    background-position: left center;
  }
  [data-era="groovy"] .ew-dialog {
    border: 3px solid var(--ew-color-ink);
    border-radius: 36px 28px 44px 32px / 30px 40px 28px 38px;
    background: var(--ew-color-bg-elevated);
    box-shadow: 8px 8px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-alert,
  [data-era="groovy"] .ew-toast {
    border: 3px solid var(--ew-color-ink);
    border-radius: var(--ew-groovy-field);
    border-inline-start-width: 10px;
    border-inline-start-color: var(--ew-color-violet);
    background: var(--ew-color-bg-elevated);
    box-shadow: 4px 4px 0 0 var(--ew-color-tangerine);
  }
  [data-era="groovy"] .ew-alert[data-variant="success"] { border-inline-start-color: var(--ew-color-lime); }
  [data-era="groovy"] .ew-alert[data-variant="warning"] { border-inline-start-color: var(--ew-color-sun); }
  [data-era="groovy"] .ew-alert[data-variant="danger"] { border-inline-start-color: var(--ew-color-magenta); }
  [data-era="groovy"] .ew-menu__panel,
  [data-era="groovy"] .ew-popover__panel,
  [data-era="groovy"] .ew-tooltip__tip {
    border: 3px solid var(--ew-color-ink);
    border-radius: var(--ew-groovy-field);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: 4px 4px 0 0 var(--ew-color-aqua);
  }
  [data-era="groovy"] .ew-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: grid;
    min-height: 320px;
    padding: 28px;
    border: 3px solid var(--ew-color-ink);
    border-radius: 42px 28px 48px 32px / 32px 48px 28px 42px;
    background: var(--ew-color-bg-page);
    box-shadow: 8px 8px 0 0 var(--ew-color-magenta);
  }
  [data-era="groovy"] .ew-hero__backdrop,
  [data-era="groovy"] .ew-hero__stage {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  [data-era="groovy"] .ew-hero__backdrop {
    background-color: #fffaf4;
    background-image: var(--ew-groovy-daisy), ${heroRibbons};
    background-repeat: repeat, no-repeat;
    background-size: 240px 240px, 100% 100%;
    background-position: center, center;
  }
  [data-era="groovy"] .ew-hero__stage {
    background: none;
  }
  [data-era="groovy"] .ew-hero__panel {
    position: relative;
    z-index: 1;
    justify-self: start;
    align-self: end;
    max-width: 34rem;
    padding: 18px 20px 20px;
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    border: 3px solid var(--ew-color-ink);
    border-radius: var(--ew-groovy-blob);
    box-shadow: 6px 6px 0 0 var(--ew-color-aqua);
  }
  [data-era="groovy"] .ew-hero__rays {
    position: absolute;
    z-index: 2;
    width: 72px;
    height: 72px;
    top: 12px;
    inset-inline-end: 12px;
    border-radius: 50%;
    border: 3px solid var(--ew-groovy-ink);
    pointer-events: none;
    background:
      radial-gradient(circle, var(--ew-color-sun) 0 34%, transparent 35%),
      repeating-conic-gradient(from 0deg, var(--ew-color-tangerine) 0 12deg, var(--ew-color-sun) 12deg 24deg);
  }
  [data-era="groovy"] .ew-hero__content {
    position: relative;
    z-index: 1;
    padding-inline-end: 84px;
  }
  [data-era="groovy"] .ew-hero__fan {
    width: 52px;
    height: 52px;
    margin-bottom: 8px;
    background-image: ${daisyLight};
    background-size: 52px 52px;
    background-repeat: no-repeat;
  }
  [data-era="groovy"] .ew-hero__title {
    margin: 0;
    color: #e39b2d;
    font-size: clamp(2.6rem, 5vw, 4.25rem);
    -webkit-text-stroke: 2px #1c140f;
    paint-order: stroke fill;
    text-shadow: 4px 5px 0 #1c140f;
  }
  [data-era="groovy"] .ew-hero__subtitle {
    margin: 8px 0 0;
    max-width: 36ch;
  }
  ${costumeSel('groovy', ' .ew-ornament-divider')} {
    height: 52px;
    border: 0;
    background-color: #fffaf4;
    background-image: ${waveRule};
    background-repeat: no-repeat;
    background-size: 100% 52px;
    background-position: left center;
  }
  ${costumeSel('groovy', ' .ew-ornament-divider::before')} {
    content: none;
  }
  ${bandSel('groovy', 'whisper', ' .ew-hero__stage')},
  ${bandSel('groovy', 'whisper', ' .ew-hero__rays')},
  ${bandSel('groovy', 'whisper', ' .ew-hero__fan')} {
    display: none;
  }
  ${bandSel('groovy', 'whisper', ' .ew-hero__backdrop')} {
    background: none;
  }
  ${bandSel('groovy', 'whisper', ' .ew-hero__content')} {
    padding-inline-end: 0;
  }
  ${whisperShadow} {
    box-shadow: none;
  }
  @media (max-width: 700px) {
    [data-era="groovy"] .ew-hero {
      padding: 16px;
      min-height: 0;
    }
    [data-era="groovy"] .ew-hero__content {
      padding-inline-end: 0;
    }
    [data-era="groovy"] .ew-hero__rays {
      position: static;
      display: block;
      margin-bottom: 10px;
    }
    [data-era="groovy"] .ew-hero__stage {
      background-size: 72px 72px;
    }
  }
`;
}
