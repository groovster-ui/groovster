import { muteBandSel, bandSel } from './band.js';

/* Original, self-contained print motifs. Deliberately not copies of reference artwork. */
const svg = (body) => 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160">'+body+'</svg>') + '")';

const bloom = svg('<g fill="#d85983"><path d="M105 190Q80 103 31 80Q39 134 90 160ZM182 180Q176 80 286 41Q260 106 209 130Z"/><path d="M162 168Q143 77 171 16L185 20Q165 92 178 168Z"/></g><g fill="#e8c829"><path d="M145 38L152 10L173 29L192 3L199 32L226 18L222 47L250 53L228 75L246 98L213 98L203 130L181 108L158 133L151 103L120 110L132 83L103 69L134 55L120 34Z"/><path d="M20 35L25 12L40 28L58 7L66 31L86 19L86 43L108 50L89 65L105 84L80 83L75 109L56 92L36 109L33 86L9 92L18 69L-4 56L20 47Z"/></g><g fill="#c94631"><path d="M148 62Q166 43 188 46Q215 48 218 71Q216 95 189 96Q159 99 148 79Z"/><path d="M25 46Q40 33 59 37Q83 40 82 59Q80 78 56 80Q31 79 25 64Z"/></g><g fill="#f2a1b5"><circle cx="165" cy="62" r="3"/><circle cx="180" cy="56" r="3"/><circle cx="198" cy="68" r="4"/><circle cx="175" cy="80" r="4"/><circle cx="196" cy="86" r="3"/><circle cx="44" cy="48" r="3"/><circle cx="62" cy="56" r="4"/><circle cx="47" cy="68" r="3"/></g>');
const nordicFolk = svg('<path d="M16 150Q70 32 160 70Q250 31 304 150" fill="none" stroke="#986b3f" stroke-width="3"/><g fill="#45623a"><path d="M58 101Q9 77 35 46Q74 56 58 101ZM80 80Q74 36 115 32Q132 60 80 80ZM240 80Q205 35 236 30Q270 46 240 80ZM263 103Q255 61 293 49Q314 82 263 103Z"/></g><path fill="#b85c42" d="M160 92C121 64 131 28 160 50C189 28 199 64 160 92Z"/><path fill="#c7a14b" d="M159 90L154 126L165 126Z"/>');
const mechanical = svg('<path fill="#a62936" d="M0 130L320 17V54L0 160Z"/><path fill="#247b92" d="M0 70L320 0V12L0 89ZM62 160L320 72V88L102 160Z"/><path fill="#283338" d="M0 148L320 43V50L0 155Z"/><g transform="translate(172 83) rotate(-16)"><circle r="61" fill="#263238"/><circle r="48" fill="#f4e7c9"/><circle r="42" fill="#247b92"/><path fill="#263238" d="M-8-43H8L13-14L43-8V8L14 13L8 43H-8L-13 14L-43 8V-8L-14-13Z"/><circle r="13" fill="#a62936"/><circle r="5" fill="#f4e7c9"/><path d="M-32-31L-18-43M31 32L43 18" stroke="#f4e7c9" stroke-width="3"/></g><path d="M0 112L100 80M0 122L105 88M231 133L320 104M243 143L320 118" stroke="#263238" stroke-width="3"/>');
const aero = svg('<path fill="#247b92" d="M0 90H225Q281 90 320 40V73Q279 111 225 111H0Z"/><path fill="#a62936" d="M0 122H237Q292 122 320 93V108Q289 140 237 140H0Z"/><path fill="#d6a74d" d="M80 151H277L320 137V150L277 159H80Z"/>');
const woodland = svg('<circle cx="195" cy="43" r="27" fill="#f0d5a1"/><path fill="#40515a" d="M0 116L38 60L60 105L104 36L138 102L167 64L202 111L249 43L282 97L320 68V160H0Z"/><path fill="#718149" d="M0 160Q59 104 134 135Q188 151 244 121Q291 111 320 131V160Z"/><path d="M24 160L28 25M28 86L2 56M28 67L78 26M289 160L281 3M281 67L319 33M281 94L238 54" stroke="#a46542" stroke-width="8" fill="none"/><g fill="#c38a42"><path d="M30 45Q9 17 12 3Q34 9 30 45ZM45 57Q52 22 78 25Q75 50 45 57ZM270 60Q239 45 247 27Q270 32 270 60ZM284 34Q303 4 320 12Q312 37 284 34Z"/></g><g fill="#f0d5a1"><circle cx="98" cy="14" r="2"/><circle cx="135" cy="35" r="2"/><circle cx="229" cy="15" r="2"/><path d="M153 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></g><path d="M82 160Q83 123 63 108M80 144L102 126M111 160Q109 143 128 127M242 160Q249 138 233 121M245 146L269 131" fill="none" stroke="#c7ad63" stroke-width="2"/>');
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
  const ink = id === 'nordic' ? '#194633' : id === 'futurist' ? '#e7dbc4' : '#263746';
  return [
    '  '+e+' { --ew-expansion-art: '+art+'; --ew-expansion-radius: '+look.radius+'; --ew-expansion-rule: '+look.rule+'; --ew-print-ink: '+ink+'; }',
    '  '+e+' .ew-hero { position: relative; isolation: isolate; display: grid; align-items: center; min-height: min(42vh, 350px); padding: clamp(24px, 5vw, 64px); background: var(--ew-color-bg-surface); border-bottom: var(--ew-expansion-rule) solid var(--ew-color-border-strong); }',
    '  '+e+' .ew-hero__stage { position: absolute; inset: 0 0 0 auto; width: 44%; z-index: -1; pointer-events: none; background: var(--ew-print-ink) var(--ew-expansion-art) center / cover no-repeat; }',
    '  '+e+' .ew-hero__content { max-width: 38rem; min-width: 0; }',
    '  '+e+' .ew-hero:has(.ew-hero__stage) .ew-hero__content { max-width: min(52%, 38rem); }',
    '  '+e+' .ew-hero__eyebrow { font-family: var(--ew-font-body); font-size: .78rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; }',
    '  '+e+' .ew-hero__subtitle { max-width: 34ch; line-height: 1.55; }',
    '  '+e+' .ew-hero__title { margin: .18em 0; overflow-wrap: anywhere; font-family: var(--ew-font-display); font-size: clamp(2.15rem, 5vw, 4.5rem); font-weight: 700; line-height: 1; letter-spacing: '+look.tracking+'; }',
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
    '  '+muted(id,null,' .ew-hero:has(.ew-hero__stage) .ew-hero__content')+' { max-width: 38rem; }',
    '  '+muted(id,null,' .ew-ornament-divider[data-variant="ornament"]')+' { height: 1px; background: var(--ew-color-border-subtle); }',
    '  '+band(id,'whisper',' .ew-hero')+' { border-bottom-width: 1px; }',
    '  '+band(id,'whisper',' .ew-card__header')+', '+band(id,'whisper',' .ew-dialog__header')+' { box-shadow: none; }',
    '  '+band(id,'whisper',' .ew-table th')+' { border-bottom-width: 1px; }',
    '  @media (max-width: 620px) { '+e+' .ew-hero:has(.ew-hero__stage) .ew-hero__content { max-width: 100%; } '+e+' .ew-hero__stage { inset: auto 0 0; width: 100%; height: 124px; } '+e+' .ew-hero:has(.ew-hero__stage) { padding-bottom: calc(clamp(24px, 5vw, 64px) + 124px); } '+muted(id,null,' .ew-hero:has(.ew-hero__stage)')+' { padding-bottom: 24px; } }',
    '  @media (forced-colors: active) { '+e+' .ew-hero__stage { display: none; } '+e+' .ew-ornament-divider[data-variant="ornament"] { background-image: none; } }',
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
      + '  '+min+' .ew-hero:has(.ew-hero__stage) .ew-hero__content { max-width: 38rem; }\n'
      + '  '+min+' .ew-hero__stage { display: none; }\n'
      + '  '+min+' .ew-hero:has(.ew-hero__stage) { min-height: 0; padding-bottom: clamp(24px, 5vw, 64px); }\n'
      + '  '+min+' .ew-ornament-divider[data-variant="ornament"] { height: 1px; }\n'
      + variant(folk,nordicFolk,'10px','2px','.025em')
      + palette(folk,['#8c3f2b','#fff8ec'],['#edb28e','#342c23'])
      + '  '+folk+' { --ew-print-ink: #f2e3c7; }\n'
      + '  '+e+' .ew-hero__title { letter-spacing: -.055em; }\n'
      + '  '+e+' .ew-stat { border: 1px solid var(--ew-color-border-subtle); }\n'
      + '  '+e+' .ew-stat__label { font-weight: 700; letter-spacing: .035em; }\n'
      + '  '+pop+' .ew-button:not([data-variant]) { border-radius: 999px; }\n';
  }
  if (id === 'futurist') {
    const mech=scope(id,'mechanical'), type=scope(id,'typographic'), air=scope(id,'aero');
    return family(id,mechanical,{radius:'2px',rule:'4px',tracking:'-.015em',tableTracking:'.08em',small:'2px',checkbox:'0'})+'\n'
      + variant(mech,mechanical,'2px','4px','.09em')
      + variant(type,'none','0','2px','.12em')
      + palette(type,['#215d75','#fffaf0'],['#8ad6e8','#20262a'])
      + '  '+type+' .ew-hero:has(.ew-hero__stage) .ew-hero__content { max-width: 38rem; }\n'
      + '  '+type+' .ew-hero__stage { display: none; }\n'
      + '  '+type+' .ew-hero:has(.ew-hero__stage) { min-height: 0; padding-bottom: clamp(24px, 5vw, 64px); }\n'
      + '  '+type+' .ew-hero__title { text-transform: uppercase; letter-spacing: .04em; }\n'
      + variant(air,aero,'14px 3px 14px 3px','2px','.06em')
      + palette(air,['#155e70','#fffaf0'],['#90d9e5','#20262a'])
      + '  '+air+' { --ew-structure-control-radius: 8px 2px 8px 2px; }\n'
      + '  '+e+' .ew-table th { text-transform: uppercase; }\n'
      + '  '+e+' .ew-hero__title { text-transform: uppercase; line-height: .96; }\n'
      + '  '+e+' .ew-stat { border: 1px solid var(--ew-color-border-strong); border-inline-start: 5px solid var(--ew-color-action-bg); }\n'
      + '  '+e+' .ew-stat__label { font-weight: 700; text-transform: uppercase; letter-spacing: .07em; }\n'
      + '  '+band(id,'whisper',' .ew-stat')+' { border-inline-start-width: 1px; }\n';
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
      + '  '+cot+', '+trad+' { --ew-print-ink: #f0e1c1; }\n'
      + '  '+e+' .ew-hero__title { font-weight: 400; letter-spacing: -.035em; line-height: 1.04; }\n'
      + '  '+e+' .ew-stat { border: 1px solid var(--ew-color-border-subtle); }\n'
      + '  '+e+' .ew-stat__label { font-style: italic; }\n'
      + '  '+e+' .ew-card__header { border-block-end: 3px double var(--ew-color-border-subtle); }\n'
      + '  '+band(id,'whisper',' .ew-card__header')+' { border-block-end: 1px solid var(--ew-color-border-subtle); }\n';
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
