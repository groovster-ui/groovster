import { muteBandSel, bandSel } from './band.js';

/* Original, self-contained print motifs. Deliberately not copies of reference artwork. */
const svg = (body) => 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160">'+body+'</svg>') + '")';

const bloom = svg('<path fill="#21503b" d="M0 160Q25 90 71 37Q91 88 31 126Q105 85 125 109Q97 151 55 160ZM320 160Q276 104 314 72Q329 110 298 133L320 160Z"/><path fill="#de5180" d="M26 154Q31 95 112 52L120 58Q57 105 58 160Z"/><path fill="#eacb23" d="M141 48L149 19L170 39L192 6L197 37L229 25L225 57L252 64L229 85L247 112L213 111L203 144L180 119L157 147L150 116L116 124L128 95L96 82L128 68L114 44Z"/><path fill="#cc452b" d="M149 69Q165 50 190 55Q216 59 217 81Q214 109 185 110Q154 111 146 88Z"/><g fill="#ee8bab"><path d="M159 78l4-5 6 2-1 6-6 2ZM181 64l5-2 3 6-4 4-5-3ZM193 84l5-5 6 4-1 6-6 1ZM170 94l4-3 6 4-2 6-6-1Z"/></g>');
const nordicFolk = svg('<path d="M16 150Q70 32 160 70Q250 31 304 150" fill="none" stroke="#986b3f" stroke-width="3"/><g fill="#45623a"><path d="M58 101Q9 77 35 46Q74 56 58 101ZM80 80Q74 36 115 32Q132 60 80 80ZM240 80Q205 35 236 30Q270 46 240 80ZM263 103Q255 61 293 49Q314 82 263 103Z"/></g><path fill="#b85c42" d="M160 92C121 64 131 28 160 50C189 28 199 64 160 92Z"/><path fill="#c7a14b" d="M159 90L154 126L165 126Z"/>');
const mechanical = svg('<path fill="#a62936" d="M0 121L320 8V45L0 150Z"/><path fill="#247b92" d="M57 160L320 63V81L101 160Z"/><path fill="#283338" d="M169 160L320 111V122L202 160Z"/><g fill="none" stroke="#d6a74d" stroke-width="3"><path d="M213 22l28-10M227 30l55-20M243 37l75-27"/></g>');
const aero = svg('<path fill="#247b92" d="M0 90H225Q281 90 320 40V73Q279 111 225 111H0Z"/><path fill="#a62936" d="M0 122H237Q292 122 320 93V108Q289 140 237 140H0Z"/><path fill="#d6a74d" d="M80 151H277L320 137V150L277 159H80Z"/>');
const woodland = svg('<path fill="#263746" d="M0 160V96L28 69L47 94L64 50L94 92L119 24L148 96L171 60L202 100L229 43L251 94L279 62L320 101V160Z"/><path fill="#718149" d="M0 160Q59 104 134 135Q188 151 244 121Q291 111 320 131V160Z"/><path fill="#ac5939" d="M7 158Q26 91 58 65Q45 116 24 158ZM285 160Q273 102 308 76Q300 123 301 160Z"/><path fill="#f0d5a1" d="M195 12Q173 55 219 57Q194 77 177 51Q165 30 195 12Z"/><g fill="#e8c477"><path d="M82 19l2 5 5 2-5 2-2 5-2-5-5-2 5-2ZM243 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><circle cx="133" cy="48" r="2"/><circle cx="275" cy="14" r="2"/></g><path d="M40 160Q58 122 80 113M42 145l-16-14M62 127l19 4" stroke="#d3a455" fill="none" stroke-width="2"/>');
const cottage = svg('<path fill="#a05b3c" d="M44 160Q51 69 100 47Q73 118 62 160ZM180 160Q157 91 208 67Q197 112 197 160Z"/><g fill="#687947"><path d="M80 115Q30 106 41 68Q75 65 80 115ZM86 94Q108 50 134 67Q133 95 86 94ZM187 119Q144 106 148 79Q177 74 187 119ZM196 101Q224 67 255 86Q246 111 196 101Z"/></g><path fill="#c57b55" d="M109 54Q91 24 111 19Q130 14 137 39Q159 24 173 44Q183 64 155 73Q155 98 132 95Q112 91 109 54Z"/><path fill="#d6b35c" d="M130 53Q143 43 151 56Q154 68 140 72Q127 70 130 53Z"/>');
const folkFrame = svg('<path d="M10 130Q75 35 160 84Q245 35 310 130M10 147Q75 52 160 101Q245 52 310 147" stroke="#b4884f" stroke-width="2" fill="none"/><g fill="#657642"><path d="M55 86Q18 68 34 44Q68 48 55 86ZM102 68Q74 28 113 25Q143 43 102 68ZM218 68Q177 43 207 25Q246 28 218 68ZM265 86Q252 48 286 44Q302 68 265 86Z"/></g><path fill="#a45235" d="M160 80Q121 49 160 26Q199 49 160 80Z"/>');
const organic = svg('<path fill="#a9bb7a" d="M0 160V107L80 12L160 107V160ZM150 160V120L220 45L290 120V160Z"/><path fill="#3f6651" d="M20 124Q71 80 77 30Q91 80 132 124Q76 100 20 124ZM183 132Q225 94 230 60Q237 94 280 132Q230 115 183 132Z"/><path fill="#a96345" d="M75 87H83V160H75ZM227 105H234V160H227Z"/><path d="M0 159Q80 128 160 155T320 145" stroke="#795747" fill="none" stroke-width="4"/>');
const riviera = svg('<path fill="#326a95" d="M0 0H320V160H0Z"/><path fill="#285545" d="M0 91Q70 10 156 62Q238 8 320 63V160H0Z"/><path fill="#e5b54d" d="M84 44H162V115H84Z"/><path fill="#c67954" d="M162 59H222V115H162Z"/><g fill="#385969"><path d="M95 61h10v16H95zM119 61h10v16h-10zM143 61h10v16h-10zM95 88h10v17H95zM119 88h10v17h-10zM143 88h10v17h-10zM175 76h12v22h-12zM201 76h12v22h-12z"/></g><path fill="#226c9a" d="M0 121H320V160H0Z"/><path fill="#fff3d3" d="M254 56L254 139L309 139Z"/><path fill="#b63e32" d="M239 141H316L303 151H255Z"/>');
const liquid = svg('<path fill="#d1456d" d="M0 23C75 -16 61 122 146 65S249 -2 320 22V160H0Z"/><path fill="#f29d38" d="M0 42C80 5 64 142 153 85S252 17 320 42V160H0Z"/><path fill="#e2c44b" d="M0 61C80 24 68 161 160 105S258 36 320 62V160H0Z"/><path fill="#248679" d="M0 81C84 45 71 180 166 126S260 58 320 82V160H0Z"/><path fill="#44345e" d="M0 103C88 66 75 201 173 146S267 79 320 103V160H0Z"/>');
const newWave = svg('<path fill="#ca3c68" d="M0 100L105 18L144 18L39 100Z"/><path fill="#264c86" d="M138 65H320V79H138Z"/><path fill="#d5a837" d="M182 91H320V126H182Z"/><path d="M11 145L111 61M29 159L130 75" stroke="#22272b" stroke-width="3"/>');

