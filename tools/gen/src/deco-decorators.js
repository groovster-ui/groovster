import { muteBandSel } from './band.js';

/**
 * Stepped-frame SVG for border-image (100×100, 28px corners).
 * Gold is baked into the SVG (border-image cannot use CSS color); light/dark variants.
 * Corners stay fixed size; mid edges stretch as straight rules — content stays in padding box.
 */
/** Stepped corner tiles (28×28) — TL/TR/BL/BR; edges use solid double border. */
function stepCornerSvg(stroke, corner = 'tl') {
  const transforms = {
    tl: '',
    tr: 'transform="translate(28 0) scale(-1 1)"',
    bl: 'transform="translate(0 28) scale(1 -1)"',
    br: 'transform="translate(28 28) scale(-1 -1)"',
  };
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <g ${transforms[corner]}>
        <path fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="miter"
          d="M2 28 V16 H8 V8 H16 V2 H28"/>
        <path fill="none" stroke="${stroke}" stroke-width="1.25" stroke-linejoin="miter" opacity="0.85"
          d="M6 28 V18 H12 V12 H18 V6 H28"/>
      </g>
    </svg>`
  );
}
function stepCorners(stroke) {
  return {
    tl: `url("data:image/svg+xml,${stepCornerSvg(stroke, 'tl')}")`,
    tr: `url("data:image/svg+xml,${stepCornerSvg(stroke, 'tr')}")`,
    bl: `url("data:image/svg+xml,${stepCornerSvg(stroke, 'bl')}")`,
    br: `url("data:image/svg+xml,${stepCornerSvg(stroke, 'br')}")`,
  };
}
/* Pass raw hex — stepCornerSvg encodeURIComponent once; pre-encoded %23 becomes stroke="%23…" (invalid). */
const STEP_LIGHT = stepCorners('#B08D2C');
const STEP_DARK = stepCorners('#D4AF37');

/**
 * Full Deco decorator layer CSS.
 * Costume ornament is ON by default; whisper/default mute via muteBandSel.
 */
export function decoDecoratorCss() {
  const mute = (rest) => muteBandSel('deco', rest);

  return `  /* === DECO: ART DECO — costume default; mute via whisper|default on self/ancestor === */

  [data-era="deco"] {
    --ew-font-display: "Limelight", "Bodoni Moda", serif;
    --ew-font-body: "Jost", "Futura", sans-serif;
    --ew-font-mono: "IBM Plex Mono", ui-monospace, monospace;
    --ew-gradient-metal-light: linear-gradient(180deg, #E5C166 0%, #B08D2C 38%, #7A5C12 62%, #D4AE2E 100%);
    --ew-gradient-metal-dark: linear-gradient(180deg, #F6E27A 0%, #D4AF37 38%, #9C7A22 62%, #E9CD6B 100%);
    --ew-gradient-metal: var(--ew-gradient-metal-light);
    --ew-ornament-fan: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 56'%3E%3Cpath d='M8 52 L60 4 L112 52 M18 52 L60 14 L102 52 M28 52 L60 22 L92 52 M38 52 L60 30 L82 52 M48 52 L60 38 L72 52' stroke='%23000' stroke-width='2.4' fill='none'/%3E%3Ccircle cx='60' cy='52' r='4' fill='%23000'/%3E%3C/svg%3E");
    --ew-deco-step-tl: ${STEP_LIGHT.tl};
    --ew-deco-step-tr: ${STEP_LIGHT.tr};
    --ew-deco-step-bl: ${STEP_LIGHT.bl};
    --ew-deco-step-br: ${STEP_LIGHT.br};
    --ew-deco-step-width: 3px;
    --ew-deco-step-clip: none;
    --ew-deco-step-clip-sm: none;
  }
  [data-era="deco"][data-mode="dark"] {
    --ew-gradient-metal: var(--ew-gradient-metal-dark);
    --ew-deco-step-tl: ${STEP_DARK.tl};
    --ew-deco-step-tr: ${STEP_DARK.tr};
    --ew-deco-step-bl: ${STEP_DARK.bl};
    --ew-deco-step-br: ${STEP_DARK.br};
  }

  /* --- Library: hero panel (sunburst is hero-only, not fixed page layer) --- */
  [data-era="deco"] .ew-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-height: min(88vh, 920px);
    display: grid;
    place-items: center;
    padding: 64px 24px 80px;
  }
  [data-era="deco"] .ew-hero__backdrop {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: min(1400px, 180%);
    height: min(720px, 95%);
    transform: translateX(-50%);
    background:
      repeating-conic-gradient(
        from -90deg at 50% 100%,
        color-mix(in oklch, var(--ew-color-gold) 78%, transparent) 0deg 4.5deg,
        transparent 4.5deg 11deg
      );
    mask-image: radial-gradient(ellipse 62% 70% at 50% 100%, black 12%, transparent 78%);
    -webkit-mask-image: radial-gradient(ellipse 62% 70% at 50% 100%, black 12%, transparent 78%);
    pointer-events: none;
    z-index: 0;
    opacity: 1;
  }
  [data-era="deco"] .ew-hero__panel {
    position: relative;
    z-index: 2;
    width: min(920px, 100%);
    padding: 56px 48px 48px;
    text-align: center;
    border: 4px double var(--ew-color-gold);
    /* Fixed-size stepped corners + straight gold edges (constant line width) */
    background-color: color-mix(in srgb, var(--ew-color-panel) 92%, transparent);
    background-image:
      var(--ew-deco-step-tl),
      var(--ew-deco-step-tr),
      var(--ew-deco-step-bl),
      var(--ew-deco-step-br);
    background-size: 28px 28px;
    background-position: left 6px top 6px, right 6px top 6px, left 6px bottom 6px, right 6px bottom 6px;
    background-repeat: no-repeat;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--ew-color-gold) 65%, transparent),
      0 10px 0 0 var(--ew-color-gold);
  }
  [data-era="deco"] .ew-hero__panel::before {
    content: none;
  }
  [data-era="deco"] .ew-hero__panel::after {
    content: "" / "";
    position: absolute;
    inset: 14px;
    border: 2px double color-mix(in srgb, var(--ew-color-gold) 75%, transparent);
    pointer-events: none;
    z-index: 1;
  }
  [data-era="deco"] .ew-hero__rays {
    position: absolute;
    inset: 6% 4% 24%;
    background: repeating-linear-gradient(
      90deg,
      transparent 0 10px,
      color-mix(in oklch, var(--ew-color-gold) 42%, transparent) 10px 12px
    );
    mask-image: linear-gradient(180deg, transparent, black 18%, black 75%, transparent);
    -webkit-mask-image: linear-gradient(180deg, transparent, black 18%, black 75%, transparent);
    pointer-events: none;
    z-index: 0;
    opacity: 0.85;
  }
  @media (prefers-reduced-motion: no-preference) {
    [data-era="deco"] .ew-hero__rays {
      animation: ew-deco-rays 14s linear infinite;
    }
  }
  @keyframes ew-deco-rays {
    from { transform: translateX(0); }
    to { transform: translateX(-15px); }
  }
  [data-era="deco"] .ew-hero__fan {
    width: 148px;
    height: 68px;
    margin: 0 auto 28px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
  }
  [data-era="deco"] .ew-hero__content {
    position: relative;
    z-index: 2;
  }
  /* Title plate: solid page fill behind gold type so rays never steal contrast */
  [data-era="deco"] .ew-hero__title,
  [data-era="deco"] .ew-hero h1 {
    font-family: var(--ew-font-display);
    font-size: clamp(52px, 9vw, 104px);
    line-height: 1.05;
    margin: 0 0 20px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: inline-block;
    padding: 0.14em 0.4em;
    color: var(--ew-color-goldText, var(--ew-color-gold));
    background: var(--ew-color-bg-page);
    box-shadow: 0 0 0 10px var(--ew-color-bg-page);
    -webkit-text-fill-color: unset;
  }
  [data-era="deco"][data-mode="dark"] .ew-hero__title,
  [data-era="deco"][data-mode="dark"] .ew-hero h1 {
    color: var(--ew-color-gold);
  }
  [data-era="deco"] .ew-hero__subtitle {
    font-size: 18px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    margin: 0 0 40px;
    font-weight: 600;
    color: var(--ew-color-fg-muted);
  }
  [data-era="deco"] .ew-hero__cta {
    display: inline-flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Section heading with flanking chevrons (opt-in class) */
  [data-era="deco"] .ew-section-heading {
    font-family: var(--ew-font-display);
    font-size: clamp(28px, 4.5vw, 48px);
    text-align: center;
    margin: 0 0 48px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  [data-era="deco"] .ew-section-heading::before,
  [data-era="deco"] .ew-section-heading::after {
    content: "" / "";
    width: 72px;
    height: 18px;
    background:
      repeating-linear-gradient(-45deg, var(--ew-color-gold) 0 6px, transparent 6px 12px),
      repeating-linear-gradient(45deg, var(--ew-color-gold) 0 6px, transparent 6px 12px);
    background-size: 100% 50%;
    background-position: 0 0, 0 100%;
    background-repeat: repeat-x;
    flex: none;
    opacity: 0.9;
  }

  /* Tier / pricing cards with stepped tops */
  [data-era="deco"] .ew-tier-card {
    position: relative;
    text-align: center;
    padding: 36px 24px 28px;
    border: 3px double var(--ew-color-gold);
    background-color: var(--ew-color-bg-surface);
    background-image:
      var(--ew-deco-step-tl),
      var(--ew-deco-step-tr),
      var(--ew-deco-step-bl),
      var(--ew-deco-step-br);
    background-size: 24px 24px;
    background-position: left 4px top 4px, right 4px top 4px, left 4px bottom 4px, right 4px bottom 4px;
    background-repeat: no-repeat;
  }
  [data-era="deco"] .ew-tier-card::after {
    content: none;
  }
  [data-era="deco"] .ew-tier-card::before {
    content: "" / "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 72%;
    height: 14px;
    background:
      linear-gradient(90deg, transparent 0 8%, var(--ew-color-gold) 8% 92%, transparent 92%),
      linear-gradient(90deg, transparent 0 18%, var(--ew-color-gold) 18% 82%, transparent 82%);
    background-size: 100% 4px, 100% 4px;
    background-position: center 0, center 6px;
    background-repeat: no-repeat;
  }
  [data-era="deco"] .ew-tier-card__price {
    font-family: var(--ew-font-display);
    font-size: clamp(36px, 5vw, 56px);
    margin: 0 0 8px;
    background: var(--ew-gradient-metal);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: var(--ew-color-gold);
  }

  /* --- Cards: straight gold edges + fixed-size stepped corner tiles --- */
  [data-era="deco"] .ew-card {
    position: relative;
    clip-path: none;
    background-color: var(--ew-color-bg-surface);
    border: 4px double var(--ew-color-gold);
    background-image:
      var(--ew-deco-step-tl),
      var(--ew-deco-step-tr),
      var(--ew-deco-step-bl),
      var(--ew-deco-step-br);
    background-size: 28px 28px;
    background-position: left 6px top 6px, right 6px top 6px, left 6px bottom 6px, right 6px bottom 6px;
    background-repeat: no-repeat;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--ew-color-gold) 70%, transparent),
      0 6px 0 0 var(--ew-color-border-strong),
      0 12px 0 0 color-mix(in srgb, var(--ew-color-fg-default) 22%, transparent);
    overflow: visible;
    padding: 16px 20px 20px;
  }
  [data-era="deco"] .ew-card[data-variant="raised"] {
    background-color: var(--ew-color-bg-elevated);
  }
  [data-era="deco"] .ew-card::before {
    content: "" / "";
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 56px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
    opacity: 1;
    z-index: 2;
    pointer-events: none;
  }
  [data-era="deco"] .ew-card::after {
    content: none;
  }
  [data-era="deco"] .ew-card__header {
    padding-top: 56px;
  }
  [data-era="deco"] .ew-card__header,
  [data-era="deco"] .ew-card__body,
  [data-era="deco"] .ew-card__footer {
    position: relative;
    z-index: 2;
  }
  [data-era="deco"] .ew-card__header h2,
  [data-era="deco"] .ew-card__header h3 {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 600;
    color: var(--ew-color-fg-default);
  }
  [data-era="deco"] .ew-card__header::after {
    content: "" / "";
    display: block;
    height: 14px;
    margin: 16px auto 0;
    width: 160px;
    background:
      repeating-linear-gradient(-45deg, var(--ew-color-gold) 0 8px, transparent 8px 16px),
      repeating-linear-gradient(45deg, var(--ew-color-gold) 0 8px, transparent 8px 16px);
    background-size: 100% 50%;
    background-position: 0 0, 0 100%;
    background-repeat: repeat-x;
    opacity: 0.9;
  }

  /* Mute costume ornament under whisper/default */
  ${mute(' .ew-hero__backdrop')},
  ${mute(' .ew-hero__rays')},
  ${mute(' .ew-hero__fan')},
  ${mute(' .ew-hero__panel::before')},
  ${mute(' .ew-hero__panel::after')},
  ${mute(' .ew-section-heading::before')},
  ${mute(' .ew-section-heading::after')},
  ${mute(' .ew-tier-card::before')},
  ${mute(' .ew-tier-card::after')},
  ${mute(' .ew-card::before')},
  ${mute(' .ew-card::after')},
  ${mute(' .ew-card__header::after')},
  ${mute(' .ew-ornament-divider')},
  ${mute(' .ew-ornament-divider::before')},
  ${mute(' .ew-dialog::before')},
  ${mute(' .ew-dialog::after')},
  ${mute(' .ew-toast::before')} {
    display: none !important;
  }
  ${mute(' .ew-hero__panel')},
  ${mute(' .ew-card')},
  ${mute(' .ew-tier-card')} {
    background-image: none;
    box-shadow: none;
  }
  ${mute(' .ew-card')},
  ${mute(' .ew-hero__panel')},
  ${mute(' .ew-tier-card')},
  ${mute(' .ew-dialog')} {
    clip-path: none;
    border-width: 1px;
    border-style: solid;
  }

  /* Dividers */
  [data-era="deco"] .ew-ornament-divider {
    height: 28px;
    margin: 48px auto;
    max-width: 720px;
    position: relative;
    background:
      linear-gradient(90deg, transparent, var(--ew-color-gold), transparent) center / 100% 2px no-repeat,
      linear-gradient(90deg, transparent, var(--ew-color-gold), transparent) center / 100% 2px no-repeat;
    background-position: center 10px, center 16px;
    border: 0;
    opacity: 1;
  }
  [data-era="deco"] .ew-ornament-divider::before {
    content: "" / "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 88px;
    height: 40px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
  }

  /* Buttons — square gold; no clip-path */
  [data-era="deco"] .ew-button {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    clip-path: none;
    box-shadow: 0 3px 0 0 var(--ew-color-border-strong);
  }
  [data-era="deco"] .ew-button:active {
    box-shadow: 0 1px 0 0 var(--ew-color-border-strong);
  }
  [data-era="deco"] .ew-button[data-variant="secondary"] {
    border-style: double;
    border-width: 3px;
    border-color: var(--ew-color-gold);
  }

  /* Fields */
  [data-era="deco"] .ew-text-field__label,
  [data-era="deco"] .ew-select__label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11px;
    font-weight: 700;
    font-variant-caps: all-small-caps;
  }
  [data-era="deco"] .ew-text-field__control,
  [data-era="deco"] .ew-select__control,
  [data-era="deco"] .ew-select__trigger,
  [data-era="deco"] .ew-textarea__control {
    border-radius: 0;
    border-top: 1px solid color-mix(in oklch, var(--ew-color-gold) 35%, transparent);
    border-left: 1px solid color-mix(in oklch, var(--ew-color-gold) 35%, transparent);
    border-right: 1px solid color-mix(in oklch, var(--ew-color-gold) 35%, transparent);
    border-bottom: 3px solid var(--ew-color-gold);
    background: color-mix(in oklch, var(--ew-color-field-bg) 92%, var(--ew-color-brass) 8%);
  }

  /* Checkbox / switch */
  [data-era="deco"] .ew-checkbox,
  [data-era="deco"] .ew-switch {
    align-items: center;
    min-height: 28px;
  }
  [data-era="deco"] .ew-checkbox__box {
    width: 20px;
    height: 20px;
    border-style: double;
    border-width: 3px;
    border-color: var(--ew-color-gold);
  }
  [data-era="deco"] .ew-switch__track,
  [data-era="deco"] .ew-switch__thumb { border-radius: 0; }
  /* Track edge + off knob use goldBorder (≥3:1 on card); pure gold fails AA on ivory. */
  [data-era="deco"] .ew-switch__track { border: 2px solid var(--ew-color-goldBorder, var(--ew-color-border-strong)); }
  [data-era="deco"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-goldBorder, var(--ew-color-border-strong));
  }
  [data-era="deco"] .ew-switch__control:checked + .ew-switch__track {
    background: var(--ew-color-track-on, var(--ew-color-action-bg));
    border-color: var(--ew-color-goldBorder, var(--ew-color-border-strong));
  }
  [data-era="deco"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    /* Dark lacquer knob on gold track (≥3:1; white fails on #D4AF37) */
    background: var(--ew-color-action-fg, #0b0b0c);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--ew-color-fg-default) 25%, transparent);
  }

  /* Dialog — crest reserved space + stepped corner tiles */
  [data-era="deco"] .ew-dialog {
    clip-path: none;
    background-color: var(--ew-color-bg-elevated);
    background-image:
      var(--ew-deco-step-tl),
      var(--ew-deco-step-tr),
      var(--ew-deco-step-bl),
      var(--ew-deco-step-br);
    background-size: 28px 28px;
    background-position: left 6px top 6px, right 6px top 6px, left 6px bottom 6px, right 6px bottom 6px;
    background-repeat: no-repeat;
    box-shadow: 0 10px 0 0 var(--ew-color-border-strong);
    position: relative;
    border: 4px double var(--ew-color-gold);
    padding: 56px 24px 24px;
  }
  [data-era="deco"] .ew-dialog::before {
    content: "" / "";
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 40px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
    opacity: 0.95;
    z-index: 2;
  }
  [data-era="deco"] .ew-dialog::after {
    content: none;
  }
  [data-era="deco"] .ew-dialog h2 {
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-top: 8px;
    position: relative;
    z-index: 2;
  }
  [data-era="deco"] .ew-dialog__footer {
    position: relative;
    z-index: 2;
  }

  /* Tabs */
  [data-era="deco"] .ew-tabs [role="tablist"],
  [data-era="deco"] ew-tabs [role="tablist"] {
    border-bottom: 3px double var(--ew-color-gold);
    gap: 0;
  }
  [data-era="deco"] .ew-tabs [role="tab"],
  [data-era="deco"] ew-tabs [role="tab"] {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 13px;
    font-weight: 700;
    border: 2px solid transparent;
    border-bottom: 0;
    margin-bottom: -3px;
    border-radius: 0;
  }
  [data-era="deco"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="deco"] ew-tabs [role="tab"][aria-selected="true"] {
    clip-path: none;
    background: var(--ew-color-action-bg);
    color: var(--ew-color-action-fg);
    border-color: var(--ew-color-gold);
  }

  /* Alert */
  [data-era="deco"] .ew-alert {
    border-radius: 0;
    border: 3px double var(--ew-color-gold);
    border-left-width: 8px;
    border-left-style: solid;
    background: var(--ew-color-bg-surface);
  }
  [data-era="deco"] .ew-alert__title {
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  /* Toast — zigzag band */
  [data-era="deco"] .ew-toast {
    border-radius: 0;
    border: 2px double var(--ew-color-gold);
    background: var(--ew-color-bg-elevated);
  }
  [data-era="deco"] .ew-toast::before {
    content: "" / "";
    display: block;
    height: 8px;
    margin: -12px -14px 10px;
    background: repeating-linear-gradient(
      -45deg,
      var(--ew-color-gold) 0 6px,
      transparent 6px 12px
    );
  }

  /* Tooltip */
  [data-era="deco"] .ew-tooltip__tip {
    border-radius: 0;
    border: 2px solid var(--ew-color-gold);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 11px;
  }

  /* Breadcrumb */
  [data-era="deco"] .ew-breadcrumb {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 12px;
  }
  [data-era="deco"] .ew-breadcrumb__sep {
    color: var(--ew-color-gold);
  }

  /* Menu / select option plates — square gold, not grey rounded */
  [data-era="deco"] .ew-select__option,
  [data-era="deco"] .ew-menu__item {
    border-radius: 0;
  }
  [data-era="deco"] .ew-select__option[aria-selected="true"],
  [data-era="deco"] .ew-select__option.is-active,
  [data-era="deco"] .ew-select__option:hover,
  [data-era="deco"] .ew-select__option:focus,
  [data-era="deco"] .ew-menu__item:hover,
  [data-era="deco"] .ew-menu__item:focus-visible {
    background: color-mix(in oklch, var(--ew-color-gold) 28%, var(--ew-color-bg-elevated));
    outline: 1px solid var(--ew-color-gold);
    outline-offset: -1px;
  }
  [data-era="deco"] .ew-select__list,
  [data-era="deco"] .ew-menu__panel {
    border-radius: 0;
    border: 2px double var(--ew-color-gold);
  }

  /* Headings: casing only — no forced center (use .ew-section-heading / .ew-hero for centering) */
  [data-era="deco"] h1,
  [data-era="deco"] h2,
  [data-era="deco"] h3 {
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-era="deco"] .ew-hero__rays { animation: none !important; }
  }

  @media (forced-colors: active) {
    [data-era="deco"] .ew-hero__backdrop,
    [data-era="deco"] .ew-hero__rays,
    [data-era="deco"] .ew-hero__fan,
    [data-era="deco"] .ew-card::before,
    [data-era="deco"] .ew-card::after,
    [data-era="deco"] .ew-ornament-divider::before,
    [data-era="deco"] .ew-dialog::before,
    [data-era="deco"] .ew-section-heading::before,
    [data-era="deco"] .ew-section-heading::after {
      display: none;
    }
  }
`;
}
