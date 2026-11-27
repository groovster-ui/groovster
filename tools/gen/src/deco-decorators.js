import { bandSel } from './band.js';

/**
 * Stepped corner tiles. Stroke hex is baked in (these masks cannot read CSS variables).
 * The outer path must start at M2 28 so the ornament test can find it.
 */
function stepCornerSvg(stroke, corner = 'tl') {
  const transforms = {
    tl: '',
    tr: 'transform="translate(28 0) scale(-1 1)"',
    bl: 'transform="translate(0 28) scale(1 -1)"',
    br: 'transform="translate(28 28) scale(-1 -1)"',
  };
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><g ${transforms[corner]}><path fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linejoin="miter" d="M2 28 V18 H8 V12 H14 V6 H20 V2 H28"/><path fill="none" stroke="${stroke}" stroke-width="1" stroke-linejoin="miter" opacity="0.75" d="M5 28 V21 H11 V15 H17 V9 H23 V5 H28"/></g></svg>`
  );
}

function stepCorners(stroke) {
  const url = (corner) => `url("data:image/svg+xml,${stepCornerSvg(stroke, corner)}")`;
  return { tl: url('tl'), tr: url('tr'), bl: url('bl'), br: url('br') };
}

function svgUrl(body) {
  return `url("data:image/svg+xml,${encodeURIComponent(body)}")`;
}

const STEP_LIGHT = stepCorners('#B08D2C');
const STEP_DARK = stepCorners('#D4AF37');

const FAN = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 64"><path fill="none" stroke="#000" stroke-width="1.6" d="M8 58 L60 6 L112 58"/><path fill="none" stroke="#000" stroke-width="1.35" d="M20 58 L60 16 L100 58"/><path fill="none" stroke="#000" stroke-width="1.2" d="M32 58 L60 26 L88 58"/><path fill="none" stroke="#000" stroke-width="1.1" d="M44 58 L60 36 L76 58"/><path fill="none" stroke="#000" stroke-width="1.35" d="M14 58 A46 46 0 0 1 106 58"/><circle cx="60" cy="58" r="2.3" fill="#000"/></svg>`
);

const DIAMOND = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="1.6" d="M12 2.5 L21.5 12 L12 21.5 L2.5 12 Z"/><path fill="#000" d="M12 8.2 L15.8 12 L12 15.8 L8.2 12 Z"/></svg>`
);

const WING = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 40"><path fill="none" stroke="#000" stroke-width="1.6" d="M4 22 H66 L84 8 L102 22 H164"/><path fill="none" stroke="#000" stroke-width="1.2" d="M22 28 H146"/><path fill="none" stroke="#000" stroke-width="1.05" d="M40 33 H128"/><circle cx="84" cy="22" r="2.2" fill="#000"/></svg>`
);

/**
 * Costume is the default. --ew-deco-costume and --ew-deco-rule inherit from the
 * band (on the era root or an ancestor). Whisper strips steps and metal fills last,
 * so Streamline rounding still reads in the quiet band.
 */
