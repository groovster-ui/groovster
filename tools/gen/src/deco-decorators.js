import { muteBandSel } from './band.js';

/** Stepped-frame SVG (stroke follows ziggurat outline — not clip-path). */
const STEP_FRAME_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" fill="none" preserveAspectRatio="none">
    <path d="M8 28 H16 V16 H28 V8 H172 V16 H184 V28 H192 V92 H184 V104 H172 V112 H28 V104 H16 V92 H8 Z"
      stroke="black" stroke-width="3" stroke-linejoin="miter"/>
    <path d="M14 34 H22 V22 H34 V14 H166 V22 H178 V34 H186 V86 H178 V98 H166 V106 H34 V98 H22 V86 H14 Z"
      stroke="black" stroke-width="1.5" stroke-linejoin="miter"/>
  </svg>`
);

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
    --ew-deco-step-frame: url("data:image/svg+xml,${STEP_FRAME_SVG}");
    --ew-deco-step-clip: none;
    --ew-deco-step-clip-sm: none;
  }
  [data-era="deco"][data-mode="dark"] {
    --ew-gradient-metal: var(--ew-gradient-metal-dark);
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
    padding: 64px 48px 56px;
    text-align: center;
    border: 4px double var(--ew-color-gold);
    background: color-mix(in oklch, var(--ew-color-panel) 92%, transparent);
    box-shadow:
      0 0 0 1px color-mix(in oklch, var(--ew-color-gold) 65%, transparent),
      0 10px 0 0 var(--ew-color-gold);
  }
  [data-era="deco"] .ew-hero__panel::before {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    opacity: 0.95;
  }
  [data-era="deco"] .ew-hero__panel::after {
    content: "" / "";
    position: absolute;
    inset: 14px;
    border: 2px double color-mix(in oklch, var(--ew-color-gold) 75%, transparent);
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
    padding: 40px 24px 28px;
    border: 3px double var(--ew-color-gold);
    background: var(--ew-color-bg-surface);
  }
  [data-era="deco"] .ew-tier-card::after {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    opacity: 0.9;
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

  /* --- Cards: gold stepped frame via SVG mask (no clip-path border cutting) --- */
  [data-era="deco"] .ew-card {
    position: relative;
    border-style: double;
    border-width: 4px;
    border-color: var(--ew-color-gold);
    clip-path: none;
    background: var(--ew-color-bg-surface);
    box-shadow:
      0 0 0 1px color-mix(in oklch, var(--ew-color-gold) 70%, transparent),
      0 6px 0 0 var(--ew-color-border-strong),
      0 12px 0 0 color-mix(in oklch, var(--ew-color-fg-default) 22%, transparent);
    overflow: visible;
    padding-top: 8px;
  }
  [data-era="deco"] .ew-card[data-variant="raised"] {
    background: var(--ew-color-bg-elevated);
  }
  [data-era="deco"] .ew-card::before {
    content: "" / "";
    position: absolute;
    top: 18px;
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
  /* Stepped gold stroke follows ziggurat path (mask), plus inner double rule */
  [data-era="deco"] .ew-card::after {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    opacity: 0.95;
  }
  [data-era="deco"] .ew-card__header {
    padding-top: 64px;
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
  [data-era="deco"] .ew-switch__track { border: 2px solid var(--ew-color-gold); }
  [data-era="deco"] .ew-switch__thumb { background: var(--ew-color-gold); }

  /* Dialog — crest reserved space */
  [data-era="deco"] .ew-dialog {
    border-style: double;
    border-width: 4px;
    border-color: var(--ew-color-gold);
    clip-path: none;
    background: var(--ew-color-bg-elevated);
    box-shadow: 0 10px 0 0 var(--ew-color-border-strong);
    position: relative;
    padding-top: 56px;
  }
  [data-era="deco"] .ew-dialog::before {
    content: "" / "";
    position: absolute;
    top: 12px;
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
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    mask: var(--ew-deco-step-frame) center / 100% 100% no-repeat;
    opacity: 0.9;
  }
  [data-era="deco"] .ew-dialog h2 {
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-top: 8px;
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