const scope = (id, dialect) => '[data-era="'+id+'"]'+(dialect ? '[data-dialect="'+dialect+'"]' : '');
const muted = (id, dialect, tail) => muteBandSel(id, (dialect ? '[data-dialect="'+dialect+'"]' : '')+tail);
const band = (id, name, tail) => bandSel(id, name, tail);

/* Distinct shape, surface, type, controls and app chrome, not just an illustrated hero.
 * Keep ornament out of dense controls and preserve keyboard focus. */
function family(id, art, look) {
  const e = scope(id);
  const roomy = e+':not([data-density="compact"])';
  return [
    '  '+e+' { --ew-expansion-art: '+art+'; --ew-expansion-radius: '+look.radius+'; --ew-expansion-rule: '+look.rule+'; }',
    '  '+e+' .ew-hero { position: relative; isolation: isolate; display: grid; align-items: center; min-height: min(42vh, 350px); padding: clamp(24px, 5vw, 64px); background: var(--ew-color-bg-surface); border-bottom: var(--ew-expansion-rule) solid var(--ew-color-border-strong); }',
    '  '+e+' .ew-hero__stage { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: var(--ew-expansion-art) right bottom / min(44%, 480px) auto no-repeat; }',
    '  '+e+' .ew-hero__content { max-width: min(52%, 38rem); min-width: 0; }',
    '  '+e+' .ew-hero__title { font-family: var(--ew-font-display); font-size: clamp(2.15rem, 5vw, 4.5rem); font-weight: 700; line-height: 1; letter-spacing: '+look.tracking+'; }',
    '  '+e+' :is(.ew-card,.ew-dialog,.ew-media-card,.ew-stat,.ew-sheet) { border-radius: var(--ew-expansion-radius); }',
    '  '+e+' :is(.ew-button,.ew-icon-button,.ew-text-field__control,.ew-textarea__control,.ew-select__control,.ew-select__trigger) { font-family: var(--ew-font-body); }',
    '  '+e+' :is(.ew-card__header,.ew-dialog__header) { border-block-end: 1px solid var(--ew-color-border-subtle); }',
    '  '+roomy+' :is(.ew-card__header,.ew-dialog__header) { box-shadow: inset 0 var(--ew-expansion-rule) 0 var(--ew-color-action-bg); }',
    '  '+e+' :is(.ew-card__title,.ew-card__header h3,.ew-section-heading) { font-family: var(--ew-font-display); letter-spacing: '+look.tracking+'; }',
    '  '+e+' :is(.ew-badge,.ew-chip,.ew-search,.ew-segmented,.ew-toolbar,.ew-code,.ew-pagination__page) { border-radius: '+look.small+'; }',
    '  '+e+' :is(.ew-badge,.ew-chip) { border: 1px solid var(--ew-color-border-strong); }',
    '  '+e+' .ew-chip[aria-pressed="true"], '+e+' .ew-segmented__item[aria-checked="true"] { background: var(--ew-color-action-bg); color: var(--ew-color-action-fg); }',
    '  '+e+' :is(.ew-stat__value,.ew-price) { color: var(--ew-color-action-bg); font-variant-numeric: tabular-nums; }',
    '  '+roomy+' .ew-stat__value { font-family: var(--ew-font-display); font-weight: 700; }',
    '  '+e+' .ew-table th { border-block-end: var(--ew-expansion-rule) solid var(--ew-color-border-strong); font-size: .82rem; letter-spacing: '+look.tableTracking+'; }',
    '  '+e+' .ew-nav-rail__item[aria-current="page"] { background: color-mix(in oklch, var(--ew-color-action-bg) 9%, var(--ew-color-bg-surface)); }',
    '  '+e+' .ew-switch__track { border: 1px solid var(--ew-color-border-strong); }',
    '  '+e+' .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb { background: var(--ew-color-fg-default); }',
    '  '+e+' .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb { background: var(--ew-color-action-fg); }',
    '  '+e+' .ew-checkbox__box { border-radius: '+look.checkbox+'; }',
    '  '+e+' .ew-ornament-divider[data-variant="ornament"] { height: 18px; border: 0; background: var(--ew-expansion-art) center / 92px auto no-repeat, linear-gradient(var(--ew-color-border-subtle),var(--ew-color-border-subtle)) center / 100% 1px no-repeat; }',
    '  '+roomy+' .ew-empty-state { border-radius: var(--ew-expansion-radius); }',
    '  '+e+' :is(.ew-alert,.ew-toast) { border-inline-start: 4px solid var(--ew-color-border-strong); }',
    '  '+muted(id,null,' .ew-hero__stage')+' { background: none; }',
    '  '+muted(id,null,' .ew-hero')+' { min-height: 0; }',
    '  '+muted(id,null,' .ew-hero__content')+' { max-width: 38rem; }',
    '  '+muted(id,null,' .ew-ornament-divider[data-variant="ornament"]')+' { height: 1px; background: var(--ew-color-border-subtle); }',
    '  '+band(id,'whisper',' .ew-hero')+' { border-bottom-width: 1px; }',
    '  '+band(id,'whisper',' .ew-card__header')+', '+band(id,'whisper',' .ew-dialog__header')+' { box-shadow: none; }',
    '  '+band(id,'whisper',' .ew-table th')+' { border-bottom-width: 1px; }',
    '  @media (max-width: 620px) { '+e+' .ew-hero__content { max-width: 100%; } '+e+' .ew-hero__stage { background-size: 125px auto; } '+e+' .ew-hero:has(.ew-hero__stage) { padding-bottom: 96px; } '+muted(id,null,' .ew-hero:has(.ew-hero__stage)')+' { padding-bottom: 24px; } }',
    '  @media (forced-colors: active) { '+e+' .ew-hero__stage, '+e+' .ew-ornament-divider[data-variant="ornament"] { background-image: none; } }',
  ].join('\n');
}