export function decoDecoratorCss() {
  const whisper = (rest = '') => bandSel('deco', 'whisper', rest);

  return `  /* === DECO — lacquer / ivory, stepped frames, fidelity via inherited flags === */

  :root {
    --ew-deco-costume: block;
    --ew-deco-rule: block;
  }
  [data-fidelity-band="whisper"] {
    --ew-deco-costume: none;
    --ew-deco-rule: none;
  }
  [data-fidelity-band="standard"],
  [data-fidelity-band="default"],
  [data-fidelity-band="signature"] {
    --ew-deco-costume: none;
    --ew-deco-rule: block;
  }
  [data-fidelity-band="costume"] {
    --ew-deco-costume: block;
    --ew-deco-rule: block;
  }

  [data-era="deco"] {
    --ew-font-display: "Limelight", "Bodoni Moda", serif;
    --ew-font-body: "Jost", "Futura", sans-serif;
    --ew-font-mono: "IBM Plex Mono", ui-monospace, monospace;
    --ew-gradient-metal-light: linear-gradient(180deg, #8C7020 0%, #6B5010 52%, #8A6818 100%);
    --ew-gradient-metal-dark: linear-gradient(180deg, #F3E6C4 0%, #E0C56A 48%, #C6A04A 100%);
    --ew-gradient-metal: var(--ew-gradient-metal-light);
    --ew-ornament-fan: ${FAN};
    --ew-ornament-diamond: ${DIAMOND};
    --ew-ornament-wing: ${WING};
    --ew-deco-step-tl: ${STEP_LIGHT.tl};
    --ew-deco-step-tr: ${STEP_LIGHT.tr};
    --ew-deco-step-bl: ${STEP_LIGHT.bl};
    --ew-deco-step-br: ${STEP_LIGHT.br};
    --ew-deco-sheen: linear-gradient(180deg, color-mix(in srgb, var(--ew-color-gold) 9%, transparent), transparent 42%);
    --ew-deco-corners: var(--ew-deco-step-tl), var(--ew-deco-step-tr), var(--ew-deco-step-bl), var(--ew-deco-step-br), var(--ew-deco-sheen);
    --ew-deco-corner-size: 24px 24px, 24px 24px, 24px 24px, 24px 24px, auto;
    --ew-deco-corner-pos: left 4px top 4px, right 4px top 4px, left 4px bottom 4px, right 4px bottom 4px, 0 0;
    --ew-deco-btn: linear-gradient(180deg, #3A342C 0%, #171410 46%, #0C0B09 100%);
    --ew-deco-btn-hover: linear-gradient(180deg, #4A4338 0%, #221E18 46%, #12100E 100%);
    --ew-deco-btn-fg: #F2D98A;
    --ew-deco-btn-border: #9A7820;
    line-height: 1.6;
    background-image: linear-gradient(180deg, color-mix(in srgb, var(--ew-color-gold) 7%, var(--ew-color-bg-page)), var(--ew-color-bg-page) 260px);
  }
  [data-era="deco"][data-mode="dark"] {
    --ew-gradient-metal: var(--ew-gradient-metal-dark);
    --ew-deco-step-tl: ${STEP_DARK.tl};
    --ew-deco-step-tr: ${STEP_DARK.tr};
    --ew-deco-step-bl: ${STEP_DARK.bl};
    --ew-deco-step-br: ${STEP_DARK.br};
    --ew-deco-sheen: linear-gradient(180deg, color-mix(in srgb, white 8%, transparent), transparent 30%);
    --ew-deco-btn: linear-gradient(180deg, #F0E2BC 0%, #D4AF37 46%, #A88830 100%);
    --ew-deco-btn-hover: linear-gradient(180deg, #F7EDD4 0%, #E2C15A 46%, #B8953C 100%);
    --ew-deco-btn-fg: #0C0B09;
    --ew-deco-btn-border: #6A5018;
  }

  [data-era="deco"] h1 {
    font-family: var(--ew-font-display);
    font-weight: 400;
    letter-spacing: 0.04em;
    line-height: 1.05;
    text-transform: uppercase;
    text-wrap: balance;
  }
  [data-era="deco"] h2 {
    font-family: var(--ew-font-body);
    font-weight: 500;
    letter-spacing: 0.14em;
    line-height: 1.25;
    text-transform: uppercase;
    text-wrap: balance;
  }
  [data-era="deco"] h3 {
    font-family: var(--ew-font-body);
    font-weight: 600;
    letter-spacing: 0.1em;
    line-height: 1.35;
    text-transform: uppercase;
    text-wrap: balance;
  }

  [data-era="deco"] .ew-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-height: min(78vh, 820px);
    display: grid;
    place-items: center;
    padding: 56px 24px 72px;
  }
  [data-era="deco"] .ew-hero__backdrop {
    display: var(--ew-deco-costume);
    position: absolute;
    left: 50%;
    bottom: 0;
    width: min(1280px, 168%);
    height: min(520px, 74%);
    transform: translateX(-50%);
    background:
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center bottom / 62% 1px no-repeat,
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center calc(100% - 6px) / 40% 1px no-repeat,
      repeating-conic-gradient(
        from -90deg at 50% 100%,
        color-mix(in oklch, var(--ew-color-gold) 68%, transparent) 0deg 1.05deg,
        transparent 1.05deg 7.4deg
      );
    mask-image: radial-gradient(ellipse 56% 70% at 50% 100%, black 6%, transparent 74%);
    -webkit-mask-image: radial-gradient(ellipse 56% 70% at 50% 100%, black 6%, transparent 74%);
    pointer-events: none;
    z-index: 0;
  }
  [data-era="deco"] .ew-hero__panel {
    position: relative;
    z-index: 2;
    width: min(860px, 100%);
    padding: 48px 44px 40px;
    text-align: center;
    border: 1px solid var(--ew-color-gold);
    background-color: color-mix(in srgb, var(--ew-color-bg-surface) 94%, var(--ew-color-bg-page));
    background-image: var(--ew-deco-corners);
    background-repeat: no-repeat;
    background-size: var(--ew-deco-corner-size);
    background-position: var(--ew-deco-corner-pos);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--ew-color-champagne, #E6D4AE) 32%, transparent),
      0 8px 0 0 color-mix(in srgb, var(--ew-color-brassDeep) 50%, transparent);
  }
  [data-era="deco"] .ew-hero__panel::before { content: none; }
  [data-era="deco"] .ew-hero__panel::after {
    content: "" / "";
    display: var(--ew-deco-costume);
    position: absolute;
    inset: 11px;
    border: 1px solid color-mix(in srgb, var(--ew-color-gold) 58%, transparent);
    pointer-events: none;
    z-index: 1;
  }
  [data-era="deco"] .ew-hero__rays {
    display: var(--ew-deco-costume);
    position: absolute;
    inset: 8% 10% 64%;
    background: repeating-linear-gradient(
      90deg,
      transparent 0 14px,
      color-mix(in oklch, var(--ew-color-gold) 34%, transparent) 14px 15px
    );
    mask-image: linear-gradient(180deg, transparent, black 22%, black 68%, transparent);
    -webkit-mask-image: linear-gradient(180deg, transparent, black 22%, black 68%, transparent);
    pointer-events: none;
    z-index: 0;
    opacity: 0.55;
  }
  @media (prefers-reduced-motion: no-preference) {
    [data-era="deco"] .ew-hero__rays { animation: ew-deco-rays 18s linear infinite; }
  }
  @keyframes ew-deco-rays {
    from { transform: translateX(0); }
    to { transform: translateX(-16px); }
  }
  [data-era="deco"] .ew-hero__fan {
    display: var(--ew-deco-costume);
    width: 132px;
    height: 62px;
    margin: 0 auto 22px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
    pointer-events: none;
  }
  [data-era="deco"] .ew-hero__content { position: relative; z-index: 2; }
  [data-era="deco"] .ew-hero__title,
  [data-era="deco"] .ew-hero h1 {
    font-family: var(--ew-font-display);
    font-size: clamp(34px, 7.4vw, 84px);
    line-height: 1.02;
    margin: 0 0 16px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.035em;
    text-wrap: balance;
    display: block;
    padding: 0;
    color: var(--ew-color-goldText, var(--ew-color-gold));
    background: none;
    box-shadow: none;
    -webkit-text-fill-color: currentColor;
  }
  [data-era="deco"] .ew-hero__subtitle {
    font-family: var(--ew-font-body);
    font-size: 15px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    line-height: 1.5;
    margin: 0 0 32px;
    font-weight: 500;
    text-wrap: balance;
    color: var(--ew-color-fg-muted);
  }
  [data-era="deco"] .ew-hero__cta {
    display: inline-flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }

  [data-era="deco"] .ew-section-heading {
    position: relative;
    display: block;
    font-family: var(--ew-font-display);
    font-size: clamp(26px, 4vw, 44px);
    font-weight: 400;
    text-align: center;
    text-transform: uppercase;
    text-wrap: balance;
    letter-spacing: 0.05em;
    line-height: 1.15;
    margin: 0 auto 40px;
    padding-inline: clamp(44px, 12vw, 112px);
    max-width: 20em;
  }
  [data-era="deco"] .ew-section-heading::before,
  [data-era="deco"] .ew-section-heading::after {
    content: "" / "";
    display: var(--ew-deco-rule);
    position: absolute;
    top: 50%;
    width: min(84px, 12vw);
    height: 9px;
    transform: translateY(-50%);
    pointer-events: none;
    background:
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) 0 1px / 100% 1px no-repeat,
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) 0 6px / 100% 1px no-repeat;
  }
  [data-era="deco"] .ew-section-heading::before { left: 0; }
  [data-era="deco"] .ew-section-heading::after { right: 0; }

  [data-era="deco"] .ew-tier-card {
    position: relative;
    text-align: center;
    padding: 32px 20px 22px;
    border: 1px solid var(--ew-color-gold);
    background-color: var(--ew-color-bg-surface);
    background-image: var(--ew-deco-corners);
    background-repeat: no-repeat;
    background-size: var(--ew-deco-corner-size);
    background-position: var(--ew-deco-corner-pos);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--ew-color-champagne, #E6D4AE) 26%, transparent),
      0 4px 0 0 color-mix(in srgb, var(--ew-color-brassDeep) 45%, transparent);
  }
  [data-era="deco"] .ew-tier-card::after { content: none; }
  [data-era="deco"] .ew-tier-card::before {
    content: "" / "";
    display: var(--ew-deco-rule);
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 58%;
    height: 7px;
    pointer-events: none;
    background:
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 0 / 100% 1px no-repeat,
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 5px / 70% 1px no-repeat;
  }
  [data-era="deco"] .ew-tier-card__price {
    font-family: var(--ew-font-display);
    font-size: clamp(34px, 5vw, 52px);
    line-height: 1;
    letter-spacing: 0.02em;
    margin: 8px 0;
    color: var(--ew-color-goldText, var(--ew-color-gold));
    background: none;
    -webkit-text-fill-color: currentColor;
  }
  [data-era="deco"][data-mode="dark"] .ew-tier-card__price {
    background-image: var(--ew-gradient-metal-dark);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #E4C97A;
  }

  [data-era="deco"] .ew-card {
    position: relative;
    clip-path: none;
    overflow: visible;
    min-width: 0;
    max-width: 100%;
    border: 1px solid var(--ew-color-gold);
    background-color: var(--ew-color-bg-surface);
    background-image: var(--ew-deco-corners);
    background-repeat: no-repeat;
    background-size: var(--ew-deco-corner-size);
    background-position: var(--ew-deco-corner-pos);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--ew-color-champagne, #E6D4AE) 24%, transparent),
      0 4px 0 0 color-mix(in srgb, var(--ew-color-brassDeep) 46%, transparent);
    padding: 22px;
  }
  [data-era="deco"] .ew-card[data-variant="raised"] {
    background-color: var(--ew-color-bg-elevated);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, var(--ew-color-champagne, #E6D4AE) 30%, transparent),
      0 6px 0 0 color-mix(in srgb, var(--ew-color-brassDeep) 58%, transparent);
  }
  [data-era="deco"] .ew-card[data-variant="flat"],
  [data-era="deco"] .ew-card[data-variant="outline"] { box-shadow: none; }
  [data-era="deco"] .ew-card::before {
    content: "" / "";
    display: var(--ew-deco-costume);
    position: absolute;
    inset: 8px;
    width: auto;
    height: auto;
    border: 1px solid color-mix(in srgb, var(--ew-color-gold) 55%, transparent);
    background: transparent !important;
    opacity: 1;
    transform: none;
    mask: none;
    -webkit-mask: none;
    mix-blend-mode: normal;
    pointer-events: none;
    z-index: 0;
  }
  [data-era="deco"] .ew-card::after { content: none; }
  [data-era="deco"] .ew-card__header,
  [data-era="deco"] .ew-card__body,
  [data-era="deco"] .ew-card__footer { position: relative; z-index: 1; }
  [data-era="deco"] .ew-card__header { padding-top: 2px; }
  [data-era="deco"] .ew-card__header h2,
  [data-era="deco"] .ew-card__header h3 {
    font-family: var(--ew-font-body);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.12em;
    line-height: 1.35;
    text-transform: uppercase;
    text-wrap: balance;
    color: var(--ew-color-fg-default);
  }
  [data-era="deco"] .ew-card__body {
    font-size: 15.5px;
    line-height: 1.65;
    letter-spacing: 0.005em;
  }
  [data-era="deco"] .ew-card__header::after {
    content: "" / "";
    display: var(--ew-deco-rule);
    height: 7px;
    width: 72px;
    margin: 12px auto 0;
    pointer-events: none;
    background:
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 0 / 100% 1px no-repeat,
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 5px / 64% 1px no-repeat;
  }

  [data-era="deco"] .ew-ornament-divider {
    display: var(--ew-deco-rule);
    height: 28px;
    margin: 40px auto;
    max-width: 680px;
    position: relative;
    border: 0;
    background:
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 11px / 100% 1px no-repeat,
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 16px / 100% 1px no-repeat;
    opacity: 1;
  }
  [data-era="deco"] .ew-ornament-divider::before {
    content: "" / "";
    display: var(--ew-deco-costume);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-diamond) center / contain no-repeat;
    mask: var(--ew-ornament-diamond) center / contain no-repeat;
    box-shadow: 0 0 0 8px var(--ew-color-bg-page);
    pointer-events: none;
  }

  [data-era="deco"] .ew-button {
    text-transform: uppercase;
    letter-spacing: 0.11em;
    font-weight: 600;
    font-family: var(--ew-font-body);
    clip-path: none;
    border-style: solid;
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, #F3E7C9 32%, transparent),
      0 2px 0 0 var(--ew-color-brassDeep);
  }
  [data-era="deco"] .ew-button:not([data-variant="secondary"]):not([data-variant="ghost"]):not([data-variant="danger"]) {
    background-image: var(--ew-deco-btn);
    color: var(--ew-deco-btn-fg, var(--ew-color-action-fg));
    border-color: var(--ew-deco-btn-border, var(--ew-color-brassDeep));
  }
  [data-era="deco"] .ew-button:hover:not(:disabled):not([data-variant="secondary"]):not([data-variant="ghost"]):not([data-variant="danger"]) {
    background-image: var(--ew-deco-btn-hover, var(--ew-deco-btn));
  }
  [data-era="deco"] .ew-button:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: inset 0 1px 0 color-mix(in srgb, #F3E7C9 18%, transparent);
  }
  [data-era="deco"] .ew-button:disabled {
    opacity: 0.42;
    box-shadow: none;
    transform: none;
    cursor: not-allowed;
  }
  [data-era="deco"] .ew-button[data-size="sm"] { letter-spacing: 0.08em; font-weight: 600; }
  [data-era="deco"] .ew-button[data-variant="secondary"] {
    background: transparent;
    background-image: none;
    color: var(--ew-color-fg-default);
    border-width: 1px;
    border-style: solid;
    border-color: var(--ew-color-gold);
    box-shadow: none;
  }
  [data-era="deco"] .ew-button[data-variant="secondary"]:hover:not(:disabled) {
    background: color-mix(in srgb, var(--ew-color-gold) 10%, transparent);
  }
  [data-era="deco"] .ew-button[data-variant="ghost"] {
    background: transparent;
    background-image: none;
    border-color: transparent;
    box-shadow: none;
    letter-spacing: 0.08em;
    color: var(--ew-color-fg-default);
  }
  [data-era="deco"] .ew-button[data-variant="ghost"]:hover:not(:disabled) {
    color: var(--ew-color-goldText, var(--ew-color-gold));
  }
  [data-era="deco"] .ew-button[data-variant="danger"] {
    background-image: none;
    border-color: var(--ew-color-danger-bg);
    box-shadow: 0 2px 0 0 color-mix(in srgb, black 40%, var(--ew-color-danger-bg));
  }

  [data-era="deco"] .ew-text-field__label,
  [data-era="deco"] .ew-textarea__label,
  [data-era="deco"] .ew-select__label,
  [data-era="deco"] .ew-slider__label {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 13px;
    font-weight: 600;
    font-variant-caps: normal;
    font-family: var(--ew-font-body);
    color: var(--ew-color-fg-default);
  }
  [data-era="deco"] .ew-text-field__control,
  [data-era="deco"] .ew-select__control,
  [data-era="deco"] .ew-select__trigger,
  [data-era="deco"] .ew-textarea__control {
    border-radius: var(--ew-structure-field-radius, 0px);
    border-top: 1px solid color-mix(in srgb, var(--ew-color-gold) 28%, transparent);
    border-left: 1px solid color-mix(in srgb, var(--ew-color-gold) 28%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--ew-color-gold) 28%, transparent);
    border-bottom: 2px solid var(--ew-color-goldBorder, var(--ew-color-gold));
    background: var(--ew-color-field-bg);
    font-size: 16px;
    line-height: 1.4;
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--ew-color-gold) 16%, transparent);
  }
  [data-era="deco"] .ew-text-field__control,
  [data-era="deco"] .ew-select__control,
  [data-era="deco"] .ew-select__trigger { min-height: 44px; }
  [data-era="deco"] .ew-text-field__control::placeholder,
  [data-era="deco"] .ew-textarea__control::placeholder {
    color: color-mix(in srgb, var(--ew-color-fg-muted) 80%, transparent);
  }
  [data-era="deco"] .ew-text-field[data-invalid="true"] .ew-text-field__control,
  [data-era="deco"] .ew-textarea[data-invalid="true"] .ew-textarea__control,
  [data-era="deco"] .ew-select[data-invalid="true"] .ew-select__control {
    border-bottom-color: var(--ew-color-danger-bg);
  }

  [data-era="deco"] .ew-checkbox,
  [data-era="deco"] .ew-switch,
  [data-era="deco"] .ew-radio { align-items: center; min-height: 28px; }
  [data-era="deco"] .ew-checkbox__box {
    width: 18px;
    height: 18px;
    border-style: solid;
    border-width: 1.5px;
    border-color: var(--ew-color-goldBorder, var(--ew-color-gold));
    border-radius: 0;
  }
  [data-era="deco"] .ew-switch__track,
  [data-era="deco"] .ew-switch__thumb { border-radius: 0; }
  [data-era="deco"] .ew-switch__track { border: 1.5px solid var(--ew-color-goldBorder, var(--ew-color-border-strong)); }
  [data-era="deco"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-goldBorder, var(--ew-color-border-strong));
  }
  [data-era="deco"] .ew-switch__control:checked + .ew-switch__track {
    background: var(--ew-color-track-on, var(--ew-color-action-bg));
    border-color: var(--ew-color-goldBorder, var(--ew-color-border-strong));
  }
  [data-era="deco"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-action-fg, #0C0B09);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--ew-color-fg-default) 25%, transparent);
  }
  [data-era="deco"] .ew-radio__disc {
    border-color: var(--ew-color-goldBorder, var(--ew-color-border-strong));
    border-width: 1.5px;
  }

  [data-era="deco"] .ew-dialog {
    clip-path: none;
    position: relative;
    border: 1px solid var(--ew-color-gold);
    background-color: var(--ew-color-bg-elevated);
    background-image: var(--ew-deco-corners);
    background-repeat: no-repeat;
    background-size: var(--ew-deco-corner-size);
    background-position: var(--ew-deco-corner-pos);
    box-shadow: 0 8px 0 0 color-mix(in srgb, var(--ew-color-brassDeep) 48%, transparent);
    padding: 36px 24px 22px;
  }
  [data-era="deco"] .ew-dialog::before {
    content: "" / "";
    display: var(--ew-deco-costume);
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 72px;
    height: 7px;
    pointer-events: none;
    background:
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 0 / 100% 1px no-repeat,
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 5px / 62% 1px no-repeat;
    z-index: 2;
  }
  [data-era="deco"] .ew-dialog::after { content: none; }
  [data-era="deco"] .ew-dialog h2,
  [data-era="deco"] .ew-dialog__header h2 {
    font-family: var(--ew-font-body);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    line-height: 1.3;
    text-wrap: balance;
    margin-top: 4px;
    position: relative;
    z-index: 2;
  }
  [data-era="deco"] .ew-dialog__footer { position: relative; z-index: 2; }

  [data-era="deco"] .ew-tabs [role="tablist"],
  [data-era="deco"] ew-tabs [role="tablist"] {
    border-bottom: 1px solid var(--ew-color-gold);
    gap: 0;
  }
  [data-era="deco"] .ew-tabs [role="tab"],
  [data-era="deco"] ew-tabs [role="tab"] {
    font-family: var(--ew-font-body);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid transparent;
    border-bottom: 0;
    margin-bottom: -1px;
    border-radius: 0;
    background: transparent;
    color: var(--ew-color-fg-muted);
    padding: 10px 16px;
  }
  [data-era="deco"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="deco"] ew-tabs [role="tab"][aria-selected="true"] {
    clip-path: none;
    background: var(--ew-color-bg-surface);
    color: var(--ew-color-fg-default);
    border-color: var(--ew-color-gold);
    box-shadow: inset 0 -2px 0 var(--ew-color-gold);
  }

  [data-era="deco"] .ew-alert {
    border-radius: 0;
    border: 1px solid var(--ew-color-gold);
    border-left-width: 3px;
    border-left-style: solid;
    background-color: var(--ew-color-bg-surface);
    background-image: var(--ew-deco-sheen);
    box-shadow: none;
  }
  [data-era="deco"] .ew-alert__title {
    font-family: var(--ew-font-body);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 14px;
  }
  [data-era="deco"] .ew-toast {
    border-radius: 0;
    border: 1px solid var(--ew-color-gold);
    background: var(--ew-color-bg-elevated);
  }
  [data-era="deco"] .ew-toast::before {
    content: "" / "";
    display: var(--ew-deco-costume);
    height: 6px;
    margin: 0 0 10px;
    pointer-events: none;
    background:
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 0 / 100% 1px no-repeat,
      linear-gradient(var(--ew-color-gold), var(--ew-color-gold)) center 4px / 100% 1px no-repeat;
  }
  [data-era="deco"] .ew-tooltip__tip {
    border-radius: 0;
    border: 1px solid var(--ew-color-gold);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 13px;
    font-family: var(--ew-font-body);
  }
  [data-era="deco"] .ew-link:not([data-variant="nav"]) {
    color: var(--ew-color-goldText, var(--ew-color-gold));
    text-underline-offset: 0.22em;
    text-decoration-thickness: 1px;
  }
  [data-era="deco"] .ew-link[data-variant="nav"] {
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    color: var(--ew-color-fg-default);
  }
  [data-era="deco"] .ew-link[data-variant="nav"][aria-current="page"] {
    box-shadow: inset 0 -1px 0 var(--ew-color-gold), inset 0 -5px 0 color-mix(in srgb, var(--ew-color-gold) 40%, transparent);
  }
  [data-era="deco"] .ew-breadcrumb {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 13px;
  }
  [data-era="deco"] .ew-breadcrumb__sep { color: var(--ew-color-gold); }
  [data-era="deco"] .ew-avatar { border-color: var(--ew-color-gold); border-radius: 0; }
  [data-era="deco"] table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--ew-font-body);
    font-size: 15px;
    line-height: 1.45;
  }
  [data-era="deco"] th {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid var(--ew-color-gold);
    color: var(--ew-color-fg-default);
  }
  [data-era="deco"] td {
    padding: 12px;
    border-bottom: 1px solid color-mix(in srgb, var(--ew-color-gold) 30%, transparent);
    vertical-align: baseline;
  }
  [data-era="deco"] .ew-select__option,
  [data-era="deco"] .ew-menu__item { border-radius: 0; }
  [data-era="deco"] .ew-select__option[aria-selected="true"],
  [data-era="deco"] .ew-select__option.is-active,
  [data-era="deco"] .ew-select__option:hover,
  [data-era="deco"] .ew-select__option:focus,
  [data-era="deco"] .ew-menu__item:hover,
  [data-era="deco"] .ew-menu__item:focus-visible {
    background: color-mix(in oklch, var(--ew-color-gold) 22%, var(--ew-color-bg-elevated));
    outline: 1px solid var(--ew-color-gold);
    outline-offset: -1px;
  }
  [data-era="deco"] .ew-select__list,
  [data-era="deco"] .ew-menu__panel {
    border-radius: 0;
    border: 1px solid var(--ew-color-gold);
  }

  [data-era="deco"][data-dialect="streamline"] {
    --ew-deco-corners: var(--ew-deco-sheen);
    --ew-deco-corner-size: auto;
    --ew-deco-corner-pos: 0 0;
    --ew-structure-control-radius: 999px;
    --ew-structure-surface-radius: 18px;
    --ew-structure-field-radius: 12px;
    --ew-structure-dialog-radius: 20px;
    --ew-structure-tooltip-radius: 12px;
    --ew-structure-switch-track-radius: 999px;
    --ew-structure-switch-thumb-radius: 999px;
  }
  [data-era="deco"][data-dialect="streamline"] .ew-hero__backdrop {
    left: 0;
    top: 8%;
    bottom: auto;
    width: 100%;
    height: 34%;
    transform: none;
    background: repeating-linear-gradient(
      180deg,
      transparent 0 15px,
      color-mix(in oklch, var(--ew-color-gold) 58%, transparent) 15px 16px
    );
    mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
  }
  [data-era="deco"][data-dialect="streamline"] .ew-hero__fan {
    width: 176px;
    height: 36px;
    -webkit-mask: var(--ew-ornament-wing) center / contain no-repeat;
    mask: var(--ew-ornament-wing) center / contain no-repeat;
  }
  [data-era="deco"][data-dialect="streamline"] .ew-hero__panel,
  [data-era="deco"][data-dialect="streamline"] .ew-card,
  [data-era="deco"][data-dialect="streamline"] .ew-tier-card,
  [data-era="deco"][data-dialect="streamline"] .ew-dialog,
  [data-era="deco"][data-dialect="streamline"] .ew-alert,
  [data-era="deco"][data-dialect="streamline"] .ew-toast,
  [data-era="deco"][data-dialect="streamline"] .ew-tooltip__tip {
    border-radius: 18px;
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, white 22%, transparent),
      0 10px 24px color-mix(in srgb, black 16%, transparent);
  }
  [data-era="deco"][data-dialect="streamline"] .ew-hero__panel::after,
  [data-era="deco"][data-dialect="streamline"] .ew-card::before { border-radius: 12px; }
  [data-era="deco"][data-dialect="streamline"] .ew-button {
    border-radius: 999px;
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, white 36%, transparent),
      0 1px 0 color-mix(in srgb, black 28%, transparent);
  }
  [data-era="deco"][data-dialect="streamline"] .ew-text-field__control,
  [data-era="deco"][data-dialect="streamline"] .ew-textarea__control,
  [data-era="deco"][data-dialect="streamline"] .ew-select__control,
  [data-era="deco"][data-dialect="streamline"] .ew-select__trigger {
    border: 1px solid var(--ew-color-goldBorder, var(--ew-color-gold));
    border-radius: 12px;
    box-shadow: inset 0 1px 2px color-mix(in srgb, black 10%, transparent);
  }
  [data-era="deco"][data-dialect="streamline"] .ew-switch__track,
  [data-era="deco"][data-dialect="streamline"] .ew-switch__thumb { border-radius: 999px; }
  [data-era="deco"][data-dialect="streamline"] .ew-checkbox__box { border-radius: 4px; }
  [data-era="deco"][data-dialect="streamline"] .ew-tabs [role="tab"],
  [data-era="deco"][data-dialect="streamline"] ew-tabs [role="tab"] { border-radius: 999px 999px 0 0; }

  ${whisper()} {
    --ew-deco-corners: var(--ew-deco-sheen);
    --ew-deco-corner-size: auto;
    --ew-deco-corner-pos: 0 0;
    --ew-deco-btn: none;
    --ew-deco-btn-hover: none;
  }
  ${whisper(' .ew-section-heading')} { padding-inline: 0; }
  ${whisper(' .ew-card')},
  ${whisper(' .ew-hero__panel')},
  ${whisper(' .ew-tier-card')},
  ${whisper(' .ew-dialog')},
  ${whisper(' .ew-alert')},
  ${whisper(' .ew-toast')} {
    box-shadow: none;
    border-width: 1px;
  }
  ${whisper(' .ew-button')} {
    box-shadow: none;
    background-image: none;
  }

  @media (max-width: 640px) {
    [data-era="deco"] .ew-hero { min-height: 0; padding: 28px 14px 36px; }
    [data-era="deco"] .ew-hero__panel { padding: 28px 16px 22px; }
    [data-era="deco"] .ew-hero__panel::after { inset: 8px; }
    [data-era="deco"] .ew-hero__title,
    [data-era="deco"] .ew-hero h1 {
      font-size: clamp(30px, 11vw, 46px);
      letter-spacing: 0.02em;
    }
    [data-era="deco"] .ew-hero__subtitle { letter-spacing: 0.12em; font-size: 13px; }
    [data-era="deco"] .ew-hero__fan { width: 104px; height: 48px; margin-bottom: 14px; }
    [data-era="deco"][data-dialect="streamline"] .ew-hero__fan { width: 136px; height: 30px; }
    [data-era="deco"] .ew-section-heading {
      font-size: clamp(22px, 7vw, 32px);
      letter-spacing: 0.035em;
      padding-inline: 36px;
    }
    [data-era="deco"] .ew-section-heading::before,
    [data-era="deco"] .ew-section-heading::after { width: 26px; }
    [data-era="deco"] .ew-button { letter-spacing: 0.08em; }
    [data-era="deco"] .ew-card { padding: 16px; }
    [data-era="deco"] .ew-card__header h2,
    [data-era="deco"] .ew-card__header h3 { letter-spacing: 0.08em; }
    [data-era="deco"] .ew-tabs [role="tab"],
    [data-era="deco"] ew-tabs [role="tab"] {
      letter-spacing: 0.06em;
      font-size: 13px;
      padding: 8px 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-era="deco"] .ew-hero__rays { animation: none !important; }
  }

  @media (forced-colors: active) {
    [data-era="deco"] .ew-hero__backdrop,
    [data-era="deco"] .ew-hero__rays,
    [data-era="deco"] .ew-hero__fan,
    [data-era="deco"] .ew-hero__panel::after,
    [data-era="deco"] .ew-card::before,
    [data-era="deco"] .ew-ornament-divider::before,
    [data-era="deco"] .ew-dialog::before,
    [data-era="deco"] .ew-toast::before,
    [data-era="deco"] .ew-section-heading::before,
    [data-era="deco"] .ew-section-heading::after,
    [data-era="deco"] .ew-card__header::after,
    [data-era="deco"] .ew-tier-card::before { display: none; }
  }
`;
}
