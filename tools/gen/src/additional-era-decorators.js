import { muteBandSel, bandSel } from './band.js';

/* Original graphic ornaments, generated per era; no image or font dependencies. */
const svg = (body) => 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">'+body+'</svg>') + '")';
const botanical = svg('<path fill="#24583c" d="M2 79Q24 11 65 8Q70 39 33 63Q83 31 118 45Q97 72 55 75Z"/><path fill="#d95380" d="M122 43Q102 20 128 11Q143 -6 158 12Q186 2 187 25Q211 38 188 53Q173 77 153 59Q129 72 122 43Z"/><path fill="#f0d331" d="M147 27Q167 14 172 35Q172 48 155 48Q140 45 147 27Z"/><path fill="#24583c" d="M202 80Q184 48 239 31Q241 64 218 80Z"/>');
const foliage = svg('<path d="M0 74Q42 26 83 57T161 54T240 64" fill="none" stroke="#b08b4c" stroke-width="2"/><g fill="#82904d"><path d="M20 55Q6 31 31 24Q46 42 20 55ZM52 51Q63 24 82 37Q81 54 52 51ZM139 54Q120 27 143 22Q165 41 139 54ZM191 48Q207 19 223 34Q225 52 191 48Z"/></g><g fill="#e6c06d"><circle cx="101" cy="19" r="2"/><circle cx="174" cy="13" r="3"/><path d="M113 4Q94 30 123 30Q105 38 100 23Q96 12 113 4Z"/></g>');
const speed = svg('<path fill="#ad2634" d="M0 58L240 5V22L0 75Z"/><path fill="#14637a" d="M57 80L240 33V45L99 80Z"/><path fill="#22272b" d="M156 80L240 54V62L187 80Z"/>');
const liquid = svg('<path fill="#cc416e" d="M0 17C60 -16 69 78 128 40S192 5 240 23V80H0Z"/><path fill="#f0ad3c" d="M0 30C66 -1 69 90 133 51S198 18 240 38V80H0Z"/><path fill="#25847e" d="M0 43C66 12 73 100 138 65S203 29 240 52V80H0Z"/>');
const rule = (id, art) => `
  [data-era="${id}"] .ew-card { position: relative; }
  [data-era="${id}"] .ew-card__header { border-block-end: 1px solid var(--ew-color-border-subtle); }
  [data-era="${id}"] .ew-hero__stage { background-image: ${art}; background-repeat: no-repeat; background-size: min(65%, 420px) auto; background-position: right bottom; pointer-events: none; }
  ${muteBandSel(id, ' .ew-hero__stage')} { background-image: none; }
  ${bandSel(id, 'whisper', ' .ew-card__header')} { border-block-end-color: transparent; }
  [data-era="${id}"] .ew-switch__track { border: 1px solid var(--ew-color-border-strong); }
  [data-era="${id}"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb { background: var(--ew-color-fg-default); }
`;
export function additionalEraCss(id) {
  if (id === 'nordic') return rule(id, botanical) + `
  [data-era="nordic"][data-dialect="minimal"] .ew-hero__stage { background-image: none; }
  [data-era="nordic"][data-dialect="minimal"] .ew-card { border-radius: 6px; }
  [data-era="nordic"][data-dialect="folk"] .ew-hero__stage { background-image: ${foliage}; }
  ${muteBandSel(id, ' .ew-hero__stage')} { background-image: none; }
  `;
  if (id === 'futurist') return rule(id, speed) + `
  [data-era="futurist"] .ew-card__header { border-block-start: 3px solid var(--ew-color-action-bg); }
  [data-era="futurist"][data-dialect="typographic"] .ew-hero__stage { background-image: none; }
  [data-era="futurist"][data-dialect="aero"] :is(.ew-card,.ew-dialog,.ew-button) { border-radius: 12px 3px 12px 3px; }
  `;
  if (id === 'folklore') return rule(id, foliage) + `
  [data-era="folklore"] .ew-card { border-radius: 18px 13px 19px 12px; }
  [data-era="folklore"][data-dialect="cottage"] .ew-hero__stage { background-image: ${botanical}; }
  [data-era="folklore"][data-dialect="traditional"] .ew-card { border-radius: 6px; border-style: double; border-width: 3px; }
  ${muteBandSel(id, ' .ew-hero__stage')} { background-image: none; }
  `;
  if (id === 'mcm-atomic') return `
  [data-era="mcm-atomic"][data-dialect="organic"] { --ew-structure-surface-radius: 26px; --ew-structure-button-shadow: none; --ew-structure-card-shadow: none; }
  [data-era="mcm-atomic"][data-dialect="organic"] .ew-hero__stage { background: ${foliage} right bottom / 70% auto no-repeat; }
  [data-era="mcm-atomic"][data-dialect="organic"] .ew-hero__stage:empty::before,
  [data-era="mcm-atomic"][data-dialect="organic"] .ew-hero__stage:empty::after,
  [data-era="mcm-atomic"][data-dialect="organic"] .ew-card::before { display: none; }
  ${muteBandSel(id, '[data-dialect="organic"] .ew-hero__stage')} { background: none; }
  `;
  if (id === 'deco') return `
  [data-era="deco"][data-dialect="riviera"] .ew-hero__backdrop { background: linear-gradient(165deg, #265b85 0 48%, #d3a354 48% 65%, #346b58 65% 100%); }
  [data-era="deco"][data-dialect="riviera"] .ew-hero__fan { display: none; }
  [data-era="deco"][data-dialect="riviera"] .ew-card { border-radius: 4px; }
  ${muteBandSel(id, '[data-dialect="riviera"] .ew-hero__backdrop')} { background: none; }
  `;
  if (id === 'groovy') return `
  [data-era="groovy"][data-dialect="liquid"] .ew-hero__stage { background: ${liquid} center bottom / 100% auto no-repeat; }
  [data-era="groovy"][data-dialect="liquid"] .ew-card::before { background-image: ${liquid}; background-size: cover; }
  ${muteBandSel(id, '[data-dialect="liquid"] .ew-hero__stage')} { background: none; }
  ${muteBandSel(id, '[data-dialect="liquid"] .ew-card::before')} { background-image: none; }
  `;
  if (id === 'memphis') return `
  [data-era="memphis"][data-dialect="new-wave"] .ew-card { border-radius: 0; box-shadow: none; }
  [data-era="memphis"][data-dialect="new-wave"] .ew-card__header { border-inline-start: 5px solid var(--ew-color-action-bg); padding-inline-start: 1rem; }
  [data-era="memphis"][data-dialect="new-wave"] :is(.ew-hero,.ew-hero__stage)::before,
  [data-era="memphis"][data-dialect="new-wave"] :is(.ew-hero,.ew-hero__stage)::after { display: none; }
  `;
  return '';
}