const palette = (s, light, dark) => {
  const decl = ([bg,fg]) => '--ew-color-action-bg: '+bg+'; --ew-color-action-fg: '+fg+'; --ew-color-track-on: '+bg+'; --ew-color-action-hover: color-mix(in oklch, '+bg+' 90%, var(--ew-color-bg-page));';
  return '  '+s+' { '+decl(light)+' }\n  '+s+'[data-mode="dark"] { '+decl(dark)+' }\n';
};
const variant = (s, art, radius, rule, tracking) => '  '+s+' { --ew-expansion-art: '+art+'; --ew-expansion-radius: '+radius+'; --ew-expansion-rule: '+rule+'; --ew-structure-button-letter-spacing: '+tracking+'; }\n';

export function additionalEraCss(id) {
  const e = scope(id);
  if (id === 'nordic') {
    const pop=scope(id,'botanical-pop'), min=scope(id,'minimal'), folk=scope(id,'folk');
    return family(id,bloom,{radius:'22px 12px 22px 12px',rule:'3px',tracking:'-.025em',tableTracking:'.02em',small:'999px',checkbox:'5px'})+'\n'
      + variant(pop,bloom,'26px 10px 26px 10px','4px','0')
      + palette(pop,['#9f2650','#fffaf2'],['#f2a5be','#26342b'])
      + variant(min,'none','6px','1px','.02em')
      + palette(min,['#345949','#fffaf2'],['#c1d6c7','#20352d'])
      + '  '+min+' .ew-hero__content { max-width: 38rem; }\n'
      + '  '+min+' .ew-ornament-divider[data-variant="ornament"] { height: 1px; }\n'
      + variant(folk,nordicFolk,'10px','2px','.025em')
      + palette(folk,['#8c3f2b','#fff8ec'],['#edb28e','#342c23']);
  }
  if (id === 'futurist') {
    const mech=scope(id,'mechanical'), type=scope(id,'typographic'), air=scope(id,'aero');
    return family(id,mechanical,{radius:'2px',rule:'4px',tracking:'-.015em',tableTracking:'.08em',small:'2px',checkbox:'0'})+'\n'
      + variant(mech,mechanical,'2px','4px','.09em')
      + variant(type,'none','0','2px','.12em')
      + palette(type,['#215d75','#fffaf0'],['#8ad6e8','#20262a'])
      + '  '+type+' .ew-hero__content { max-width: 38rem; }\n'
      + '  '+type+' .ew-hero__title { text-transform: uppercase; letter-spacing: .04em; }\n'
      + variant(air,aero,'14px 3px 14px 3px','2px','.06em')
      + palette(air,['#155e70','#fffaf0'],['#90d9e5','#20262a'])
      + '  '+air+' { --ew-structure-control-radius: 8px 2px 8px 2px; }\n'
      + '  '+e+' .ew-table th { text-transform: uppercase; }\n';
  }
  if (id === 'folklore') {
    const woods=scope(id,'woodland'), cot=scope(id,'cottage'), trad=scope(id,'traditional');
    return family(id,woodland,{radius:'20px 14px 24px 15px',rule:'2px',tracking:'-.02em',tableTracking:'.01em',small:'12px 5px',checkbox:'4px'})+'\n'
      + variant(woods,woodland,'20px 14px 24px 15px','2px','0')
      + variant(cot,cottage,'10px 22px 10px 22px','2px','.01em')
      + palette(cot,['#8b432d','#fff9ed'],['#f0b18d','#302a25'])
      + variant(trad,folkFrame,'6px','3px','.035em')
      + palette(trad,['#4d6034','#fff9ed'],['#cddba2','#273323'])
      + '  '+trad+' :is(.ew-card,.ew-dialog) { border-style: double; border-width: 3px; }\n'
      + '  '+e+' .ew-hero__title { font-weight: 700; }\n';
  }
  if (id === 'mcm-atomic') {
    const s=scope(id,'organic');
    return '  '+s+' { --ew-structure-surface-radius: 26px; --ew-structure-button-shadow: none; --ew-structure-card-shadow: none; --ew-structure-field-radius: 14px; }\n'
      + palette(s,['#41664e','#fff9ec'],['#b9d39c','#203529'])
      + '  '+s+' .ew-hero__stage { background: '+organic+' right bottom / 62% auto no-repeat; }\n'
      + '  '+s+' .ew-hero__stage:empty::before, '+s+' .ew-hero__stage:empty::after, '+s+' .ew-card::before { display: none; }\n'
      + '  '+s+' :is(.ew-card,.ew-media-card,.ew-stat) { border-radius: 26px 12px 26px 12px; }\n'
      + '  '+s+' :is(.ew-badge,.ew-chip) { border-radius: 999px; }\n'
      + '  '+muted(id,'organic',' .ew-hero__stage')+' { background: none; }\n';
  }
  if (id === 'deco') {
    const s=scope(id,'riviera');
    return palette(s,['#245c85','#fff5df'],['#f2ca73','#223a4b'])
      + '  '+s+' .ew-hero__backdrop { background: '+riviera+' right center / min(58%, 560px) auto no-repeat; }\n'
      + '  '+s+' .ew-hero__fan { display: none; }\n'
      + '  '+s+' :is(.ew-card,.ew-dialog,.ew-media-card) { border-radius: 4px; }\n'
      + '  '+s+' .ew-card__header { border-block-end: 3px double var(--ew-color-border-strong); }\n'
      + '  '+s+' .ew-table th { letter-spacing: .08em; }\n'
      + '  '+muted(id,'riviera',' .ew-hero__backdrop')+' { background: none; }\n';
  }
  if (id === 'groovy') {
    const s=scope(id,'liquid');
    return palette(s,['#83345c','#fff2dc'],['#f3a878','#342039'])
      + '  '+s+' :is(.ew-hero__stage,.ew-hero__backdrop) { background: '+liquid+' center bottom / 100% auto no-repeat; }\n'
      + '  '+s+' .ew-card::before { background-image: '+liquid+'; background-size: cover; }\n'
      + '  '+s+' :is(.ew-card,.ew-stat) { border-radius: 30px 14px 30px 14px; }\n'
      + '  '+s+' :is(.ew-chip,.ew-badge) { border-radius: 18px 5px; }\n'
      + '  '+muted(id,'liquid',' .ew-hero__stage')+', '+muted(id,'liquid',' .ew-hero__backdrop')+' { background: none; }\n'
      + '  '+muted(id,'liquid',' .ew-card::before')+' { background-image: none; }\n';
  }
  if (id === 'memphis') {
    const s=scope(id,'new-wave');
    return palette(s,['#a92d61','#fff7ef'],['#f5a5c4','#282230'])
      + '  '+s+' :is(.ew-card,.ew-stat,.ew-media-card) { border-radius: 0; box-shadow: none; }\n'
      + '  '+s+' .ew-card__header { border-inline-start: 5px solid var(--ew-color-action-bg); padding-inline-start: 1rem; }\n'
      + '  '+s+' :is(.ew-hero,.ew-hero__stage)::before, '+s+' :is(.ew-hero,.ew-hero__stage)::after { display: none; }\n'
      + '  '+s+' .ew-hero__stage { background: '+newWave+' right bottom / min(45%, 360px) auto no-repeat; }\n'
      + '  '+s+' :is(.ew-chip,.ew-badge) { background: var(--ew-color-bg-surface); color: var(--ew-color-fg-default); box-shadow: none; }\n'
      + '  '+s+' .ew-table { box-shadow: none; }\n'
      + '  '+muted(id,'new-wave',' .ew-hero__stage')+' { background: none; }\n';
  }
  return '';
}
