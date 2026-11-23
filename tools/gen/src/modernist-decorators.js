/** Swiss International and Bauhaus decorator CSS. Costume is the default. */
import { bandSel } from './band.js';

export function modernistDecoratorCss(id) {
  if (id === 'swiss') return swissCss();
  if (id === 'bauhaus') return bauhausCss();
  return '';
}

function swissCss() {
  return `
  [data-era="swiss"] .ew-hero{display:grid;align-items:center;min-height:clamp(340px,55vw,670px);position:relative;isolation:isolate;padding:clamp(2rem,5vw,5rem);border-block:2px solid var(--ew-color-fg-default)}
  [data-era="swiss"] .ew-hero__panel{position:relative;z-index:1;width:min(100%,1120px);margin-inline:auto;display:grid;grid-template-columns:repeat(12,minmax(0,1fr))}
  [data-era="swiss"] .ew-hero__content{grid-column:3/-1;min-width:0}
  [data-era="swiss"] .ew-hero__title{font-family:var(--ew-font-display);font-size:clamp(3.25rem,9.3vw,9.5rem);font-weight:700;line-height:.9;letter-spacing:-.03em;max-width:11ch;overflow-wrap:anywhere;margin:.12em 0 .3em}
  [data-era="swiss"] .ew-hero__subtitle{font-size:clamp(1rem,1.8vw,1.45rem);line-height:1.45;max-width:42ch}
  [data-era="swiss"] .ew-script{font:700 .82rem/1.4 var(--ew-font-body);text-transform:uppercase;letter-spacing:.1em}
  [data-era="swiss"] .ew-hero__stage{position:absolute;inset:0 auto 0 10%;width:2px;background:var(--ew-color-action-bg);pointer-events:none}
  [data-era="swiss"] .ew-hero__stage::after{content:"";position:absolute;top:0;left:0;width:clamp(12px,2vw,30px);height:clamp(30px,7vw,100px);background:var(--ew-color-action-bg)}
  [data-era="swiss"] h2,[data-era="swiss"] .ew-section-heading{font-family:var(--ew-font-display);font-size:clamp(2.8rem,6.4vw,5.6rem);font-weight:700;line-height:.9;letter-spacing:-.03em;text-align:left}
  [data-era="swiss"] .ew-card{border-radius:0;box-shadow:none;background-image:none}
  [data-era="swiss"] .ew-card[data-variant="raised"]{border-top:3px solid var(--ew-color-action-bg);box-shadow:none}
  [data-era="swiss"] .ew-card__header{border-bottom:1px solid var(--ew-color-border-subtle)}
  [data-era="swiss"] .ew-button{border-radius:0;box-shadow:none}
  [data-era="swiss"] .ew-text-field__control,[data-era="swiss"] .ew-select__trigger,[data-era="swiss"] .ew-textarea__control{border-radius:0}
  [data-era="swiss"] .ew-tabs [role="tab"][aria-selected="true"]{border-bottom:3px solid var(--ew-color-action-bg)}
  :is([data-era="swiss"][data-fidelity-band="whisper"],[data-fidelity-band="whisper"] [data-era="swiss"]) .ew-hero{min-height:250px;padding-block:2rem}
  :is([data-era="swiss"][data-fidelity-band="whisper"],[data-fidelity-band="whisper"] [data-era="swiss"]) .ew-hero__stage{display:none}
  :is([data-era="swiss"][data-fidelity-band="standard"],[data-fidelity-band="standard"] [data-era="swiss"],[data-era="swiss"][data-fidelity-band="default"],[data-fidelity-band="default"] [data-era="swiss"],[data-era="swiss"][data-fidelity-band="signature"],[data-fidelity-band="signature"] [data-era="swiss"]) .ew-hero__title{font-size:clamp(3.25rem,7vw,7rem)}
  @media(max-width:700px){[data-era="swiss"] .ew-hero{padding:1.5rem;min-height:320px}[data-era="swiss"] .ew-hero__content{grid-column:2/-1}[data-era="swiss"] .ew-hero__title{font-size:clamp(3.1rem,12vw,6rem);letter-spacing:-.03em}}
`;
}

