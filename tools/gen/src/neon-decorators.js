import { muteBandSel } from './band.js';

/** Wedge frame: 45° corner cuts — stroke follows the cut (mask, not clip-path). */
const WEDGE_FRAME_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" fill="none" preserveAspectRatio="none">
    <path d="M14 2 H186 L198 14 V106 L186 118 H14 L2 106 V14 Z"
      stroke="black" stroke-width="3.5" stroke-linejoin="miter"/>
  </svg>`
);
/** Filled wedge for clipping card chrome so no rectangular outer frame shows. */
const WEDGE_FILL = `polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)`;

const WEDGE_BTN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" fill="none" preserveAspectRatio="none">
    <path d="M10 2 H110 L118 10 V30 L110 38 H10 L2 30 V10 Z"
      stroke="black" stroke-width="3" stroke-linejoin="miter"/>
  </svg>`
);

/** Wireframe mountain silhouette for hero horizon. */
const MOUNTAINS_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 120" fill="none" preserveAspectRatio="none">
    <polyline points="0,110 60,70 110,95 180,35 240,80 300,50 360,90 420,25 500,75 560,45 640,95 700,55 760,85 800,70"
      stroke="black" stroke-width="2.2" fill="none"/>
    <polyline points="0,118 90,88 160,105 250,60 340,100 430,48 520,92 610,68 700,100 800,80"
      stroke="black" stroke-width="1.4" fill="none" opacity="0.7"/>
  </svg>`
);

/** Small sun mark for logo / empty states. Pass raw #hex — encodeURIComponent once. */
const SUN_MARK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" fill="none">
    <defs>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFC857"/>
        <stop offset="55%" stop-color="#FF6B35"/>
        <stop offset="100%" stop-color="#FF2A6D"/>
      </linearGradient>
    </defs>
    <path d="M4 36 A28 28 0 0 1 60 36 Z" fill="url(#s)"/>
    <path d="M8 28 H56 M10 32 H54 M14 36 H50" stroke="#0D0221" stroke-width="2.2"/>
  </svg>`
);

/**
 * Full Neon decorator layer CSS — 80s synthwave.
 * Costume ON by default; whisper|standard|default mute via muteBandSel.
 */
