import { bandSel, costumeSel, muteBandSel } from './band.js';

/**
 * Memphis forms: enamel fills, a heavy keyline, and elementary shapes
 * (ball, bar, block, triangle). The costume ground is a pale dot field
 * with a few large shapes at low opacity, so the strong colors stay
 * behind the type and the controls. Text on yellow, pink, and mint uses
 * a fixed dark ink so dark mode does not invert it to white.
 */
export function memphisDecoratorCss() {
  const sliderThumb = (fill, stroke) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 26'><polygon points='15,2.5 27.5,23.5 2.5,23.5' fill='${fill}' stroke='${stroke}' stroke-width='3' stroke-linejoin='miter'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  };
  const sliderThumbLight = sliderThumb('#1a83db', '#14151f');
  const sliderThumbDark = sliderThumb('#53a3f2', '#f2efe0');
  const shapeField = (shapeOpacity) => {
    const red = '#e6443a';
    const yellow = '#f0d947';
    const blue = '#4087de';
    const pink = '#e96cad';
    const shapes = `<polygon points='70,36 176,36 176,150' fill='${red}'/><rect x='220' y='78' width='72' height='72' fill='${yellow}'/><polyline points='500,36 590,36 590,88 546,88 546,150 500,150' fill='none' stroke='${blue}' stroke-width='30' stroke-linejoin='miter' stroke-linecap='square'/><polyline points='150,300 150,370 198,370 198,440 246,440 246,510' fill='none' stroke='${blue}' stroke-width='30' stroke-linejoin='miter' stroke-linecap='butt'/><rect x='470' y='360' width='130' height='90' fill='${pink}'/><polygon points='40,470 150,470 40,610' fill='${pink}'/><rect x='330' y='540' width='36' height='36' fill='${yellow}'/>`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 640 640'><g opacity='${shapeOpacity}'>${shapes}</g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  };
  const squiggle = (ink) => {
    const d = 'M4 16c10-12 10-12 20 0s10 12 20 0 10-12 20 0 10 12 20 0 10-12 20 0';
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='104' height='28' viewBox='0 0 104 28'><path d='${d}' fill='none' stroke='${ink}' stroke-width='6' stroke-linecap='square' opacity='0.72'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  };
  const groundLight = shapeField('0.38');
  const groundDark = shapeField('0.28');
  const squiggleLight = squiggle('#3072c1');
  const squiggleDark = squiggle('#85bcf5');
  const costumeDark = costumeSel('memphis').replaceAll('[data-era="memphis"]', '[data-era="memphis"][data-mode="dark"]');
  const whisperFields = [
    ' .ew-text-field__control',
    ' .ew-textarea__control',
    ' .ew-select__trigger',
    ' .ew-select__control',
  ].map((rest) => bandSel('memphis', 'whisper', rest)).join(',\n  ');
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
  ].map((rest) => bandSel('memphis', 'whisper', rest)).join(',\n  ');

  return `  [data-era="memphis"] {
    --ew-memphis-ink: oklch(18% 0.04 280);
  }
  ${costumeSel('memphis')} {
    background-color: var(--ew-color-bg-page);
    background-image: radial-gradient(circle, #2b7ec98c 3.4px, transparent 3.6px), ${groundLight};
    background-repeat: repeat, repeat;
    background-size: 36px 36px, 640px 640px;
  }
  ${costumeDark} {
    background-color: var(--ew-color-bg-page);
    background-image: radial-gradient(circle, #85bcf566 3.4px, transparent 3.6px), ${groundDark};
  }
  [data-era="memphis"] .ew-button,
  [data-era="memphis"] .ew-icon-button {
    background: var(--ew-color-yellow);
    color: var(--ew-memphis-ink);
    border: 3px solid var(--ew-color-ink);
    border-radius: 0;
    box-shadow: 4px 4px 0 0 var(--ew-color-pink);
    transform: none;
  }
  [data-era="memphis"] .ew-button:hover,
  [data-era="memphis"] .ew-icon-button:hover {
    background: color-mix(in oklch, var(--ew-color-yellow) 78%, var(--ew-memphis-ink));
  }
  [data-era="memphis"] .ew-button[data-variant="secondary"] {
    background: var(--ew-color-pink);
    color: var(--ew-memphis-ink);
    border-radius: 0;
    box-shadow: 4px 4px 0 0 var(--ew-color-blue);
  }
  [data-era="memphis"] .ew-button[data-variant="secondary"]:hover {
    background: color-mix(in oklch, var(--ew-color-pink) 82%, var(--ew-memphis-ink));
  }
  [data-era="memphis"] .ew-button[data-variant="ghost"],
  [data-era="memphis"] .ew-icon-button[data-variant="ghost"] {
    background: transparent;
    color: var(--ew-color-fg-default);
    border-color: transparent;
    box-shadow: none;
  }
  [data-era="memphis"] .ew-button[data-variant="danger"] {
    background: var(--ew-color-danger-bg);
    color: var(--ew-color-danger-fg);
    border-color: var(--ew-color-ink);
    border-radius: 0;
    box-shadow: 4px 4px 0 0 var(--ew-color-yellow);
  }
  [data-era="memphis"] .ew-button:focus-visible,
  [data-era="memphis"] .ew-icon-button:focus-visible {
    outline: 3px solid var(--ew-color-blue);
    outline-offset: 3px;
  }
  [data-era="memphis"] .ew-text-field__control,
  [data-era="memphis"] .ew-textarea__control,
  [data-era="memphis"] .ew-select__trigger,
  [data-era="memphis"] .ew-select__control {
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    border: 3px solid var(--ew-color-ink);
    border-left-width: 8px;
    border-left-color: var(--ew-color-yellow);
    border-radius: 0;
    box-shadow: 4px 4px 0 0 var(--ew-color-pink);
  }
  [data-era="memphis"] .ew-textarea__control {
    border-left-color: var(--ew-color-mint);
    border-radius: 0;
    box-shadow: 4px 4px 0 0 var(--ew-color-blue);
  }
  [data-era="memphis"] .ew-select__list {
    border: 3px solid var(--ew-color-ink);
    border-radius: 0;
    background: var(--ew-color-bg-elevated);
    box-shadow: 5px 5px 0 0 var(--ew-color-pink);
  }
  [data-era="memphis"] .ew-select__option[aria-selected="true"] {
    background: var(--ew-color-yellow);
    color: var(--ew-memphis-ink);
  }
  [data-era="memphis"] .ew-checkbox__box {
    width: 22px;
    height: 22px;
    border: 3px solid var(--ew-color-ink);
    border-radius: 0;
    background: var(--ew-color-bg-elevated);
    box-shadow: 3px 3px 0 0 var(--ew-color-blue);
  }
  [data-era="memphis"] .ew-checkbox__box::after {
    border-color: var(--ew-memphis-ink);
  }
  [data-era="memphis"] .ew-checkbox__control:checked + .ew-checkbox__box {
    background: var(--ew-color-yellow);
    border-color: var(--ew-color-ink);
  }
  [data-era="memphis"] .ew-radio__disc {
    width: 22px;
    height: 22px;
    border: 3px solid var(--ew-color-ink);
    background: var(--ew-color-bg-elevated);
    box-shadow: 3px 3px 0 0 var(--ew-color-pink);
  }
  [data-era="memphis"] .ew-radio__disc::after {
    width: 12px;
    height: 12px;
    background: var(--ew-color-blue);
  }
  [data-era="memphis"] .ew-switch__track {
    width: 56px;
    height: 30px;
    padding: 2px;
    border-radius: 0;
    border: 3px solid var(--ew-color-ink);
    background: var(--ew-color-bg-elevated);
    box-shadow: 3px 3px 0 0 var(--ew-color-mint);
  }
  [data-era="memphis"] .ew-switch__thumb {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: var(--ew-color-yellow);
    border: 2px solid var(--ew-color-ink);
    box-shadow: none;
  }
  [data-era="memphis"] .ew-switch__control:checked + .ew-switch__track {
    background: var(--ew-color-pink);
    border-color: var(--ew-color-ink);
  }
  [data-era="memphis"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    transform: translateX(24px);
    background: var(--ew-memphis-ink);
  }
  [data-era="memphis"] .ew-switch__control:focus-visible + .ew-switch__track {
    outline: 3px solid var(--ew-color-blue);
    outline-offset: 3px;
  }
  [data-era="memphis"] .ew-slider__control {
    -webkit-appearance: none;
    appearance: none;
    height: 14px;
    margin: 8px 0;
    background: var(--ew-color-yellow);
    border: 3px solid var(--ew-color-ink);
    border-radius: 0;
    accent-color: var(--ew-color-blue);
  }
  /* WebKit and Firefox thumbs stay in separate rules. A grouped selector is dropped by the engine that does not know the other pseudo. */
  [data-era="memphis"] .ew-slider__control::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 30px;
    height: 26px;
    margin-top: 0;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 30px 26px;
    background-image: ${sliderThumbLight};
    box-shadow: none;
  }
  [data-era="memphis"] .ew-slider__control::-moz-range-thumb {
    appearance: none;
    width: 30px;
    height: 26px;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 30px 26px;
    background-image: ${sliderThumbLight};
    box-shadow: none;
  }
  [data-era="memphis"][data-mode="dark"] .ew-slider__control::-webkit-slider-thumb {
    background-image: ${sliderThumbDark};
  }
  [data-era="memphis"][data-mode="dark"] .ew-slider__control::-moz-range-thumb {
    background-image: ${sliderThumbDark};
  }
  [data-era="memphis"] .ew-tabs [role="tab"],
  [data-era="memphis"] ew-tabs [role="tab"] {
    border: 3px solid var(--ew-color-ink);
    border-bottom-width: 3px;
    border-radius: 0;
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: none;
  }
  [data-era="memphis"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="memphis"] ew-tabs [role="tab"][aria-selected="true"] {
    background: var(--ew-color-yellow);
    color: var(--ew-memphis-ink);
    border-bottom-color: var(--ew-color-ink);
    box-shadow: 3px 3px 0 0 var(--ew-color-blue);
  }
  [data-era="memphis"] .ew-card {
    border-width: 3px;
    border-radius: 0;
    box-shadow: 6px 6px 0 0 var(--ew-color-ink);
  }
  [data-era="memphis"] .ew-card[data-variant="raised"] {
    box-shadow: 6px 6px 0 0 var(--ew-color-pink);
  }
  ${muteBandSel('memphis', ' .ew-card__header::before')} { display: none; }
  [data-era="memphis"] .ew-card__header::before {
    content: "";
    display: block;
    width: 28px;
    height: 10px;
    margin-bottom: 8px;
    background:
      radial-gradient(circle at 4px 5px, var(--ew-color-pink) 0 3px, transparent 3.5px),
      radial-gradient(circle at 14px 5px, var(--ew-color-blue) 0 3px, transparent 3.5px),
      radial-gradient(circle at 24px 5px, var(--ew-color-yellow) 0 3px, transparent 3.5px);
  }
  [data-era="memphis"] .ew-dialog {
    border: 3px solid var(--ew-color-ink);
    border-radius: 0;
    box-shadow: 8px 8px 0 0 var(--ew-color-pink);
  }
  [data-era="memphis"] .ew-alert {
    border: 3px solid var(--ew-color-ink);
    border-radius: 0;
    border-inline-start-width: 8px;
    border-inline-start-color: var(--ew-color-blue);
  }
  [data-era="memphis"] .ew-alert[data-variant="warning"] { border-inline-start-color: var(--ew-color-yellow); }
  [data-era="memphis"] .ew-alert[data-variant="success"] { border-inline-start-color: var(--ew-color-mint); }
  [data-era="memphis"] .ew-alert[data-variant="danger"] { border-inline-start-color: var(--ew-color-pink); }
  [data-era="memphis"] .ew-menu__panel,
  [data-era="memphis"] .ew-popover__panel,
  [data-era="memphis"] .ew-tooltip__tip {
    border: 3px solid var(--ew-color-ink);
    border-radius: 0;
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: 4px 4px 0 0 var(--ew-color-mint);
  }
  ${costumeSel('memphis', ' .ew-ornament-divider')} {
    height: 28px;
    border: 0;
    background-color: transparent;
    background-image: ${squiggleLight};
    background-repeat: repeat-x;
    background-size: 104px 28px;
    background-position: left center;
  }
  ${costumeDark.split(',\n  ').map((part) => `${part} .ew-ornament-divider`).join(',\n  ')} {
    background-image: ${squiggleDark};
  }
  ${costumeSel('memphis', ' .ew-ornament-divider::before')} {
    content: none;
  }
  ${whisperFields} {
    border-left-width: 3px;
    border-left-color: var(--ew-color-ink);
  }
  ${whisperShadow} {
    box-shadow: none;
  }
`;
}
