/** Swiss International and Bauhaus decorator CSS. Costume is the default. */
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
  return `
  [data-era="bauhaus"] .ew-hero{display:grid;align-items:center;min-height:clamp(360px,56vw,710px);position:relative;isolation:isolate;overflow:hidden;padding:clamp(2rem,5vw,5rem);background:linear-gradient(var(--ew-color-fg-default),var(--ew-color-fg-default)) 0 0 / 100% 16px no-repeat,linear-gradient(var(--ew-color-fg-default),var(--ew-color-fg-default)) 0 100% / 100% 16px no-repeat,linear-gradient(var(--ew-color-fg-default),var(--ew-color-fg-default)) 100% 62% / 16% 14px no-repeat}
  [data-era="bauhaus"] .ew-hero__panel{position:relative;z-index:1;width:min(100%,1100px);margin-inline:auto;display:grid;grid-template-columns:minmax(0,8fr) minmax(0,4fr)}
  [data-era="bauhaus"] .ew-hero__content{grid-column:1;min-width:0;position:relative;z-index:2;padding-left:1.75rem}
  [data-era="bauhaus"] .ew-hero__title{font:700 clamp(3.8rem,10vw,10rem)/.86 var(--ew-font-display);text-transform:lowercase;letter-spacing:-.07em;max-width:9ch;overflow-wrap:normal;margin:.15em 0 .25em}
  [data-era="bauhaus"] .ew-hero__subtitle{font-size:clamp(1rem,1.8vw,1.45rem);line-height:1.45;max-width:35ch}
  [data-era="bauhaus"] .ew-script{font:700 .8rem/1.4 var(--ew-font-body);text-transform:uppercase;letter-spacing:.14em}
  [data-era="bauhaus"] .ew-hero__backdrop::before{content:"";position:absolute;left:64%;bottom:9%;width:min(15vw,148px);aspect-ratio:1;background:var(--ew-color-fg-default);clip-path:polygon(50% 0,100% 100%,0 100%)}
  [data-era="bauhaus"] .ew-hero__backdrop::after{content:"bauhaus";position:absolute;left:.45rem;bottom:2.8rem;transform:rotate(-90deg);transform-origin:left bottom;font:700 .72rem/1 var(--ew-font-display);letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;color:var(--ew-color-fg-default)}
  [data-era="bauhaus"] .ew-hero__stage{position:absolute;inset:0;pointer-events:none;overflow:hidden;background:linear-gradient(90deg,transparent 0 77%,var(--ew-color-primary-yellow) 77% 84%,transparent 84%)}
  [data-era="bauhaus"] .ew-hero__stage::before{content:"";position:absolute;right:-7%;top:-17%;width:min(54vw,510px);aspect-ratio:1;border-radius:50%;background:var(--ew-color-primary-red)}
  [data-era="bauhaus"] .ew-hero__stage::after{content:"";position:absolute;right:8%;bottom:-10%;width:min(26vw,290px);height:min(36vw,370px);transform:rotate(34deg);background:var(--ew-color-primary-blue)}
  [data-era="bauhaus"] .ew-card{border:2px solid var(--ew-color-fg-default);border-radius:0;background-image:none;box-shadow:none}
  [data-era="bauhaus"] .ew-card[data-variant="raised"]{box-shadow:5px 5px 0 var(--ew-color-fg-default)}
  [data-era="bauhaus"] .ew-card__header{border-bottom:2px solid var(--ew-color-fg-default)}
  [data-era="bauhaus"] .ew-button{border:2px solid var(--ew-color-fg-default);border-radius:0;box-shadow:none}
  [data-era="bauhaus"] .ew-button[data-variant="secondary"]{background:transparent;color:var(--ew-color-fg-default);border-color:var(--ew-color-fg-default)}
  [data-era="bauhaus"] .ew-text-field__control,[data-era="bauhaus"] .ew-select__trigger,[data-era="bauhaus"] .ew-textarea__control{border-radius:0}
  [data-era="bauhaus"] .ew-tabs [role="tab"][aria-selected="true"]{border-bottom:4px solid var(--ew-color-action-bg)}
  :is([data-era="bauhaus"][data-fidelity-band="whisper"],[data-fidelity-band="whisper"] [data-era="bauhaus"]) .ew-hero{min-height:260px;padding-block:2rem;background:none}
  :is([data-era="bauhaus"][data-fidelity-band="whisper"],[data-fidelity-band="whisper"] [data-era="bauhaus"]) .ew-hero__stage,:is([data-era="bauhaus"][data-fidelity-band="whisper"],[data-fidelity-band="whisper"] [data-era="bauhaus"]) .ew-hero__backdrop::before,:is([data-era="bauhaus"][data-fidelity-band="whisper"],[data-fidelity-band="whisper"] [data-era="bauhaus"]) .ew-hero__backdrop::after{display:none}
  :is([data-era="bauhaus"][data-fidelity-band="standard"],[data-fidelity-band="standard"] [data-era="bauhaus"],[data-era="bauhaus"][data-fidelity-band="default"],[data-fidelity-band="default"] [data-era="bauhaus"],[data-era="bauhaus"][data-fidelity-band="signature"],[data-fidelity-band="signature"] [data-era="bauhaus"]) .ew-hero{background:none}
  :is([data-era="bauhaus"][data-fidelity-band="standard"],[data-fidelity-band="standard"] [data-era="bauhaus"],[data-era="bauhaus"][data-fidelity-band="default"],[data-fidelity-band="default"] [data-era="bauhaus"],[data-era="bauhaus"][data-fidelity-band="signature"],[data-fidelity-band="signature"] [data-era="bauhaus"]) .ew-hero__backdrop::before,:is([data-era="bauhaus"][data-fidelity-band="standard"],[data-fidelity-band="standard"] [data-era="bauhaus"],[data-era="bauhaus"][data-fidelity-band="default"],[data-fidelity-band="default"] [data-era="bauhaus"],[data-era="bauhaus"][data-fidelity-band="signature"],[data-fidelity-band="signature"] [data-era="bauhaus"]) .ew-hero__backdrop::after{display:none}
  @media(max-width:700px){[data-era="bauhaus"] .ew-hero{padding:1.5rem;min-height:320px}[data-era="bauhaus"] .ew-hero__panel{grid-template-columns:minmax(0,1fr)}[data-era="bauhaus"] .ew-hero__content{max-width:none;padding-left:1.35rem}[data-era="bauhaus"] .ew-hero__title{font-size:clamp(2.5rem,10vw,4.4rem);max-width:11ch;overflow-wrap:normal}[data-era="bauhaus"] .ew-hero__subtitle{max-width:17rem}[data-era="bauhaus"] .ew-hero__backdrop::before{left:auto;right:.6rem;top:4.6rem;bottom:auto;width:68px}[data-era="bauhaus"] .ew-hero__stage{background:linear-gradient(to top,var(--ew-color-primary-yellow) 0 22px,transparent 22px)}[data-era="bauhaus"] .ew-hero__stage::before{right:-18%;top:auto;bottom:36px;width:min(42vw,168px);opacity:1;background:var(--ew-color-primary-red)}[data-era="bauhaus"] .ew-hero__stage::after{right:-8%;bottom:8%;opacity:1}[data-era="bauhaus"] .ew-hero__backdrop::after{letter-spacing:.2em}}
`;
}
