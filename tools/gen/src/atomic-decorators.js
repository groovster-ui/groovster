import { muteBandSel } from './band.js';

/**
 * 8-point starburst SVG. Pass raw #hex — encodeURIComponent once; never pre-encode as %23.
 * @param {string} fill
 * @param {number} [scale] pointy-ness tweak via viewBox inset
 */
function starburstSvg(fill, scale = 1, stroke = '') {
  const s = 32;
  // Classic 8-point burst: long / short alternating rays
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const r = (i % 2 === 0 ? 30 : 12 * scale) * scale;
    pts.push(`${(s + Math.cos(a) * r).toFixed(2)},${(s + Math.sin(a) * r).toFixed(2)}`);
  }
  const strokeAttr = stroke
    ? ` stroke="${stroke}" stroke-width="5" stroke-linejoin="round" paint-order="stroke fill"`
    : '';
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${fill}">
      <polygon points="${pts.join(' ')}"${strokeAttr}/>
    </svg>`
  );
}

/** Starburst with "NEW!" text for badge. */
function starburstBadgeSvg(fill, ink) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <polygon fill="${fill}" points="40,2 46,28 72,18 52,40 72,62 46,52 40,78 34,52 8,62 28,40 8,18 34,28"/>
      <text x="40" y="44" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" textLength="18" lengthAdjust="spacingAndGlyphs" fill="${ink}">NEW!</text>
    </svg>`
  );
}

/** Atom: 3 elliptical orbits at 0/60/120° + nucleus. Pass raw #hex. */
function atomOrbitSvg(stroke, nucleus) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
      <g transform="translate(60 60)">
        <ellipse cx="0" cy="0" rx="48" ry="18" stroke="${stroke}" stroke-width="2.2" transform="rotate(0)"/>
        <ellipse cx="0" cy="0" rx="48" ry="18" stroke="${stroke}" stroke-width="2.2" transform="rotate(60)"/>
        <ellipse cx="0" cy="0" rx="48" ry="18" stroke="${stroke}" stroke-width="2.2" transform="rotate(120)"/>
        <circle cx="0" cy="0" r="8" fill="${nucleus}"/>
      </g>
    </svg>`
  );
}

/** Kidney / organic blob. */
function kidneySvg(fill) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 56" fill="${fill}">
      <path d="M8 28 C8 10 22 2 40 4 C58 6 72 14 74 28 C76 42 64 52 46 54 C28 56 18 48 12 40 C6 34 8 32 8 28 Z"/>
    </svg>`
  );
}

/** Boomerang / Formica scatter tile. Opacity is baked in so it can tile the root background. */
function boomerangSvg(stroke, opacity = 0.08) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <g opacity="${opacity}">
        <path d="M8 40 C18 18 34 10 52 12 C40 22 34 34 36 52 C28 42 18 40 8 40 Z" stroke="${stroke}" stroke-width="2.4" fill="none"/>
        <path d="M44 8 C52 22 54 36 48 52 C46 40 40 32 28 28 C36 20 42 12 44 8 Z" stroke="${stroke}" stroke-width="1.6" opacity="0.7" fill="none"/>
      </g>
    </svg>`
  );
}

/** Hairpin divider ●────● */
function hairpinSvg(ink) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 16" fill="none">
      <circle cx="8" cy="8" r="5" fill="${ink}"/>
      <line x1="18" y1="8" x2="142" y2="8" stroke="${ink}" stroke-width="2"/>
      <circle cx="152" cy="8" r="5" fill="${ink}"/>
    </svg>`
  );
}

/** Graduated 3-dot row. */
function dotsSvg(ink) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 16" fill="${ink}">
      <circle cx="10" cy="8" r="3"/>
      <circle cx="32" cy="8" r="5"/>
      <circle cx="54" cy="8" r="3"/>
    </svg>`
  );
}

/** Saul Bass–style angular cut-paper silhouette. */
function cutoutSvg(fill) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" fill="${fill}">
      <path d="M8 62 L28 18 L48 48 L62 12 L92 58 L70 72 L48 52 L32 72 Z"/>
    </svg>`
  );
}