function bauhausCss() {
  const whisper = (rest = '') => bandSel('bauhaus', 'whisper', rest);
  const standard = (rest = '') => bandSel('bauhaus', ['standard', 'default', 'signature'], rest);
  /* The sheet is the page. A vertical ink spine divides type from construction.
     Right of the spine: red square (plane), blue circle cropped to a semicircle
     under that plane, yellow triangle with its right angle on the spine.
     Itten's correspondence, shared edges, no free-floating stickers. */
  return `
  [data-era="bauhaus"] {
    --ew-bauhaus-ink: #1a1408;
    --ew-bauhaus-spine: 64%;
  }
  [data-era="bauhaus"] :is(h1, h2, h3, .ew-section-heading) {
    font-family: var(--ew-font-display);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 0.92;
    text-transform: lowercase;
  }
  [data-era="bauhaus"] :is(h2, .ew-section-heading) {
    font-size: clamp(2rem, 4.4vw, 3.5rem);
  }
  [data-era="bauhaus"] :is(h2, .ew-section-heading)::before {
    content: "";
    display: inline-block;
    width: 0.38em;
    height: 0.38em;
    margin-right: 0.28em;
    background: var(--ew-color-primary-red);
    vertical-align: 0.06em;
  }
  [data-era="bauhaus"] .ew-hero {
    display: grid;
    align-items: center;
    min-height: clamp(440px, 60vw, 700px);
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: clamp(2rem, 5vw, 4.5rem);
    background-color: transparent;
    background-image:
      linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default)),
      linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default)),
      linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default));
    background-size: 100% 12px, 100% 12px, 12px 100%;
    background-position: 0 0, 0 100%, var(--ew-bauhaus-spine) 0;
    background-repeat: no-repeat;
  }
  [data-era="bauhaus"] .ew-hero__backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  [data-era="bauhaus"] .ew-hero__backdrop::after {
    content: "bauhaus";
    position: absolute;
    left: 1.6rem;
    bottom: 1.7rem;
    transform: rotate(-90deg);
    transform-origin: left bottom;
    font: 700 0.68rem/1 var(--ew-font-display);
    letter-spacing: 0.34em;
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--ew-color-fg-default);
  }
  [data-era="bauhaus"] .ew-hero__stage {
    position: absolute;
    top: 12px;
    right: 0;
    bottom: 12px;
    left: calc(var(--ew-bauhaus-spine) + 12px);
    pointer-events: none;
    overflow: hidden;
    background-image:
      linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default)),
      linear-gradient(var(--ew-color-primary-red), var(--ew-color-primary-red));
    background-size: 15% 14%, 100% 62%;
    background-position: 0 58%, 0 0;
    background-repeat: no-repeat;
  }
  [data-era="bauhaus"] .ew-hero__stage::before {
    content: "";
    position: absolute;
    width: 92%;
    aspect-ratio: 1;
    right: -28%;
    top: 62%;
    border-radius: 50%;
    background: var(--ew-color-primary-blue);
    transform: translateY(-50%);
    clip-path: inset(50% 0 0 0);
  }
  [data-era="bauhaus"] .ew-hero__stage::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 56%;
    height: 36%;
    background: var(--ew-color-primary-yellow);
    clip-path: polygon(0 0, 0 100%, 100% 100%);
  }
  [data-era="bauhaus"] .ew-hero__panel {
    position: relative;
    z-index: 1;
    width: min(100%, 1120px);
    margin-inline: auto;
  }
  [data-era="bauhaus"] .ew-hero__content {
    position: relative;
    z-index: 2;
    max-width: min(38rem, 58%);
    padding-left: 1.15rem;
  }
  [data-era="bauhaus"] .ew-hero__title {
    font-family: var(--ew-font-display);
    font-weight: 700;
    font-size: clamp(2.9rem, 6.6vw, 6.6rem);
    line-height: 0.84;
    letter-spacing: -0.042em;
    text-transform: lowercase;
    max-width: 12ch;
    overflow-wrap: normal;
    margin: 0.06em 0 0.22em;
  }
  [data-era="bauhaus"] .ew-hero__subtitle {
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    line-height: 1.45;
    max-width: 34ch;
    margin: 0;
  }
  [data-era="bauhaus"] .ew-hero__content .ew-button { margin-top: 1.15rem; }
  [data-era="bauhaus"] .ew-script {
    font-family: var(--ew-font-body);
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 1.3;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin: 0 0 0.85rem;
  }
  [data-era="bauhaus"] .ew-script::before {
    content: "";
    display: inline-block;
    width: 0.55rem;
    height: 0.55rem;
    margin-right: 0.55em;
    background: var(--ew-color-primary-yellow);
    vertical-align: -0.08em;
  }
  [data-era="bauhaus"] .ew-card {
    border: 2px solid var(--ew-color-fg-default);
    border-top-width: 0.7rem;
    border-radius: 0;
    background-image: none;
    box-shadow: none;
    overflow: visible;
  }
  [data-era="bauhaus"] .ew-card:nth-child(3n + 1) { border-top-color: var(--ew-color-primary-red); }
  [data-era="bauhaus"] .ew-card:nth-child(3n + 2) { border-top-color: var(--ew-color-primary-blue); }
  [data-era="bauhaus"] .ew-card:nth-child(3n + 3) { border-top-color: var(--ew-color-primary-yellow); }
  [data-era="bauhaus"] .ew-card[data-variant="raised"] {
    box-shadow: 6px 6px 0 var(--ew-color-fg-default);
  }
  [data-era="bauhaus"] .ew-card__header {
    border-bottom: 2px solid var(--ew-color-fg-default);
    padding-bottom: 0.65rem;
  }
  [data-era="bauhaus"] :is(.ew-button, .ew-icon-button) {
    border: 2px solid var(--ew-color-fg-default);
    border-radius: 0;
    box-shadow: none;
    font-family: var(--ew-font-display);
    letter-spacing: 0.12em;
  }
  [data-era="bauhaus"] .ew-button:active,
  [data-era="bauhaus"] .ew-icon-button:active { transform: none; }
  [data-era="bauhaus"] .ew-button[data-variant="secondary"] {
    background: transparent;
    color: var(--ew-color-fg-default);
    border-color: var(--ew-color-fg-default);
  }
  [data-era="bauhaus"] .ew-button[data-variant="secondary"]:hover {
    background: var(--ew-color-primary-yellow);
    color: var(--ew-bauhaus-ink);
    border-color: var(--ew-color-fg-default);
  }
  [data-era="bauhaus"] .ew-button[data-variant="danger"] {
    border-color: var(--ew-color-fg-default);
  }
  [data-era="bauhaus"] :is(.ew-text-field__control, .ew-select__trigger, .ew-textarea__control, .ew-select__control) {
    border-radius: 0;
    border-width: 2px;
  }
  [data-era="bauhaus"] :is(input, select, textarea):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]) {
    border-radius: 0;
  }
  [data-era="bauhaus"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="bauhaus"] ew-tabs [role="tab"][aria-selected="true"] {
    border-bottom: 4px solid var(--ew-color-action-bg);
  }
  [data-era="bauhaus"] :is(.ew-dialog, .ew-menu__panel, .ew-popover__panel) {
    border: 2px solid var(--ew-color-fg-default);
    border-radius: 0;
    border-inline-start-width: 8px;
    border-inline-start-color: var(--ew-color-primary-blue);
  }
  [data-era="bauhaus"] :is(.ew-toast, .ew-alert, .ew-tooltip__tip) { border-radius: 0; }
  [data-era="bauhaus"] a:not(.ew-button):not(.ew-icon-button) {
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-decoration-color: var(--ew-color-primary-red);
    text-underline-offset: 0.18em;
    color: inherit;
  }
  [data-era="bauhaus"] footer {
    border-top: 0;
    background-image:
      linear-gradient(var(--ew-color-primary-red), var(--ew-color-primary-red)),
      linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default));
    background-size: 22% 8px, 100% 8px;
    background-position: 0 0, 0 0;
    background-repeat: no-repeat;
    padding-top: 1.35rem;
  }
  ${whisper(' .ew-hero')} {
    min-height: 0;
    padding-block: 2rem;
    background: none;
  }
  ${whisper(' .ew-hero__stage')},
  ${whisper(' .ew-hero__backdrop::after')},
  ${whisper(' .ew-script::before')},
  ${whisper(' :is(h2, .ew-section-heading)::before')} { display: none; }
  ${whisper(' .ew-card')} {
    border-top-width: 2px;
    border-top-color: var(--ew-color-fg-default);
  }
  ${whisper(' :is(.ew-dialog, .ew-menu__panel, .ew-popover__panel)')} {
    border-inline-start-width: 2px;
    border-inline-start-color: var(--ew-color-fg-default);
  }
  ${whisper(' footer')} {
    background-image: none;
    border-top: 2px solid var(--ew-color-fg-default);
  }
  ${standard(' .ew-hero__stage')} {
    background-image: linear-gradient(var(--ew-color-primary-red), var(--ew-color-primary-red));
    background-size: 100% 100%;
    background-position: 0 0;
  }
  ${standard(' .ew-hero__stage::before')},
  ${standard(' .ew-hero__stage::after')},
  ${standard(' .ew-hero__backdrop::after')} { display: none; }
  ${standard(' .ew-card')} { border-top-color: var(--ew-color-primary-red); }
  ${standard(' footer')} {
    background-image: linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default));
    background-size: 100% 4px;
  }
  @media (max-width: 700px) {
    [data-era="bauhaus"] .ew-hero {
      align-items: start;
      min-height: 0;
      padding: 1.35rem 1.15rem 8.6rem 1.6rem;
      background-image:
        linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default)),
        linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default));
      background-size: 100% 10px, 100% 10px;
      background-position: 0 0, 0 100%;
    }
    [data-era="bauhaus"] .ew-hero__content {
      max-width: none;
      padding-left: 0.15rem;
    }
    [data-era="bauhaus"] .ew-hero__title {
      font-size: clamp(2.55rem, 12vw, 4rem);
      max-width: 11ch;
    }
    [data-era="bauhaus"] .ew-hero__subtitle { max-width: 28ch; }
    [data-era="bauhaus"] .ew-hero__stage {
      top: auto;
      left: 0;
      right: 0;
      bottom: 10px;
      height: 6.9rem;
      background-image:
        linear-gradient(var(--ew-color-fg-default), var(--ew-color-fg-default)),
        linear-gradient(var(--ew-color-primary-red), var(--ew-color-primary-red));
      background-size: 1.2rem 1.2rem, 40% 100%;
      background-position: 1rem 0.7rem, 0 0;
    }
    [data-era="bauhaus"] .ew-hero__stage::before {
      width: 8.4rem;
      right: -2.1rem;
      top: 50%;
      clip-path: none;
    }
    [data-era="bauhaus"] .ew-hero__stage::after {
      left: 33%;
      bottom: 0;
      width: 3.3rem;
      height: 4.4rem;
      clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }
    [data-era="bauhaus"] .ew-hero__backdrop::after { display: none; }
  }
`;
}