export function neonDecoratorCss() {
  const mute = (rest) => muteBandSel('neon', rest);

  return `  /* === NEON: 80s SYNTHWAVE — costume default; mute via whisper|standard === */

  [data-era="neon"] {
    --ew-font-display: "Orbitron", Eurostile, sans-serif;
    --ew-font-chrome: "Monoton", "Orbitron", sans-serif;
    --ew-font-script: "Mr Dafoe", "Brush Script MT", cursive;
    --ew-font-body: "Exo 2", system-ui, sans-serif;
    --ew-font-mono: "Share Tech Mono", ui-monospace, monospace;
    --ew-gradient-chrome: linear-gradient(
      180deg,
      #ffffff 0%,
      #c8f7ff 18%,
      #05d9e8 38%,
      #ff2a6d 52%,
      #ff6b35 72%,
      #ffc857 100%
    );
    --ew-gradient-sunset: linear-gradient(
      180deg,
      #ffc857 0%,
      #ff9f1c 28%,
      #ff6b35 52%,
      #ff2a6d 78%,
      #c0115a 100%
    );
    --ew-gradient-hero-dark: linear-gradient(
      180deg,
      #1a0533 0%,
      #2d0a4e 35%,
      #0d0221 70%,
      #05010f 100%
    );
    /* Miami dusk pink sky (not lavender) */
    --ew-gradient-hero-light: linear-gradient(
      180deg,
      #ff9ec8 0%,
      #ffc1d9 28%,
      #ffd6a8 58%,
      #7ec8ff 100%
    );
    --ew-glow-magenta: 0 0 6px color-mix(in srgb, var(--ew-color-magenta) 70%, transparent),
      0 0 16px color-mix(in srgb, var(--ew-color-magenta) 45%, transparent),
      0 0 32px color-mix(in srgb, var(--ew-color-magenta) 28%, transparent);
    --ew-glow-cyan: 0 0 6px color-mix(in srgb, var(--ew-color-cyan) 70%, transparent),
      0 0 16px color-mix(in srgb, var(--ew-color-cyan) 45%, transparent),
      0 0 28px color-mix(in srgb, var(--ew-color-cyan) 28%, transparent);
    --ew-ornament-wedge: url("data:image/svg+xml,${WEDGE_FRAME_SVG}");
    --ew-ornament-wedge-btn: url("data:image/svg+xml,${WEDGE_BTN_SVG}");
    --ew-ornament-mountains: url("data:image/svg+xml,${MOUNTAINS_SVG}");
    --ew-ornament-sun-mark: url("data:image/svg+xml,${SUN_MARK_SVG}");
    --ew-hero-horizon: 40%;
  }

  /* --- Hero: CSS grid — content row then in-flow horizon stage (no overlap) --- */
  [data-era="neon"] .ew-hero {
    --ew-hero-horizon: min(42vh, 400px);
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-height: min(88vh, 920px);
    display: grid;
    grid-template-rows: 1fr auto;
    padding: 48px 24px 0;
    background: var(--ew-gradient-hero-dark);
    color: var(--ew-color-fg-default);
  }
  [data-era="neon"][data-mode="light"] .ew-hero {
    background: var(--ew-gradient-hero-light);
  }

  /* Horizon stage in flow — sun + mountains + grid all INSIDE (no upward overflow into content).
     Required for costume neon heroes (see llms.txt). Sun height also set on .ew-hero so missing
     stage degrades instead of collapsing the sun to 0px. */
  [data-era="neon"] .ew-hero,
  [data-era="neon"] .ew-hero__stage {
    --ew-hero-sun-h: min(140px, 21vw);
  }
  [data-era="neon"] .ew-hero__stage {
    position: relative;
    grid-row: 2;
    height: calc(var(--ew-hero-sun-h) + min(38vh, 360px));
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }
  /* Shared hero tree puts a backdrop and a panel around the copy. The backdrop must not take row 1, and the panel must, or the title falls below the floor. */
  [data-era="neon"] .ew-hero__backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  [data-era="neon"] .ew-hero__panel {
    position: relative;
    z-index: 4;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    width: 100%;
    margin: 0;
  }
  [data-era="neon"] .ew-hero__panel .ew-hero__rays,
  [data-era="neon"] .ew-hero__panel .ew-hero__fan {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    pointer-events: none;
  }

  /* Content stack: chrome → script → subtitle → CTAs — always above the stage */
  [data-era="neon"] .ew-hero__content {
    position: relative;
    z-index: 4;
    grid-row: 1;
    text-align: center;
    max-width: 920px;
    width: 100%;
    margin: 0 auto;
    padding: 12px 12px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /*
   * Perspective floor. Origin is the near edge (the hero bottom) so the
   * grid meets the stage edge. Lines still converge toward the horizon.
   */
  [data-era="neon"] .ew-hero__grid {
    position: absolute;
    left: -35%;
    width: 170%;
    /* Mountain valleys sit just under the sun's diameter (stage-local).
       Origin is the near edge so the floor meets the hero bottom; the horizon recedes from there. */
    top: calc(var(--ew-hero-sun-h) + 6px);
    bottom: 0;
    height: auto;
    transform-origin: bottom center;
    transform: perspective(280px) rotateX(63deg);
    pointer-events: none;
    z-index: 0;
    opacity: 0.95;
    background-image:
      linear-gradient(
        to bottom,
        transparent 0 calc(100% - 2px),
        color-mix(in srgb, var(--ew-color-cyan) 92%, white) calc(100% - 2px)
      ),
      linear-gradient(
        to right,
        transparent 0 calc(100% - 2px),
        color-mix(in srgb, var(--ew-color-magenta) 90%, white) calc(100% - 2px)
      );
    background-size: 100% 32px, 78px 100%;
    background-repeat: repeat;
    box-shadow: inset 0 2px 0 color-mix(in srgb, var(--ew-color-cyan) 90%, white);
  }
  [data-era="neon"][data-mode="light"] .ew-hero__grid {
    opacity: 0.72;
  }
  [data-era="neon"] .ew-hero > .ew-hero__grid {
    top: auto;
    bottom: 0;
    height: min(48vh, 440px);
    transform-origin: bottom center;
    transform: perspective(280px) rotateX(63deg);
  }

  /* Striped sunset sun — top of stage, half-set onto the grid horizon */
  [data-era="neon"] .ew-hero__sun {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: auto;
    width: min(280px, 42vw);
    height: var(--ew-hero-sun-h);
    transform: translateX(-50%);
    border-radius: 999px 999px 0 0;
    background: var(--ew-gradient-sunset);
    mask-image: repeating-linear-gradient(
      180deg,
      black 0 10px,
      transparent 10px 14px,
      black 14px 26px,
      transparent 26px 32px,
      black 32px 48px,
      transparent 48px 58px,
      black 58px 78px,
      transparent 78px 92px,
      black 92px 120px,
      transparent 120px 140px
    );
    -webkit-mask-image: repeating-linear-gradient(
      180deg,
      black 0 10px,
      transparent 10px 14px,
      black 14px 26px,
      transparent 26px 32px,
      black 32px 48px,
      transparent 48px 58px,
      black 58px 78px,
      transparent 78px 92px,
      black 92px 120px,
      transparent 120px 140px
    );
    box-shadow: 0 0 40px color-mix(in srgb, var(--ew-color-magenta) 45%, transparent);
    pointer-events: none;
    z-index: 2;
  }
  [data-era="neon"] .ew-hero > .ew-hero__sun {
    top: auto;
    bottom: min(38vh, 360px);
  }

  /* Wireframe mountains — SVG ground line sits on the same horizon as the grid top */
  [data-era="neon"] .ew-hero__mountains {
    position: absolute;
    left: 50%;
    top: calc(var(--ew-hero-sun-h) - 76px);
    bottom: auto;
    width: min(1100px, 120%);
    height: 88px;
    transform: translateX(-50%);
    background-color: var(--ew-color-cyan);
    -webkit-mask: var(--ew-ornament-mountains) center / 100% 100% no-repeat;
    mask: var(--ew-ornament-mountains) center / 100% 100% no-repeat;
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--ew-color-cyan) 55%, transparent));
    pointer-events: none;
    z-index: 3;
    opacity: 0.95;
  }
  [data-era="neon"] .ew-hero > .ew-hero__mountains {
    top: auto;
    bottom: calc(min(38vh, 360px) - 4px);
  }

  /* Scanline overlay (hero) */
  [data-era="neon"] .ew-hero__scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      180deg,
      transparent 0 3px,
      color-mix(in srgb, var(--ew-color-fg-default) 4%, transparent) 3px 4px
    );
    pointer-events: none;
    z-index: 3;
    opacity: 0.55;
  }

  /* Chrome type — size inherits; hero headlines keep display clamp */
  [data-era="neon"] .ew-chrome {
    font-family: var(--ew-font-chrome);
    font-weight: 400;
    font-size: inherit;
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    display: inline-block;
    position: relative;
    color: var(--ew-color-cyan);
    background: var(--ew-gradient-chrome);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px #fff;
    paint-order: stroke fill;
    filter: drop-shadow(0 2px 0 color-mix(in srgb, var(--ew-color-magenta) 55%, transparent));
  }
  [data-era="neon"] .ew-chrome[data-size="sm"] { font-size: clamp(18px, 3vw, 28px); }
  [data-era="neon"] .ew-chrome[data-size="md"] { font-size: clamp(28px, 5vw, 48px); }
  [data-era="neon"] .ew-chrome[data-size="lg"] { font-size: clamp(48px, 10vw, 108px); }
  [data-era="neon"] .ew-hero__title {
    font-family: var(--ew-font-chrome);
    font-weight: 400;
    font-size: clamp(48px, 10vw, 108px);
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0 0 4px;
    display: inline-block;
    position: relative;
    color: var(--ew-color-cyan);
    background: var(--ew-gradient-chrome);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px #fff;
    paint-order: stroke fill;
    filter: drop-shadow(0 2px 0 color-mix(in srgb, var(--ew-color-magenta) 55%, transparent));
  }
  @supports not (background-clip: text) {
    [data-era="neon"] .ew-hero__title,
    [data-era="neon"] .ew-chrome {
      -webkit-text-fill-color: unset;
      -webkit-text-stroke: 0;
      color: var(--ew-color-cyan);
      background: none;
    }
  }

  /* Brush-script overlay — optional hot-pink slant */
  [data-era="neon"] .ew-script {
    font-family: var(--ew-font-script);
    font-size: clamp(28px, 5vw, 56px);
    color: var(--ew-color-magenta);
    transform: rotate(-8deg);
    display: inline-block;
    position: relative;
    z-index: 5;
    margin: -4px 0 12px;
    text-shadow:
      0 0 8px color-mix(in srgb, var(--ew-color-magenta) 55%, transparent),
      2px 2px 0 color-mix(in srgb, var(--ew-color-bg-page) 80%, transparent);
    letter-spacing: 0.02em;
    font-weight: 400;
    text-transform: none;
  }

  [data-era="neon"] .ew-hero__subtitle {
    font-family: var(--ew-font-display);
    font-size: clamp(14px, 2vw, 18px);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--ew-color-fg-muted);
    margin: 8px 0 28px;
  }
  [data-era="neon"] .ew-hero__cta {
    display: inline-flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Small sun mark (logo / empty) */
  [data-era="neon"] .ew-sun-mark {
    display: inline-block;
    width: 64px;
    height: 40px;
    background: var(--ew-ornament-sun-mark) center / contain no-repeat;
  }

  /* Section heading */
  [data-era="neon"] .ew-section-heading {
    font-family: var(--ew-font-display);
    font-size: clamp(22px, 3.5vw, 36px);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-align: center;
    margin: 0 0 40px;
    color: var(--ew-color-cyan);
    text-shadow: 0 0 12px color-mix(in srgb, var(--ew-color-cyan) 40%, transparent);
  }

  /* RGB-split hover on chrome headlines */
  @media (prefers-reduced-motion: no-preference) {
    [data-era="neon"] .ew-hero__title:hover,
    [data-era="neon"] .ew-chrome:hover {
      text-shadow:
        -2px 0 color-mix(in srgb, var(--ew-color-magenta) 80%, transparent),
        2px 0 color-mix(in srgb, var(--ew-color-cyan) 80%, transparent);
    }
  }

  /* --- Cards: wedge tube only (clip fill to wedge; stroke via mask — no rect outer frame) --- */
  [data-era="neon"] .ew-card {
    position: relative;
    border: none !important;
    outline: none;
    border-radius: 0;
    background: var(--ew-color-bg-surface);
    /* drop-shadow follows clip-path; box-shadow would draw a rectangular aura */
    box-shadow: none;
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--ew-color-magenta) 70%, transparent))
      drop-shadow(0 0 16px color-mix(in srgb, var(--ew-color-magenta) 40%, transparent));
    clip-path: ${WEDGE_FILL};
    overflow: visible;
    /* Clear the 45° cut so titles are never clipped */
    padding: 32px 32px 28px;
    min-width: 0;
    max-width: 100%;
  }
  [data-era="neon"] .ew-card[data-variant="raised"] {
    background: var(--ew-color-bg-elevated);
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--ew-color-cyan) 70%, transparent))
      drop-shadow(0 0 16px color-mix(in srgb, var(--ew-color-cyan) 40%, transparent));
  }
  [data-era="neon"] .ew-card::after {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-color: var(--ew-color-magenta);
    -webkit-mask: var(--ew-ornament-wedge) center / 100% 100% no-repeat;
    mask: var(--ew-ornament-wedge) center / 100% 100% no-repeat;
    opacity: 0.95;
  }
  [data-era="neon"] .ew-card[data-variant="raised"]::after {
    background-color: var(--ew-color-cyan);
  }
  [data-era="neon"] .ew-card__header,
  [data-era="neon"] .ew-card__body,
  [data-era="neon"] .ew-card__footer {
    position: relative;
    z-index: 2;
    min-width: 0;
    max-width: 100%;
  }
  [data-era="neon"] .ew-card__header h2,
  [data-era="neon"] .ew-card__header h3 {
    font-family: var(--ew-font-display);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ew-color-fg-default);
    min-width: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
    text-wrap: balance;
  }
  @media (max-width: 640px) {
    [data-era="neon"] .ew-card {
      padding: 20px 14px 16px;
    }
    [data-era="neon"] .ew-card__header h2,
    [data-era="neon"] .ew-card__header h3 {
      letter-spacing: 0.04em;
      font-size: 0.95rem;
    }
  }
  [data-era="neon"] .ew-card__header::after {
    content: "" / "";
    display: block;
    height: 2px;
    margin-top: 12px;
    background: linear-gradient(90deg, var(--ew-color-magenta), var(--ew-color-cyan), transparent);
    box-shadow: 0 0 8px color-mix(in srgb, var(--ew-color-magenta) 50%, transparent);
  }

  /* Buttons — wedge border via mask + glow tube (no rect border) */
  [data-era="neon"] .ew-button {
    position: relative;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    font-family: var(--ew-font-body);
    border-radius: 0;
    border: none;
    box-shadow: var(--ew-glow-magenta);
    clip-path: none;
    padding-inline: 22px;
  }
  [data-era="neon"] .ew-button::after {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-color: var(--ew-color-magenta);
    -webkit-mask: var(--ew-ornament-wedge-btn) center / 100% 100% no-repeat;
    mask: var(--ew-ornament-wedge-btn) center / 100% 100% no-repeat;
    opacity: 0.9;
  }
  [data-era="neon"] .ew-button[data-variant="secondary"] {
    background: transparent;
    color: var(--ew-color-cyan);
    box-shadow: var(--ew-glow-cyan);
  }
  [data-era="neon"] .ew-button[data-variant="secondary"]::after {
    background-color: var(--ew-color-cyan);
  }
  [data-era="neon"] .ew-button[data-variant="ghost"] {
    box-shadow: none;
  }
  [data-era="neon"] .ew-button[data-variant="ghost"]::after { display: none; }

  /* Fields */
  [data-era="neon"] .ew-text-field__label,
  [data-era="neon"] .ew-select__label,
  [data-era="neon"] .ew-textarea__label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 13px;
    font-weight: 700;
  }
  [data-era="neon"] .ew-text-field__control,
  [data-era="neon"] .ew-select__control,
  [data-era="neon"] .ew-select__trigger,
  [data-era="neon"] .ew-textarea__control {
    border-radius: 0;
    border: 2px solid var(--ew-color-cyan);
    background: var(--ew-color-field-bg);
    box-shadow: 0 0 10px color-mix(in srgb, var(--ew-color-cyan) 35%, transparent);
  }
  [data-era="neon"] .ew-text-field__control:focus-visible,
  [data-era="neon"] .ew-select__trigger:focus-visible {
    outline: 2px solid var(--ew-color-field-focus);
    outline-offset: 2px;
  }

  /* Checkbox / radio — field bg only when unchecked so checked fill/tick stay visible */
  [data-era="neon"] .ew-checkbox__control:not(:checked) + .ew-checkbox__box,
  [data-era="neon"] .ew-radio__control:not(:checked) + .ew-radio__disc {
    border-radius: 0;
    border: 2px solid var(--ew-color-cyan);
    background: var(--ew-color-field-bg);
    box-shadow: 0 0 8px color-mix(in srgb, var(--ew-color-cyan) 35%, transparent);
  }
  [data-era="neon"] .ew-radio__control:not(:checked) + .ew-radio__disc { border-radius: 999px; }
  [data-era="neon"] .ew-checkbox__control:checked + .ew-checkbox__box {
    border-radius: 0;
    border: 2px solid var(--ew-color-action-bg);
    background: var(--ew-color-action-bg);
    box-shadow: 0 0 10px color-mix(in srgb, var(--ew-color-magenta) 45%, transparent);
  }
  [data-era="neon"] .ew-radio__control:checked + .ew-radio__disc {
    border-radius: 999px;
    border: 2px solid var(--ew-color-cyan);
    background: var(--ew-color-field-bg);
    box-shadow: 0 0 8px color-mix(in srgb, var(--ew-color-cyan) 35%, transparent);
  }

  /* Switch — lit track + bright knob when on */
  [data-era="neon"] .ew-switch__control:not(:checked) + .ew-switch__track {
    border-radius: 0;
    border: 2px solid var(--ew-color-border-strong);
    background: var(--ew-color-track-off);
  }
  [data-era="neon"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    border-radius: 0;
    background: #ffffff;
    box-shadow: 0 0 6px color-mix(in srgb, var(--ew-color-cyan) 40%, transparent);
  }
  [data-era="neon"] .ew-switch__control:checked + .ew-switch__track {
    border-radius: 0;
    border: 2px solid var(--ew-color-magenta);
    background: var(--ew-color-track-on, var(--ew-color-action-bg));
    box-shadow: var(--ew-glow-magenta);
  }
  [data-era="neon"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    border-radius: 0;
    background: #ffffff;
    box-shadow: 0 0 10px color-mix(in srgb, #fff 80%, transparent);
  }

  /* Dialog */
  [data-era="neon"] .ew-dialog {
    border: none;
    border-radius: 0;
    background: var(--ew-color-bg-elevated);
    box-shadow: var(--ew-glow-magenta), var(--ew-structure-dialog-shadow);
    position: relative;
    padding: 28px;
  }
  [data-era="neon"] .ew-dialog::after {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-color: var(--ew-color-magenta);
    -webkit-mask: var(--ew-ornament-wedge) center / 100% 100% no-repeat;
    mask: var(--ew-ornament-wedge) center / 100% 100% no-repeat;
    opacity: 0.85;
  }
  [data-era="neon"] .ew-dialog h2 {
    font-family: var(--ew-font-display);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    position: relative;
    z-index: 2;
  }

  /* Tabs — glowing underline on active */
  [data-era="neon"] .ew-tabs [role="tablist"],
  [data-era="neon"] ew-tabs [role="tablist"] {
    border-bottom: 1px solid color-mix(in srgb, var(--ew-color-cyan) 45%, transparent);
    gap: 4px;
  }
  [data-era="neon"] .ew-tabs [role="tab"],
  [data-era="neon"] ew-tabs [role="tab"] {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 13px;
    font-weight: 700;
    border-radius: 0;
    border-bottom: 2px solid transparent;
  }
  [data-era="neon"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="neon"] ew-tabs [role="tab"][aria-selected="true"] {
    color: var(--ew-color-cyan);
    border-bottom-color: var(--ew-color-cyan);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--ew-color-cyan) 45%, transparent);
    background: transparent;
    text-shadow: 0 0 8px color-mix(in srgb, var(--ew-color-cyan) 45%, transparent);
  }
  [data-era="neon"][data-mode="light"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="neon"][data-mode="light"] ew-tabs [role="tab"][aria-selected="true"] {
    color: var(--ew-color-fg-default);
    border-bottom-color: var(--ew-color-magenta);
    background: color-mix(in srgb, var(--ew-color-bg-elevated) 88%, var(--ew-color-magenta));
    text-shadow: none;
    box-shadow: 0 4px 10px color-mix(in srgb, var(--ew-color-magenta) 28%, transparent);
  }
  [data-era="neon"][data-mode="light"] .ew-section-heading {
    color: var(--ew-color-fg-default);
    text-shadow: none;
  }

  /* Alert / toast / tooltip / breadcrumb / menu / select */
  [data-era="neon"] .ew-alert {
    border-radius: 0;
    border: 2px solid var(--ew-color-cyan);
    box-shadow: var(--ew-glow-cyan);
    background: var(--ew-color-bg-surface);
  }
  [data-era="neon"] .ew-alert__title {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-family: var(--ew-font-display);
  }
  [data-era="neon"] .ew-toast {
    border-radius: 0;
    border: 2px solid var(--ew-color-magenta);
    box-shadow: var(--ew-glow-magenta);
  }
  [data-era="neon"] .ew-toast::before {
    content: "" / "";
    display: block;
    height: 3px;
    margin: -12px -14px 10px;
    background: linear-gradient(90deg, var(--ew-color-magenta), var(--ew-color-cyan));
    box-shadow: 0 0 10px color-mix(in srgb, var(--ew-color-magenta) 50%, transparent);
  }
  [data-era="neon"] .ew-tooltip__tip {
    border-radius: 0;
    border: 1px solid var(--ew-color-cyan);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: var(--ew-glow-cyan);
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  [data-era="neon"] .ew-breadcrumb {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 12px;
  }
  [data-era="neon"] .ew-breadcrumb__sep { color: var(--ew-color-magenta); }
  [data-era="neon"] .ew-select__option,
  [data-era="neon"] .ew-menu__item {
    border-radius: 0;
  }
  [data-era="neon"] .ew-select__option[aria-selected="true"],
  [data-era="neon"] .ew-select__option.is-active,
  [data-era="neon"] .ew-select__option:hover,
  [data-era="neon"] .ew-menu__item:hover,
  [data-era="neon"] .ew-menu__item:focus-visible {
    background: color-mix(in srgb, var(--ew-color-magenta) 22%, var(--ew-color-bg-elevated));
    outline: 1px solid var(--ew-color-magenta);
    outline-offset: -1px;
  }
  [data-era="neon"] .ew-select__list,
  [data-era="neon"] .ew-menu__panel {
    border-radius: 0;
    border: 2px solid var(--ew-color-cyan);
    box-shadow: var(--ew-glow-cyan);
  }

  /* Tier / pricing */
  [data-era="neon"] .ew-tier-card {
    position: relative;
    text-align: center;
    padding: 40px 32px 32px;
    border: none !important;
    background: var(--ew-color-bg-surface);
    box-shadow: none;
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--ew-color-cyan) 70%, transparent))
      drop-shadow(0 0 16px color-mix(in srgb, var(--ew-color-cyan) 40%, transparent));
    clip-path: ${WEDGE_FILL};
  }
  [data-era="neon"] .ew-tier-card::after {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-color: var(--ew-color-cyan);
    -webkit-mask: var(--ew-ornament-wedge) center / 100% 100% no-repeat;
    mask: var(--ew-ornament-wedge) center / 100% 100% no-repeat;
    opacity: 0.9;
  }
  [data-era="neon"] .ew-tier-card__price {
    font-family: var(--ew-font-chrome);
    font-size: clamp(36px, 5vw, 56px);
    margin: 0 0 8px;
    position: relative;
    z-index: 2;
    background: var(--ew-gradient-chrome);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px #fff;
    paint-order: stroke fill;
    color: var(--ew-color-fg-default);
  }
  [data-era="neon"][data-mode="light"] .ew-tier-card__price {
    /* Readable solid fallback under clip */
    color: var(--ew-color-fg-default);
    filter: drop-shadow(0 1px 0 #fff);
  }

  /* Page-level faint scanlines (optional class) */
  [data-era="neon"] .ew-scanlines {
    position: relative;
  }
  [data-era="neon"] .ew-scanlines::before {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 20;
    background: repeating-linear-gradient(
      180deg,
      transparent 0 3px,
      color-mix(in srgb, var(--ew-color-fg-default) 3.5%, transparent) 3px 4px
    );
    opacity: 0.5;
  }

  /* Mute costume ornament under whisper/standard/default */
  ${mute(' .ew-hero__stage')},
  ${mute(' .ew-hero__grid')},
  ${mute(' .ew-hero__sun')},
  ${mute(' .ew-hero__mountains')},
  ${mute(' .ew-hero__scanlines')},
  ${mute(' .ew-card::after')},
  ${mute(' .ew-card__header::after')},
  ${mute(' .ew-button::after')},
  ${mute(' .ew-dialog::after')},
  ${mute(' .ew-tier-card::after')},
  ${mute(' .ew-toast::before')},
  ${mute(' .ew-scanlines::before')},
  ${mute(' .ew-script')} {
    display: none !important;
  }
  ${mute(' .ew-card')},
  ${mute(' .ew-button')},
  ${mute(' .ew-dialog')},
  ${mute(' .ew-tier-card')},
  ${mute(' .ew-alert')},
  ${mute(' .ew-toast')} {
    box-shadow: none;
    filter: none;
  }
  ${mute(' .ew-hero')} {
    background: var(--ew-color-bg-page);
  }
  ${mute(' .ew-hero__title')},
  ${mute(' .ew-chrome')},
  ${mute(' .ew-tier-card__price')} {
    background: none;
    -webkit-text-fill-color: unset;
    -webkit-text-stroke: 0;
    color: var(--ew-color-fg-default);
    filter: none;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-era="neon"] .ew-hero__title,
    [data-era="neon"] .ew-chrome {
      text-shadow: none !important;
    }
  }

  @media (forced-colors: active) {
    [data-era="neon"] .ew-hero {
      background: Canvas;
      color: CanvasText;
    }
    [data-era="neon"] .ew-hero__grid,
    [data-era="neon"] .ew-hero__sun,
    [data-era="neon"] .ew-hero__mountains,
    [data-era="neon"] .ew-hero__scanlines,
    [data-era="neon"] .ew-card::after,
    [data-era="neon"] .ew-button::after,
    [data-era="neon"] .ew-dialog::after,
    [data-era="neon"] .ew-tier-card::after,
    [data-era="neon"] .ew-scanlines::before,
    [data-era="neon"] .ew-script {
      display: none;
    }
    [data-era="neon"] .ew-hero__title,
    [data-era="neon"] .ew-chrome,
    [data-era="neon"] .ew-tier-card__price {
      background: none;
      -webkit-text-fill-color: CanvasText;
      color: CanvasText;
      -webkit-text-stroke: 0;
      filter: none;
    }
  }
`;
}