/** Parabolic arch frame (LAX Theme Building silhouette). */
function archSvg(stroke) {
  return encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" fill="none" preserveAspectRatio="none">
      <path d="M20 150 Q200 -20 380 150" stroke="${stroke}" stroke-width="4" fill="none"/>
      <path d="M60 150 Q200 20 340 150" stroke="${stroke}" stroke-width="2.2" opacity="0.7" fill="none"/>
      <line x1="200" y1="40" x2="200" y2="150" stroke="${stroke}" stroke-width="2"/>
    </svg>`
  );
}

/* Raw hex → encodeURIComponent once */
const STAR_CORAL = starburstSvg('#B23A2A', 1);
const STAR_TEAL = starburstSvg('#0F6E6B', 1);
const STAR_MUSTARD = starburstSvg('#C4922A', 0.92);
const STAR_INK = starburstSvg('#2A2522', 0.85);
const STAR_CORAL_SM = starburstSvg('#B23A2A', 0.78);
const STAR_TEAL_LG = starburstSvg('#0F6E6B', 1.12);
const STAR_MUSTARD_SM = starburstSvg('#C4922A', 0.7);
const STAR_CORAL_LG = starburstSvg('#B23A2A', 1.18);
const STAR_CORAL_RING = starburstSvg('#B23A2A', 1.05, '#F3E9D2');
const STAR_CREAM = starburstSvg('#F3E9D2', 1);
const STAR_CREAM_SM = starburstSvg('#FFFBF3', 0.82);
const STAR_GOLD = starburstSvg('#E0B84A', 0.92);
const STAR_BADGE = starburstBadgeSvg('#B23A2A', '#FFFBF3');
const ATOM_TEAL = atomOrbitSvg('#0F6E6B', '#B23A2A');
const ATOM_INK = atomOrbitSvg('#2A2522', '#C4922A');
/* Cream orbits stay ≥3:1 on the teal object panel and on Googie night. */
const ATOM_PANEL = atomOrbitSvg('#F3E9D2', '#E0B84A');
const ATOM_ON_DARK = atomOrbitSvg('#F3E9D2', '#E0B84A');
const KIDNEY_TEAL = kidneySvg('#0F6E6B');
const KIDNEY_CORAL = kidneySvg('#B23A2A');
const BOOMERANG = boomerangSvg('#2A2522', 0.08);
const BOOMERANG_NIGHT = boomerangSvg('#F3E9D2', 0.16);
const HAIRPIN = hairpinSvg('#2A2522');
const HAIRPIN_LIGHT = hairpinSvg('#F3E9D2');
const DOTS = dotsSvg('#0F6E6B');
const CUTOUT = cutoutSvg('#2A2522');
const ARCH = archSvg('#2A2522');

/**
 * Full MCM Atomic decorator layer CSS — mid-century Googie / Formica.
 * Costume ON by default; whisper|standard|default|signature mute via muteBandSel.
 */
export function atomicDecoratorCss() {
  const mute = (rest) => muteBandSel('mcm-atomic', rest);

  return `  /* === MCM-ATOMIC: mid-century Googie — costume default; mute via whisper|standard === */

  [data-era="mcm-atomic"] {
    --ew-font-display: "League Spartan", Futura, sans-serif;
    --ew-font-body: "Work Sans", system-ui, sans-serif;
    --ew-font-script: "Yellowtail", cursive;
    --ew-font-display-alt: "Oswald", "League Spartan", sans-serif;
    --ew-font-mono: "Courier Prime", ui-monospace, monospace;
    --ew-ornament-star-1: url("data:image/svg+xml,${STAR_CORAL}");
    --ew-ornament-star-2: url("data:image/svg+xml,${STAR_TEAL}");
    --ew-ornament-star-3: url("data:image/svg+xml,${STAR_MUSTARD}");
    --ew-ornament-star-4: url("data:image/svg+xml,${STAR_INK}");
    --ew-ornament-star-5: url("data:image/svg+xml,${STAR_CORAL_SM}");
    --ew-ornament-star-6: url("data:image/svg+xml,${STAR_TEAL_LG}");
    --ew-ornament-star-7: url("data:image/svg+xml,${STAR_MUSTARD_SM}");
    --ew-ornament-star-8: url("data:image/svg+xml,${STAR_CORAL_LG}");
    --ew-ornament-star-coral-ring: url("data:image/svg+xml,${STAR_CORAL_RING}");
    --ew-ornament-star-cream: url("data:image/svg+xml,${STAR_CREAM}");
    --ew-ornament-star-cream-sm: url("data:image/svg+xml,${STAR_CREAM_SM}");
    --ew-ornament-star-gold: url("data:image/svg+xml,${STAR_GOLD}");
    --ew-ornament-star-badge: url("data:image/svg+xml,${STAR_BADGE}");
    --ew-ornament-atom: url("data:image/svg+xml,${ATOM_TEAL}");
    --ew-ornament-atom-ink: url("data:image/svg+xml,${ATOM_INK}");
    --ew-ornament-atom-panel: url("data:image/svg+xml,${ATOM_PANEL}");
    --ew-ornament-atom-on-dark: url("data:image/svg+xml,${ATOM_ON_DARK}");
    --ew-ornament-kidney-teal: url("data:image/svg+xml,${KIDNEY_TEAL}");
    --ew-ornament-kidney-coral: url("data:image/svg+xml,${KIDNEY_CORAL}");
    --ew-ornament-boomerang: url("data:image/svg+xml,${BOOMERANG}");
    --ew-ornament-boomerang-night: url("data:image/svg+xml,${BOOMERANG_NIGHT}");
    --ew-ornament-hairpin: url("data:image/svg+xml,${HAIRPIN}");
    --ew-ornament-hairpin-light: url("data:image/svg+xml,${HAIRPIN_LIGHT}");
    --ew-ornament-dots: url("data:image/svg+xml,${DOTS}");
    --ew-ornament-cutout: url("data:image/svg+xml,${CUTOUT}");
    --ew-ornament-arch: url("data:image/svg+xml,${ARCH}");
    --ew-atomic-tv-radius: 18px 18px 12px 12px;
    --ew-atomic-offset: 4px 4px 0 0 color-mix(in oklch, var(--ew-color-ink) 22%, transparent);
  }

  /* --- Formica boomerang page scatter (~8% baked into the tile) ---
     Painted on the era root so the canvas background covers the whole document.
     An absolute .ew-backdrop only fills the viewport unless some ancestor is
     position:relative; the root background does not need that. */
  [data-era="mcm-atomic"] {
    position: relative;
    background-image: var(--ew-ornament-boomerang);
    background-repeat: repeat;
    background-size: 112px 112px;
    background-attachment: scroll;
  }
  [data-era="mcm-atomic"][data-mode="dark"] {
    background-image: var(--ew-ornament-boomerang-night);
  }
  [data-era="mcm-atomic"] :is(.ew-shelf, .ew-media-card, .ew-card, .ew-list, .ew-toolbar, .ew-table, .ew-stat, .stream, .folio, .panes, .market) {
    background-color: var(--ew-color-bg-page);
    background-image: none;
  }
  [data-era="mcm-atomic"] .ew-backdrop,
  [data-era="mcm-atomic"].ew-backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    min-height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    background: none;
  }
  [data-era="mcm-atomic"] .ew-backdrop::before,
  [data-era="mcm-atomic"].ew-backdrop::before {
    content: none;
  }

  /* --- Hero: text block on the cream side, orbit/stars on the teal side.
     Columns from 881px up; stacked rows below so type never crosses the split. --- */
  [data-era="mcm-atomic"] .ew-hero {
    position: relative;
    z-index: 1;
    isolation: isolate;
    overflow: hidden;
    min-height: min(82vh, 780px);
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(220px, 0.85fr);
    align-items: stretch;
    padding: 0;
    background: var(--ew-color-bg-page);
    color: var(--ew-color-fg-default);
  }
  /* Backdrop is in the shared hero tree. Keep it out of the grid so it cannot take the text cell. */
  [data-era="mcm-atomic"] .ew-hero__backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  [data-era="mcm-atomic"] .ew-hero__stage {
    position: relative;
    grid-column: 2;
    grid-row: 1;
    z-index: 0;
    min-height: 100%;
    pointer-events: none;
    overflow: hidden;
  }
  /* Empty documented stage still draws a starburst and orbits. */
  [data-era="mcm-atomic"] .ew-hero__stage:empty::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 46%;
    width: min(280px, 72%);
    height: min(280px, 72%);
    transform: translate(-50%, -50%);
    z-index: 2;
    background: url("data:image/svg+xml,${STAR_CORAL}") center / contain no-repeat;
    pointer-events: none;
  }
  [data-era="mcm-atomic"] .ew-hero__stage:empty::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 46%;
    width: min(220px, 58%);
    height: min(220px, 58%);
    transform: translate(-50%, -50%);
    border: 2px solid color-mix(in oklch, var(--ew-color-teal, var(--ew-color-action-bg)) 75%, transparent);
    border-radius: 50%;
    box-shadow:
      0 0 0 22px color-mix(in oklch, var(--ew-color-mustard, var(--ew-color-accent-solid)) 35%, transparent),
      inset 0 0 0 14px color-mix(in oklch, var(--ew-color-coral, var(--ew-color-action-bg)) 28%, transparent);
    pointer-events: none;
  }
  /* Panel wraps the copy in the canonical tree. It occupies the text cell; direct .ew-hero__content still does when there is no panel. */
  [data-era="mcm-atomic"] .ew-hero__panel {
    position: relative;
    z-index: 2;
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    min-width: 0;
    margin: 0;
    padding: clamp(36px, 5vw, 72px) clamp(28px, 4vw, 64px);
    background: var(--ew-color-bg-page);
  }
  [data-era="mcm-atomic"] .ew-hero__panel .ew-hero__content {
    grid-column: auto;
    grid-row: auto;
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    background: transparent;
  }

  /* Diagonal two-tone lives only in the object column (cream shows through the cut). */
  [data-era="mcm-atomic"] .ew-hero__twotone {
    position: absolute;
    inset: 0;
    background: var(--ew-color-teal);
    clip-path: polygon(14% 0, 100% 0, 100% 100%, 0 100%);
    opacity: 1;
  }
  [data-era="mcm-atomic"][data-mode="dark"] .ew-hero__twotone {
    background: color-mix(in oklch, var(--ew-color-teal) 58%, var(--ew-color-bg-page));
  }

  /* 5–9 starbursts, all inside the object stage (cream/gold read on teal; coral has a cream ring) */
  [data-era="mcm-atomic"] .ew-hero__starbursts {
    position: absolute;
    inset: 0;
  }
  [data-era="mcm-atomic"] .ew-hero__starbursts::before,
  [data-era="mcm-atomic"] .ew-hero__starbursts::after {
    content: "" / "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  [data-era="mcm-atomic"] .ew-hero__starbursts::before {
    background:
      var(--ew-ornament-star-coral-ring) 72% 14% / 84px 84px no-repeat,
      var(--ew-ornament-star-cream) 32% 20% / 52px 52px no-repeat,
      var(--ew-ornament-star-gold) 84% 50% / 58px 58px no-repeat,
      var(--ew-ornament-star-cream-sm) 28% 72% / 40px 40px no-repeat,
      var(--ew-ornament-star-gold) 54% 82% / 34px 34px no-repeat;
    opacity: 1;
  }
  [data-era="mcm-atomic"] .ew-hero__starbursts::after {
    background:
      var(--ew-ornament-star-cream) 50% 10% / 30px 30px no-repeat,
      var(--ew-ornament-star-coral-ring) 22% 46% / 46px 46px no-repeat,
      var(--ew-ornament-star-cream-sm) 78% 78% / 38px 38px no-repeat;
    opacity: 0.95;
  }

  /* Parabolic arch frame — cream so it reads on the teal panel */
  [data-era="mcm-atomic"] .ew-hero__arch {
    position: absolute;
    left: 50%;
    bottom: 2%;
    width: min(520px, 108%);
    height: min(180px, 42%);
    transform: translateX(-50%);
    background-color: #F3E9D2;
    -webkit-mask: var(--ew-ornament-arch) center / 100% 100% no-repeat;
    mask: var(--ew-ornament-arch) center / 100% 100% no-repeat;
    opacity: 0.9;
  }

  /* Atom orbit — logo/spinner keep the teal mark; the hero orbit sits on the panel */
  [data-era="mcm-atomic"] .ew-orbit {
    position: absolute;
    left: 58%;
    top: 46%;
    width: min(240px, 70%);
    height: min(240px, 70%);
    transform: translate(-50%, -50%);
    background: var(--ew-ornament-atom) center / contain no-repeat;
    z-index: 1;
    opacity: 0.95;
  }
  [data-era="mcm-atomic"] .ew-hero__stage .ew-orbit {
    background-image: var(--ew-ornament-atom-panel);
  }
  [data-era="mcm-atomic"] .ew-orbit--logo {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    display: inline-block;
    width: 48px;
    height: 48px;
    vertical-align: middle;
  }
  [data-era="mcm-atomic"] .ew-orbit--empty {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    display: block;
    margin: 24px auto;
    width: 96px;
    height: 96px;
    opacity: 0.9;
    background: var(--ew-ornament-atom-ink) center / contain no-repeat;
  }
  [data-era="mcm-atomic"][data-mode="dark"] .ew-orbit--empty {
    background-image: var(--ew-ornament-atom-on-dark);
    opacity: 1;
  }
  [data-era="mcm-atomic"] .ew-orbit--spin {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    display: inline-block;
    width: 40px;
    height: 40px;
  }
  @media (prefers-reduced-motion: no-preference) {
    [data-era="mcm-atomic"] .ew-orbit--spin {
      animation: ew-atomic-spin 1.1s linear infinite;
    }
  }
  @keyframes ew-atomic-spin {
    to { transform: rotate(360deg); }
  }

  [data-era="mcm-atomic"] .ew-hero__content {
    position: relative;
    z-index: 2;
    grid-column: 1;
    grid-row: 1;
    text-align: start;
    max-width: none;
    width: auto;
    margin: 0;
    padding: clamp(36px, 5vw, 72px) clamp(28px, 4vw, 64px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background: var(--ew-color-bg-page);
  }
  @media (max-width: 880px) {
    [data-era="mcm-atomic"] .ew-hero {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      min-height: 0;
    }
    [data-era="mcm-atomic"] .ew-hero__content,
    [data-era="mcm-atomic"] .ew-hero__panel {
      grid-column: 1;
      grid-row: 1;
      padding: 40px 24px 28px;
    }
    [data-era="mcm-atomic"] .ew-hero__panel .ew-hero__content {
      padding: 0;
    }
    [data-era="mcm-atomic"] .ew-hero__stage {
      grid-column: 1;
      grid-row: 2;
      min-height: 240px;
    }
    [data-era="mcm-atomic"] .ew-hero__twotone {
      clip-path: polygon(0 16%, 100% 0, 100% 100%, 0 100%);
    }
  }

  /* Googie script + geometric caps */
  [data-era="mcm-atomic"] .ew-script {
    font-family: var(--ew-font-script);
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 400;
    line-height: 1;
    color: var(--ew-color-coral);
    text-transform: none;
    letter-spacing: 0.01em;
    display: inline-block;
    margin: 0 0 4px;
    transform: rotate(-4deg);
  }
  [data-era="mcm-atomic"] .ew-hero__title,
  [data-era="mcm-atomic"] .ew-hero h1 {
    font-family: var(--ew-font-display);
    font-weight: 700;
    font-size: clamp(40px, 5vw, 84px);
    line-height: 1.02;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0 0 16px;
    color: var(--ew-color-ink);
    max-width: 12ch;
  }
  [data-era="mcm-atomic"] .ew-hero__subtitle {
    font-family: var(--ew-font-body);
    font-size: clamp(15px, 2vw, 18px);
    letter-spacing: 0.04em;
    color: var(--ew-color-fg-muted);
    margin: 0 0 28px;
    max-width: 36em;
  }
  [data-era="mcm-atomic"] .ew-hero__cta {
    display: inline-flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  /* Section heading + starburst ornament */
  [data-era="mcm-atomic"] .ew-section-heading {
    font-family: var(--ew-font-display);
    font-weight: 700;
    font-size: clamp(24px, 3.5vw, 40px);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    margin: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: var(--ew-color-ink);
  }
  [data-era="mcm-atomic"] .ew-section-heading::before {
    content: "" / "";
    width: 28px;
    height: 28px;
    flex: none;
    background: var(--ew-ornament-star-3) center / contain no-repeat;
  }

  /* Motel roofline / canted section tops */
  [data-era="mcm-atomic"] .ew-section,
  [data-era="mcm-atomic"] .ew-section--roofline {
    position: relative;
    padding-top: 48px;
  }
  [data-era="mcm-atomic"] .ew-section--roofline::before,
  [data-era="mcm-atomic"] .ew-section::before {
    content: "" / "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 28px;
    background: var(--ew-color-teal);
    clip-path: polygon(0 100%, 0 40%, 100% 0, 100% 100%);
    pointer-events: none;
  }
  [data-era="mcm-atomic"] .ew-section--roofline::before {
    background: var(--ew-color-coral);
    clip-path: polygon(0 100%, 0 18%, 100% 55%, 100% 100%);
  }

  /* Starburst NEW! badge */
  [data-era="mcm-atomic"] .ew-badge-new {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background: var(--ew-ornament-star-badge) center / contain no-repeat;
    color: transparent;
    font-size: 0;
    line-height: 0;
    overflow: hidden;
    vertical-align: middle;
  }

  /* Hairpin + dots */
  [data-era="mcm-atomic"] .ew-hairpin {
    display: block;
    width: min(240px, 70%);
    height: 16px;
    margin: 20px auto;
    background: var(--ew-ornament-hairpin) center / contain no-repeat;
  }
  [data-era="mcm-atomic"][data-mode="dark"] .ew-hairpin {
    background-image: var(--ew-ornament-hairpin-light);
  }
  [data-era="mcm-atomic"] .ew-dots {
    display: block;
    width: 64px;
    height: 16px;
    margin: 12px auto;
    background: var(--ew-ornament-dots) center / contain no-repeat;
  }

  /* Optional: Saul Bass cutouts + Blue Note wordmark */
  [data-era="mcm-atomic"] .ew-cutout {
    display: inline-block;
    width: 100px;
    height: 80px;
    background: var(--ew-ornament-cutout) center / contain no-repeat;
  }
  [data-era="mcm-atomic"] .ew-wordmark {
    font-family: var(--ew-font-display-alt);
    font-weight: 700;
    font-size: clamp(64px, 14vw, 160px);
    line-height: 0.85;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: color-mix(in oklch, var(--ew-color-ink) 14%, transparent);
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
  }

  /* --- Cards: turquoise header, charcoal outline, TV radius, kidney corners --- */
  [data-era="mcm-atomic"] .ew-card {
    position: relative;
    border-radius: var(--ew-atomic-tv-radius);
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-bg-surface);
    box-shadow: var(--ew-atomic-offset);
    overflow: clip;
    padding: 0;
  }
  [data-era="mcm-atomic"] .ew-card[data-variant="raised"] {
    border-radius: 28px 28px 36px 20px / 24px 32px 22px 30px;
    box-shadow: 6px 6px 0 0 color-mix(in oklch, var(--ew-color-ink) 28%, transparent);
  }
  [data-era="mcm-atomic"] .ew-card::before,
  [data-era="mcm-atomic"] .ew-card::after {
    content: "" / "";
    position: absolute;
    width: 132px;
    height: 92px;
    pointer-events: none;
    z-index: 0;
    opacity: 1;
  }
  /* Kidneys sit in the card's bottom padding, inside the border box, clear of the type. */
  [data-era="mcm-atomic"] .ew-card::before {
    top: auto;
    bottom: 10px;
    left: 10px;
    width: 46px;
    height: 32px;
    background: var(--ew-color-teal);
    border-radius: 62% 38% 28% 72% / 48% 62% 38% 52%;
    transform: rotate(-18deg);
  }
  [data-era="mcm-atomic"] .ew-card::after {
    bottom: 10px;
    right: 10px;
    width: 42px;
    height: 30px;
    background: var(--ew-color-coral);
    border-radius: 38% 62% 70% 30% / 58% 42% 60% 40%;
    transform: rotate(16deg);
  }
  [data-era="mcm-atomic"] .ew-card__header {
    position: relative;
    z-index: 2;
    background: var(--ew-color-teal);
    color: var(--ew-color-fg-inverse, #fff);
    padding: var(--ew-card-pad, 14px) var(--ew-card-pad, 20px);
    border-radius: 16px 16px 0 0;
  }
  [data-era="mcm-atomic"] .ew-card__header h2,
  [data-era="mcm-atomic"] .ew-card__header h3 {
    font-family: var(--ew-font-display);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
    color: inherit;
  }
  [data-era="mcm-atomic"] .ew-card__body,
  [data-era="mcm-atomic"] .ew-card__footer {
    position: relative;
    z-index: 2;
    padding: var(--ew-card-pad, 16px) var(--ew-card-pad, 20px) 52px;
    background: transparent;
  }
  [data-era="mcm-atomic"] .ew-card > :not(.ew-card__header):not(.ew-card__body):not(.ew-card__footer) {
    position: relative;
    z-index: 1;
  }

  /* --- Buttons: coral primary + starburst; turquoise outline secondary; pill; hover lift --- */
  [data-era="mcm-atomic"] .ew-button {
    position: relative;
    border-radius: 999px;
    font-family: var(--ew-font-display);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-width: 2px;
    border-style: solid;
    border-color: var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-coral, var(--ew-color-action-bg));
    color: var(--ew-color-action-fg, #fff);
    box-shadow: var(--ew-atomic-offset);
    padding-inline: 22px;
    gap: 10px;
  }
  [data-era="mcm-atomic"] .ew-button:not([data-variant="secondary"]):not([data-variant="ghost"])::before {
    content: "" / "";
    display: inline-block;
    width: 14px;
    height: 14px;
    flex: none;
    background: var(--ew-ornament-star-3) center / contain no-repeat;
    filter: brightness(2);
  }
  [data-era="mcm-atomic"] .ew-button:hover {
    transform: translateY(-2px);
    background: var(--ew-color-action-hover, var(--ew-color-coral));
  }
  [data-era="mcm-atomic"] .ew-button:active {
    transform: translateY(0);
  }
  [data-era="mcm-atomic"] .ew-button[data-variant="secondary"] {
    background: transparent;
    color: var(--ew-color-teal);
    border-color: var(--ew-color-teal);
    box-shadow: none;
  }
  [data-era="mcm-atomic"] .ew-button[data-variant="secondary"]:hover {
    background: color-mix(in oklch, var(--ew-color-teal) 12%, transparent);
  }
  [data-era="mcm-atomic"] .ew-button[data-variant="ghost"] {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    color: var(--ew-color-fg-default);
  }

  /* --- Fields: white, 2px charcoal, turquoise small-caps label, mustard focus --- */
  [data-era="mcm-atomic"] .ew-text-field__label,
  [data-era="mcm-atomic"] .ew-select__label,
  [data-era="mcm-atomic"] .ew-textarea__label {
    font-family: var(--ew-font-display);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ew-color-teal);
  }
  [data-era="mcm-atomic"] .ew-text-field__control,
  [data-era="mcm-atomic"] .ew-select__control,
  [data-era="mcm-atomic"] .ew-select__trigger,
  [data-era="mcm-atomic"] .ew-textarea__control {
    border-radius: 12px;
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-field-bg, #fff);
    box-shadow: none;
  }
  [data-era="mcm-atomic"] .ew-text-field__control:focus-visible,
  [data-era="mcm-atomic"] .ew-select__trigger:focus-visible,
  [data-era="mcm-atomic"] .ew-textarea__control:focus-visible {
    outline: 2px solid var(--ew-color-field-focus, var(--ew-color-mustard));
    outline-offset: 2px;
    border-color: var(--ew-color-mustard);
  }

  /* Checkbox is a rounded square (control radius is a pill, which made this a radio).
     No offset shadow — that read as a second ring. */
  [data-era="mcm-atomic"] .ew-checkbox__box {
    border-radius: 4px;
    box-shadow: none;
    width: 20px;
    height: 20px;
  }
  [data-era="mcm-atomic"] .ew-checkbox__box::after {
    width: 10px;
    height: 6px;
    border-width: 0 0 2.5px 2.5px;
  }
  [data-era="mcm-atomic"] .ew-radio__control:not(:checked) + .ew-radio__disc,
  [data-era="mcm-atomic"] .ew-checkbox__control:not(:checked) + .ew-checkbox__box {
    border-width: 2px;
    border-style: solid;
    border-color: var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-field-bg, #fff);
    box-shadow: none;
  }
  [data-era="mcm-atomic"] .ew-checkbox__control:checked + .ew-checkbox__box {
    background: var(--ew-color-coral, var(--ew-color-action-bg));
    border-color: var(--ew-color-border-strong, var(--ew-color-ink));
    box-shadow: none;
  }
  [data-era="mcm-atomic"] .ew-checkbox__control:checked + .ew-checkbox__box::after {
    border-color: var(--ew-color-action-fg, #fff);
  }
  [data-era="mcm-atomic"] .ew-radio__control:checked + .ew-radio__disc {
    background: var(--ew-color-field-bg, #fff);
    border-color: var(--ew-color-border-strong, var(--ew-color-ink));
    box-shadow: inset 0 0 0 5px var(--ew-color-coral);
  }

  /* --- Switch: chunky pill + ball knob; coral on; off ≥3:1 vs card --- */
  [data-era="mcm-atomic"] .ew-switch__track {
    border-radius: 999px;
    min-width: 52px;
    height: 30px;
  }
  [data-era="mcm-atomic"] .ew-switch__thumb {
    border-radius: 999px;
    width: 22px;
    height: 22px;
  }
  [data-era="mcm-atomic"] .ew-switch__control:not(:checked) + .ew-switch__track {
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-field-bg, #fff);
  }
  [data-era="mcm-atomic"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-ink);
  }
  [data-era="mcm-atomic"] .ew-switch__control:checked + .ew-switch__track {
    background: var(--ew-color-track-on, var(--ew-color-coral));
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
  }
  [data-era="mcm-atomic"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-bg-elevated, #fff);
  }

  /* --- Tabs: pills on a hairpin rail that spans the tab row (not a detached ●──●) --- */
  [data-era="mcm-atomic"] .ew-tabs [role="tablist"],
  [data-era="mcm-atomic"] ew-tabs [role="tablist"] {
    position: relative;
    display: flex;
    justify-self: start;
    width: max-content;
    max-width: 100%;
    gap: 8px;
    padding: 6px 16px 18px;
    border-bottom: none;
    background: none;
  }
  [data-era="mcm-atomic"] .ew-tabs [role="tablist"]::after,
  [data-era="mcm-atomic"] ew-tabs [role="tablist"]::after {
    content: "" / "";
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 6px;
    height: 10px;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(circle at 5px 50%, var(--ew-color-ink) 4.5px, transparent 5px),
      radial-gradient(circle at calc(100% - 5px) 50%, var(--ew-color-ink) 4.5px, transparent 5px),
      linear-gradient(var(--ew-color-ink), var(--ew-color-ink)) center / calc(100% - 18px) 2px no-repeat;
  }
  [data-era="mcm-atomic"] .ew-tabs [role="tab"],
  [data-era="mcm-atomic"] ew-tabs [role="tab"],
  [data-era="mcm-atomic"] .ew-tabs[data-variant="pills"] [role="tab"],
  [data-era="mcm-atomic"] ew-tabs[data-variant="pills"] [role="tab"] {
    border-radius: 999px;
    font-family: var(--ew-font-display);
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 2px solid transparent;
    padding: 8px 16px;
    position: relative;
    z-index: 1;
  }
  [data-era="mcm-atomic"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="mcm-atomic"] ew-tabs [role="tab"][aria-selected="true"] {
    background: var(--ew-color-teal);
    color: var(--ew-color-fg-inverse, #fff);
    border-color: var(--ew-color-border-strong, var(--ew-color-ink));
    box-shadow: 2px 2px 0 0 color-mix(in oklch, var(--ew-color-ink) 20%, transparent);
  }

  /* --- Dialog: two-tone header + starburst crests --- */
  [data-era="mcm-atomic"] .ew-dialog {
    position: relative;
    border-radius: var(--ew-atomic-tv-radius);
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-bg-elevated);
    box-shadow: 8px 8px 0 0 color-mix(in oklch, var(--ew-color-ink) 28%, transparent);
    padding: 0;
    overflow: visible;
  }
  [data-era="mcm-atomic"] .ew-dialog::before {
    content: "" / "";
    display: block;
    height: 56px;
    margin: 0;
    border-radius: 16px 16px 0 0;
    background:
      var(--ew-ornament-star-1) 16px center / 28px 28px no-repeat,
      var(--ew-ornament-star-2) calc(100% - 16px) center / 28px 28px no-repeat,
      linear-gradient(
        100deg,
        var(--ew-color-teal) 0 52%,
        var(--ew-color-coral) 52% 100%
      );
  }
  [data-era="mcm-atomic"] .ew-dialog h2 {
    font-family: var(--ew-font-display);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 16px 24px 0;
    margin: 0;
  }
  [data-era="mcm-atomic"] .ew-dialog__body {
    padding: 8px 24px 0;
  }
  [data-era="mcm-atomic"] .ew-dialog__footer {
    padding: 16px 24px 24px;
  }

  /* --- Alert / toast / tooltip / breadcrumb / menu / select --- */
  [data-era="mcm-atomic"] .ew-alert {
    border-radius: var(--ew-atomic-tv-radius);
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-bg-surface);
    box-shadow: var(--ew-atomic-offset);
  }
  [data-era="mcm-atomic"] .ew-alert__title {
    font-family: var(--ew-font-display);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  [data-era="mcm-atomic"] .ew-toast {
    position: relative;
    border-radius: 999px;
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-bg-elevated);
    box-shadow: var(--ew-atomic-offset);
    padding-left: 40px;
  }
  [data-era="mcm-atomic"] .ew-toast::before {
    content: "" / "";
    position: absolute;
    left: 12px;
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
    background: var(--ew-ornament-star-1) center / contain no-repeat;
  }
  [data-era="mcm-atomic"] .ew-tooltip__tip {
    border-radius: 8px;
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    font-size: 12px;
    box-shadow: 2px 2px 0 0 color-mix(in oklch, var(--ew-color-ink) 18%, transparent);
  }
  [data-era="mcm-atomic"] .ew-breadcrumb {
    font-family: var(--ew-font-display);
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  [data-era="mcm-atomic"] .ew-breadcrumb__sep {
    color: var(--ew-color-coral);
  }
  [data-era="mcm-atomic"] .ew-select__list,
  [data-era="mcm-atomic"] .ew-menu__panel {
    border-radius: 12px;
    border: 2px solid var(--ew-color-border-strong, var(--ew-color-ink));
    box-shadow: var(--ew-atomic-offset);
    background: var(--ew-color-bg-elevated);
  }
  [data-era="mcm-atomic"] .ew-select__option,
  [data-era="mcm-atomic"] .ew-menu__item {
    border-radius: 8px;
  }
  [data-era="mcm-atomic"] .ew-select__option[aria-selected="true"],
  [data-era="mcm-atomic"] .ew-select__option.is-active,
  [data-era="mcm-atomic"] .ew-select__option:hover,
  [data-era="mcm-atomic"] .ew-menu__item:hover,
  [data-era="mcm-atomic"] .ew-menu__item:focus-visible {
    background: color-mix(in oklch, var(--ew-color-teal) 16%, var(--ew-color-bg-elevated));
    outline: 2px solid var(--ew-color-teal);
    outline-offset: -2px;
  }

  /* Mute costume ornament under whisper/standard/default/signature */
  ${mute(' .ew-hero__stage')},
  ${mute(' .ew-hero__twotone')},
  ${mute(' .ew-hero__starbursts')},
  ${mute(' .ew-hero__arch')},
  ${mute(' .ew-orbit')},
  ${mute(' .ew-orbit--logo')},
  ${mute(' .ew-orbit--empty')},
  ${mute(' .ew-orbit--spin')},
  ${mute(' .ew-script')},
  ${mute(' .ew-section-heading::before')},
  ${mute(' .ew-section::before')},
  ${mute(' .ew-section--roofline::before')},
  ${mute(' .ew-badge-new')},
  ${mute(' .ew-hairpin')},
  ${mute(' .ew-tabs [role="tablist"]::after')},
  ${mute(' ew-tabs [role="tablist"]::after')},
  ${mute(' .ew-dots')},
  ${mute(' .ew-cutout')},
  ${mute(' .ew-wordmark')},
  ${mute(' .ew-card::before')},
  ${mute(' .ew-card::after')},
  ${mute(' .ew-button::before')},
  ${mute(' .ew-dialog::before')},
  ${mute(' .ew-toast::before')},
  ${mute(' .ew-backdrop')},
  ${mute(' .ew-backdrop::before')},
  ${mute('.ew-backdrop')},
  ${mute('.ew-backdrop::before')} {
    display: none !important;
  }
  ${mute(' .ew-card')} {
    border-radius: var(--ew-structure-surface-radius, 24px);
  }
  ${mute(' .ew-card[data-variant="raised"]')} {
    border-radius: var(--ew-structure-surface-radius, 24px);
  }
  ${mute(' .ew-card__header')} {
    background: transparent;
    color: var(--ew-color-fg-default);
    border-radius: 0;
  }
  ${mute(' .ew-tabs [role="tablist"]')},
  ${mute(' ew-tabs [role="tablist"]')} {
    background: none;
  }
  ${mute(' .ew-dialog')} {
    border-radius: var(--ew-structure-dialog-radius, 28px);
  }

  ${mute(' .ew-hero__content')},
  ${mute(' .ew-hero__panel')} {
    grid-column: 1 / -1;
  }
  ${mute('')} {
    background-image: none;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-era="mcm-atomic"] .ew-orbit--spin {
      animation: ew-atomic-pulse 2.6s ease-in-out infinite !important;
    }
    [data-era="mcm-atomic"] .ew-button:hover {
      transform: none;
    }
  }
  @keyframes ew-atomic-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  @media (forced-colors: active) {
    [data-era="mcm-atomic"] .ew-hero {
      background: Canvas;
      color: CanvasText;
    }
    [data-era="mcm-atomic"] .ew-hero__stage,
    [data-era="mcm-atomic"] .ew-hero__twotone,
    [data-era="mcm-atomic"] .ew-hero__starbursts,
    [data-era="mcm-atomic"] .ew-hero__arch,
    [data-era="mcm-atomic"] .ew-orbit,
    [data-era="mcm-atomic"] .ew-script,
    [data-era="mcm-atomic"] .ew-card::before,
    [data-era="mcm-atomic"] .ew-card::after,
    [data-era="mcm-atomic"] .ew-button::before,
    [data-era="mcm-atomic"] .ew-dialog::before,
    [data-era="mcm-atomic"] .ew-toast::before,
    [data-era="mcm-atomic"] .ew-section::before,
    [data-era="mcm-atomic"] .ew-section--roofline::before,
    [data-era="mcm-atomic"] .ew-backdrop::before,
    [data-era="mcm-atomic"] .ew-cutout,
    [data-era="mcm-atomic"] .ew-wordmark {
      display: none;
    }
    [data-era="mcm-atomic"] .ew-card,
    [data-era="mcm-atomic"] .ew-button,
    [data-era="mcm-atomic"] .ew-dialog,
    [data-era="mcm-atomic"] .ew-alert,
    [data-era="mcm-atomic"] .ew-toast {
      border: 2px solid ButtonText;
      box-shadow: none;
    }
  }
`;
}
