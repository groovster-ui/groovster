import { muteBandSel } from './band.js';

/** Wedge frame: 45° corner cuts — stroke follows the cut (mask, not clip-path). */
const WEDGE_FRAME_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" fill="none" preserveAspectRatio="none">
    <path d="M18 2 H182 L198 18 V102 L182 118 H18 L2 102 V18 Z"
      stroke="black" stroke-width="3.5" stroke-linejoin="miter"/>
  </svg>`
);

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

/** Small sun mark for logo / empty states. */
const SUN_MARK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" fill="none">
    <defs>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="%23FFC857"/>
        <stop offset="55%" stop-color="%23FF6B35"/>
        <stop offset="100%" stop-color="%23FF2A6D"/>
      </linearGradient>
    </defs>
    <path d="M4 36 A28 28 0 0 1 60 36 Z" fill="url(%23s)"/>
    <path d="M8 28 H56 M10 32 H54 M14 36 H50" stroke="%230D0221" stroke-width="2.2"/>
  </svg>`
);

/**
 * Full Neon decorator layer CSS — 80s synthwave.
 * Costume ON by default; whisper|default mute via muteBandSel.
 */
export function neonDecoratorCss() {
  const mute = (rest) => muteBandSel('neon', rest);

  return `  /* === NEON: 80s SYNTHWAVE — costume default; mute via whisper|default === */

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
    --ew-gradient-hero-light: linear-gradient(
      180deg,
      #f7c8e8 0%,
      #d9b3f5 28%,
      #9ec9f5 58%,
      #7a9fff 100%
    );
    --ew-glow-magenta: 0 0 6px color-mix(in oklch, var(--ew-color-magenta) 70%, transparent),
      0 0 16px color-mix(in oklch, var(--ew-color-magenta) 45%, transparent),
      0 0 32px color-mix(in oklch, var(--ew-color-magenta) 28%, transparent);
    --ew-glow-cyan: 0 0 6px color-mix(in oklch, var(--ew-color-cyan) 70%, transparent),
      0 0 16px color-mix(in oklch, var(--ew-color-cyan) 45%, transparent),
      0 0 28px color-mix(in oklch, var(--ew-color-cyan) 28%, transparent);
    --ew-ornament-wedge: url("data:image/svg+xml,${WEDGE_FRAME_SVG}");
    --ew-ornament-wedge-btn: url("data:image/svg+xml,${WEDGE_BTN_SVG}");
    --ew-ornament-mountains: url("data:image/svg+xml,${MOUNTAINS_SVG}");
    --ew-ornament-sun-mark: url("data:image/svg+xml,${SUN_MARK_SVG}");
  }

  /* --- Hero: grid floor + striped sun + mountains (hero-only, not fixed page) --- */
  [data-era="neon"] .ew-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    min-height: min(88vh, 920px);
    display: grid;
    place-items: center;
    padding: 48px 24px 96px;
    background: var(--ew-gradient-hero-dark);
    color: var(--ew-color-fg-default);
  }
  [data-era="neon"][data-mode="light"] .ew-hero {
    background: var(--ew-gradient-hero-light);
  }

  /* Perspective grid floor — bottom ~40% */
  [data-era="neon"] .ew-hero__grid {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 160%;
    height: 42%;
    transform: translateX(-50%) perspective(520px) rotateX(58deg);
    transform-origin: 50% 100%;
    background:
      repeating-linear-gradient(
        90deg,
        transparent 0 46px,
        color-mix(in oklch, var(--ew-color-magenta) 75%, transparent) 46px 48px
      ),
      repeating-linear-gradient(
        0deg,
        transparent 0 28px,
        color-mix(in oklch, var(--ew-color-cyan) 65%, transparent) 28px 30px
      );
    mask-image: linear-gradient(180deg, transparent 0%, black 35%, black 100%);
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 35%, black 100%);
    pointer-events: none;
    z-index: 0;
    opacity: 0.9;
  }
  [data-era="neon"][data-mode="light"] .ew-hero__grid {
    opacity: 0.55;
  }

  /* Striped sunset sun — half-set on horizon */
  [data-era="neon"] .ew-hero__sun {
    position: absolute;
    left: 50%;
    bottom: 36%;
    width: min(280px, 42vw);
    height: min(140px, 21vw);
    transform: translateX(-50%);
    border-radius: 999px 999px 0 0;
    background: var(--ew-gradient-sunset);
    /* Stripe gaps widen toward bottom */
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
    box-shadow: 0 0 40px color-mix(in oklch, var(--ew-color-magenta) 45%, transparent);
    pointer-events: none;
    z-index: 1;
  }

  /* Wireframe mountains on horizon */
  [data-era="neon"] .ew-hero__mountains {
    position: absolute;
    left: 50%;
    bottom: 34%;
    width: min(1100px, 120%);
    height: 90px;
    transform: translateX(-50%);
    background-color: var(--ew-color-cyan);
    -webkit-mask: var(--ew-ornament-mountains) center / 100% 100% no-repeat;
    mask: var(--ew-ornament-mountains) center / 100% 100% no-repeat;
    filter: drop-shadow(0 0 6px color-mix(in oklch, var(--ew-color-cyan) 55%, transparent));
    pointer-events: none;
    z-index: 1;
    opacity: 0.95;
  }

  /* Scanline overlay (hero) */
  [data-era="neon"] .ew-hero__scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      180deg,
      transparent 0 3px,
      color-mix(in oklch, var(--ew-color-fg-default) 4%, transparent) 3px 4px
    );
    pointer-events: none;
    z-index: 3;
    opacity: 0.55;
  }

  [data-era="neon"] .ew-hero__content {
    position: relative;
    z-index: 4;
    text-align: center;
    max-width: 920px;
  }

  /* Chrome type — metallic horizon-split + white stroke + solid fallback */
  [data-era="neon"] .ew-hero__title,
  [data-era="neon"] .ew-chrome {
    font-family: var(--ew-font-chrome);
    font-weight: 400;
    font-size: clamp(48px, 10vw, 108px);
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0 0 12px;
    display: inline-block;
    position: relative;
    color: var(--ew-color-cyan);
    background: var(--ew-gradient-chrome);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px color-mix(in oklch, white 70%, transparent);
    filter: drop-shadow(0 2px 0 color-mix(in oklch, var(--ew-color-magenta) 55%, transparent));
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
    margin: -8px 0 8px;
    text-shadow:
      0 0 8px color-mix(in oklch, var(--ew-color-magenta) 55%, transparent),
      2px 2px 0 color-mix(in oklch, var(--ew-color-bg-page) 80%, transparent);
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
    margin: 8px 0 32px;
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
    text-shadow: 0 0 12px color-mix(in oklch, var(--ew-color-cyan) 40%, transparent);
  }

  /* RGB-split hover on chrome headlines */
  @media (prefers-reduced-motion: no-preference) {
    [data-era="neon"] .ew-hero__title:hover,
    [data-era="neon"] .ew-chrome:hover {
      text-shadow:
        -2px 0 color-mix(in oklch, var(--ew-color-magenta) 80%, transparent),
        2px 0 color-mix(in oklch, var(--ew-color-cyan) 80%, transparent);
    }
  }

  /* --- Cards: neon tubes + wedge frames --- */
  [data-era="neon"] .ew-card {
    position: relative;
    border: 2px solid var(--ew-color-magenta);
    border-radius: 0;
    background: var(--ew-color-bg-surface);
    box-shadow: var(--ew-glow-magenta);
    clip-path: none;
    overflow: visible;
  }
  [data-era="neon"] .ew-card[data-variant="raised"] {
    border-color: var(--ew-color-cyan);
    background: var(--ew-color-bg-elevated);
    box-shadow: var(--ew-glow-cyan);
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
  [data-era="neon"] .ew-card__header h2,
  [data-era="neon"] .ew-card__header h3 {
    font-family: var(--ew-font-display);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ew-color-fg-default);
  }
  [data-era="neon"] .ew-card__header::after {
    content: "" / "";
    display: block;
    height: 2px;
    margin-top: 12px;
    background: linear-gradient(90deg, var(--ew-color-magenta), var(--ew-color-cyan), transparent);
    box-shadow: 0 0 8px color-mix(in oklch, var(--ew-color-magenta) 50%, transparent);
  }

  /* Buttons — wedge border via mask + glow tube */
  [data-era="neon"] .ew-button {
    position: relative;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
    font-family: var(--ew-font-body);
    border-radius: 0;
    border: 2px solid var(--ew-color-magenta);
    box-shadow: var(--ew-glow-magenta);
    clip-path: none;
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
    border-color: var(--ew-color-cyan);
    background: transparent;
    color: var(--ew-color-cyan);
    box-shadow: var(--ew-glow-cyan);
  }
  [data-era="neon"] .ew-button[data-variant="secondary"]::after {
    background-color: var(--ew-color-cyan);
  }
  [data-era="neon"] .ew-button[data-variant="ghost"] {
    border-color: transparent;
    box-shadow: none;
  }
  [data-era="neon"] .ew-button[data-variant="ghost"]::after { display: none; }

  /* Fields */
  [data-era="neon"] .ew-text-field__label,
  [data-era="neon"] .ew-select__label,
  [data-era="neon"] .ew-textarea__label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11px;
    font-weight: 700;
  }
  [data-era="neon"] .ew-text-field__control,
  [data-era="neon"] .ew-select__control,
  [data-era="neon"] .ew-select__trigger,
  [data-era="neon"] .ew-textarea__control {
    border-radius: 0;
    border: 2px solid var(--ew-color-cyan);
    background: var(--ew-color-field-bg);
    box-shadow: 0 0 10px color-mix(in oklch, var(--ew-color-cyan) 35%, transparent);
  }
  [data-era="neon"] .ew-text-field__control:focus-visible,
  [data-era="neon"] .ew-select__trigger:focus-visible {
    outline: 2px solid var(--ew-color-field-focus);
    outline-offset: 2px;
  }

  /* Checkbox / radio / switch — thumbs ≥3:1 */
  [data-era="neon"] .ew-checkbox__box,
  [data-era="neon"] .ew-radio__disc {
    border-radius: 0;
    border: 2px solid var(--ew-color-cyan);
    background: var(--ew-color-field-bg);
    box-shadow: 0 0 8px color-mix(in oklch, var(--ew-color-cyan) 35%, transparent);
  }
  [data-era="neon"] .ew-radio__disc { border-radius: 999px; }
  [data-era="neon"] .ew-switch__track {
    border-radius: 0;
    border: 2px solid var(--ew-color-border-strong);
    background: var(--ew-color-track-off);
  }
  [data-era="neon"] .ew-switch__thumb {
    border-radius: 0;
    background: var(--ew-color-fg-default);
    box-shadow: 0 0 6px color-mix(in oklch, var(--ew-color-cyan) 40%, transparent);
  }
  [data-era="neon"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-fg-inverse);
  }

  /* Dialog */
  [data-era="neon"] .ew-dialog {
    border: 2px solid var(--ew-color-magenta);
    border-radius: 0;
    background: var(--ew-color-bg-elevated);
    box-shadow: var(--ew-glow-magenta), var(--ew-structure-dialog-shadow);
    position: relative;
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
  }

  /* Tabs — glowing underline on active */
  [data-era="neon"] .ew-tabs [role="tablist"],
  [data-era="neon"] ew-tabs [role="tablist"] {
    border-bottom: 1px solid color-mix(in oklch, var(--ew-color-cyan) 45%, transparent);
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
    box-shadow: 0 4px 12px color-mix(in oklch, var(--ew-color-cyan) 45%, transparent);
    background: transparent;
    text-shadow: 0 0 8px color-mix(in oklch, var(--ew-color-cyan) 45%, transparent);
  }
  /* Light mode: cyan-on-dusk fails AA at 13px — use ink plate + magenta underline */
  [data-era="neon"][data-mode="light"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="neon"][data-mode="light"] ew-tabs [role="tab"][aria-selected="true"] {
    color: var(--ew-color-fg-default);
    border-bottom-color: var(--ew-color-magenta);
    background: color-mix(in oklch, var(--ew-color-bg-elevated) 88%, var(--ew-color-magenta));
    text-shadow: none;
    box-shadow: 0 4px 10px color-mix(in oklch, var(--ew-color-magenta) 28%, transparent);
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
    box-shadow: 0 0 10px color-mix(in oklch, var(--ew-color-magenta) 50%, transparent);
  }
  [data-era="neon"] .ew-tooltip__tip {
    border-radius: 0;
    border: 1px solid var(--ew-color-cyan);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: var(--ew-glow-cyan);
    font-size: 11px;
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
    background: color-mix(in oklch, var(--ew-color-magenta) 22%, var(--ew-color-bg-elevated));
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
    padding: 36px 20px 28px;
    border: 2px solid var(--ew-color-cyan);
    background: var(--ew-color-bg-surface);
    box-shadow: var(--ew-glow-cyan);
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
    background: var(--ew-gradient-chrome);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: var(--ew-color-cyan);
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
      color-mix(in oklch, var(--ew-color-fg-default) 3.5%, transparent) 3px 4px
    );
    opacity: 0.5;
  }

  /* Mute costume ornament under whisper/default */
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
    [data-era="neon"] .ew-chrome {
      background: none;
      -webkit-text-fill-color: CanvasText;
      color: CanvasText;
      -webkit-text-stroke: 0;
      filter: none;
    }
  }
`;
}
