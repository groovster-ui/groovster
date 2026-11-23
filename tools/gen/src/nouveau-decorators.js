/** Generator-only original Art Nouveau vector grammar. Nothing imported by browser CSS.
 *  Lithographic line: tapered whiplash, iris, peacock eye, Guimard orchid arch.
 *  Masks are black-on-transparent so one semantic ink tints each layer. */

export const NOUVEAU_PRIMITIVES = ['vine', 'whiplash', 'spray', 'arch', 'iron', 'medallion', 'divider', 'corner'];

const n = (v) => (Math.round(v * 10) / 10).toFixed(1);

function svg(vb, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="black">${body}</svg>`;
}

function mapPoint(x, y, deg, cx, cy) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c - y * s + cx, x * s + y * c + cy];
}

/** Spade leaf. Stem meets a notched base; the tip is a point. rot 0 points up. */
function spade(cx, cy, rot, len, wid) {
  const P = (x, y) => {
    const [X, Y] = mapPoint(x, y, rot, cx, cy);
    return `${n(X)} ${n(Y)}`;
  };
  const l = len;
  const w = wid;
  return `M ${P(0, 0)} C ${P(-w * 0.15, -l * 0.12)} ${P(-w * 1.15, -l * 0.42)} ${P(-w * 0.62, -l * 0.7)} C ${P(-w * 0.18, -l * 0.98)} ${P(-w * 0.06, -l * 0.78)} ${P(0, -l)} C ${P(w * 0.06, -l * 0.78)} ${P(w * 0.18, -l * 0.98)} ${P(w * 0.62, -l * 0.7)} C ${P(w * 1.15, -l * 0.42)} ${P(w * 0.15, -l * 0.12)} ${P(0, 0)} Z`;
}

/** Iris fall or standard. Local tip is -Y; rot 0 points up. */
function petal(cx, cy, rot, len, wid) {
  const P = (x, y) => {
    const [X, Y] = mapPoint(x, y, rot, cx, cy);
    return `${n(X)} ${n(Y)}`;
  };
  const l = len;
  const w = wid;
  return `M ${P(0, 0)} C ${P(-w * 0.15, -l * 0.2)} ${P(-w * 1.05, -l * 0.55)} ${P(-w * 0.72, -l * 0.82)} C ${P(-w * 0.28, -l * 1.08)} ${P(w * 0.28, -l * 1.08)} ${P(w * 0.72, -l * 0.82)} C ${P(w * 1.05, -l * 0.55)} ${P(w * 0.15, -l * 0.2)} ${P(0, 0)} Z`;
}

function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return { x, y, dx, dy };
}

/** Closed ribbon. Normals stay on one side, and a hard turn narrows the stroke so it cannot fold over itself. */
function ribbon(cubics, widthAt) {
  const steps = 42;
  const raw = [];
  cubics.forEach((seg, si) => {
    const start = si === 0 ? 0 : 1;
    for (let s = start; s <= steps; s++) {
      const t = s / steps;
      const p = cubic(seg[0], seg[1], seg[2], seg[3], t);
      raw.push({ ...p, u: (si + t) / cubics.length });
    }
  });
  let prevNx = 0;
  let prevNy = 0;
  let has = false;
  const left = [];
  const right = [];
  for (let i = 0; i < raw.length; i++) {
    const p = raw[i];
    const len = Math.hypot(p.dx, p.dy) || 1;
    let nx = -p.dy / len;
    let ny = p.dx / len;
    if (has && nx * prevNx + ny * prevNy < 0) {
      nx = -nx;
      ny = -ny;
    }
    let turn = 1;
    if (i > 0) {
      const q = raw[i - 1];
      const d0 = Math.hypot(q.dx, q.dy) || 1;
      turn = (q.dx / d0) * (p.dx / len) + (q.dy / d0) * (p.dy / len);
    }
    const ease = turn < 0.2 ? 0.4 : Math.min(1, 0.5 + 0.5 * turn);
    const h = Math.max(0.9, widthAt(p.u) * ease) / 2;
    left.push([p.x + nx * h, p.y + ny * h]);
    right.push([p.x - nx * h, p.y - ny * h]);
    prevNx = nx;
    prevNy = ny;
    has = true;
  }
  let d = `M ${n(left[0][0])} ${n(left[0][1])}`;
  for (let i = 1; i < left.length; i++) d += ` L ${n(left[i][0])} ${n(left[i][1])}`;
  for (let i = right.length - 1; i >= 0; i--) d += ` L ${n(right[i][0])} ${n(right[i][1])}`;
  return `${d} Z`;
}

function pointOn(cubics, u) {
  const x = Math.min(cubics.length - 1e-4, Math.max(0, u * cubics.length));
  const si = Math.floor(x);
  const seg = cubics[si];
  return cubic(seg[0], seg[1], seg[2], seg[3], x - si);
}

/** Spade tip points along a y-down angle: 0 right, 90 down. The base is tucked back so it joins the stem. */
function leafAt(cx, cy, deg, len, wid, tuck = 12) {
  const a = (deg * Math.PI) / 180;
  const x = cx - Math.cos(a) * tuck;
  const y = cy - Math.sin(a) * tuck;
  return spade(x, y, deg + 90, len + tuck, wid);
}

function petalRing(cx, cy, radius, count, len, wid, spin = 0) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = spin + (i / count) * 360;
    const rad = (a * Math.PI) / 180;
    const px = cx + Math.cos(rad) * radius;
    const py = cy + Math.sin(rad) * radius;
    d += `<path d="${petal(px, py, 90 - a, len, wid)}"/>`;
  }
  return d;
}

function rays(cx, cy, r0, r1, count, width) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    d += `M ${n(cx + Math.cos(a) * r0)} ${n(cy + Math.sin(a) * r0)} L ${n(cx + Math.cos(a) * r1)} ${n(cy + Math.sin(a) * r1)} `;
  }
  return `<path d="${d}" fill="none" stroke="black" stroke-width="${width}" stroke-linecap="round"/>`;
}

function vine() {
  const cubics = [
    [[168, 688], [52, 540], [248, 470], [124, 332]],
    [[124, 332], [28, 228], [236, 148], [160, 56]],
  ];
  const stem = ribbon(cubics, (t) => 22 * (1 - t) * (1 - t) + 3.4);
  const spots = [0.16, 0.36, 0.56, 0.76, 0.9];
  const lens = [108, 96, 84, 68, 44];
  const wids = [32, 28, 26, 20, 15];
  const signs = [1, -1, 1, -1, 1];
  const leaves = spots.map((u, i) => {
    const p = pointOn(cubics, u);
    const ang = (Math.atan2(p.dy, p.dx) * 180) / Math.PI;
    return `<path d="${leafAt(p.x, p.y, ang + signs[i] * 62, lens[i], wids[i], 14)}"/>`;
  }).join('');
  return svg('0 0 320 740', `<path d="${stem}"/>${leaves}`);
}

function whiplash() {
  const cubics = [
    [[40, 164], [78, 164], [36, 62], [156, 52]],
    [[156, 52], [268, 42], [214, 148], [312, 124]],
    [[312, 124], [410, 100], [500, 62], [624, 74]],
  ];
  const d = ribbon(cubics, (t) => 2.4 + 20 * Math.pow(Math.sin(Math.PI * Math.min(1, t / 0.7)), 0.9));
  return svg('0 0 660 220', `<path d="${d}"/>`);
}

const stemCubics = [[[180, 560], [174, 470], [188, 360], [180, 246]]];
const branchCubics = [[[180, 360], [210, 332], [240, 300], [266, 274]]];

function irisParts() {
  const standards = [-46, 0, 46].map((rot) => petal(180, 198, rot, 68, 15));
  const falls = [148, 180, 212].map((rot, i) => petal(180, 198, rot, i === 1 ? 102 : 90, i === 1 ? 24 : 20));
  const end = pointOn(branchCubics, 0.999);
  const ang = (Math.atan2(end.dy, end.dx) * 180) / Math.PI;
  const a = (ang * Math.PI) / 180;
  const bud = petal(end.x - Math.cos(a) * 16, end.y - Math.sin(a) * 16, ang + 90, 52, 16);
  return { standards, falls, bud };
}

function spray() {
  const { standards, falls, bud } = irisParts();
  const line = (d, w) => `<path d="${d}" fill="none" stroke="black" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const stem = ribbon(stemCubics, (t) => 14 * (1 - t) + 3.6);
  const branch = ribbon(branchCubics, (t) => 5.5 * (1 - t) + 2.2);
  const low = pointOn(stemCubics, 0.34);
  const mid = pointOn(stemCubics, 0.55);
  const lowAng = (Math.atan2(low.dy, low.dx) * 180) / Math.PI;
  const midAng = (Math.atan2(mid.dy, mid.dx) * 180) / Math.PI;
  const leftLeaf = leafAt(low.x, low.y, lowAng + 70, 148, 20, 16);
  const rightLeaf = leafAt(mid.x, mid.y, midAng - 68, 124, 18, 16);
  return svg(
    '0 0 360 760',
    `<path d="${leftLeaf}"/><path d="${rightLeaf}"/>
     <path d="${stem}"/><path d="${branch}"/><path d="${bud}"/>
     ${standards.map((d) => line(d, 3.4)).join('')}
     ${falls.map((d) => line(d, 3.4)).join('')}
     <circle cx="180" cy="198" r="5"/>`
  );
}

function bloom() {
  const { standards, falls, bud } = irisParts();
  return svg('0 0 360 760', [...standards, ...falls, bud].map((d) => `<path d="${d}"/>`).join(''));
}

function arch() {
  const hood = 'M 78 640 C 54 548 46 450 64 352 C 84 248 74 176 128 128 C 176 86 228 66 280 64 C 332 66 384 86 432 128 C 486 176 476 248 496 352 C 514 450 506 548 482 640';
  const inner = 'M 118 640 C 102 556 98 468 112 380 C 128 286 122 220 164 178 C 202 140 240 122 280 120 C 320 122 358 140 396 178 C 438 220 432 286 448 380 C 462 468 458 556 442 640';
  return svg(
    '0 0 560 690',
    `<path d="${hood}" fill="none" stroke="black" stroke-width="24" stroke-linecap="round"/>
     <path d="${inner}" fill="none" stroke="black" stroke-width="5" stroke-linecap="round"/>
     <ellipse cx="280" cy="168" rx="14" ry="20"/>
     <path d="${leafAt(156, 150, 214, 52, 16)}"/>
     <path d="${leafAt(404, 150, -34, 52, 16)}"/>`
  );
}

function iron() {
  const stems = [
    [[[90, 688], [58, 530], [118, 400], [84, 250]], [[84, 250], [66, 160], [74, 110], [82, 86]]],
    [[[220, 692], [176, 520], [258, 390], [216, 230]], [[216, 230], [198, 145], [208, 96], [214, 68]]],
    [[[354, 686], [396, 530], [320, 400], [358, 255]], [[358, 255], [384, 175], [360, 120], [348, 92]]],
  ];
  const tie = ribbon([[[52, 430], [160, 396], [290, 458], [388, 412]]], (t) => 6 + 8 * Math.sin(Math.PI * t));
  const buds = stems.map((cubics) => {
    const p = pointOn(cubics, 0.999);
    const ang = (Math.atan2(p.dy, p.dx) * 180) / Math.PI;
    return `<path d="${leafAt(p.x, p.y, ang, 48, 16, 22)}"/>`;
  }).join('');
  const bars = stems.map((cubics) => `<path d="${ribbon(cubics, (t) => 16 * (1 - t * 0.35))}"/>`).join('');
  return svg('0 0 440 740', `${bars}<path d="${tie}"/>${buds}`);
}

function medallion() {
  return svg(
    '0 0 400 400',
    `<circle cx="200" cy="200" r="186" fill="none" stroke="black" stroke-width="3"/>
     <circle cx="200" cy="200" r="168" fill="none" stroke="black" stroke-width="1.5"/>
     ${petalRing(200, 200, 132, 16, 40, 14, -90)}
     ${rays(200, 200, 100, 124, 28, 3)}
     <circle cx="200" cy="200" r="90" fill="none" stroke="black" stroke-width="8"/>
     <circle cx="200" cy="200" r="56" fill="none" stroke="black" stroke-width="2"/>
     <circle cx="200" cy="200" r="32"/>`
  );
}

function divider() {
  const left = ribbon(
    [
      [[20, 100], [110, 42], [220, 118], [330, 76]],
      [[330, 76], [400, 48], [440, 96], [458, 82]],
    ],
    (t) => 3.6 + 11 * t
  );
  const right = ribbon(
    [
      [[980, 100], [890, 42], [780, 118], [670, 76]],
      [[670, 76], [600, 48], [560, 96], [542, 82]],
    ],
    (t) => 3.6 + 11 * t
  );
  return svg(
    '0 0 1000 160',
    `<path d="${left}"/><path d="${right}"/>
     <circle cx="500" cy="82" r="30" fill="none" stroke="black" stroke-width="5"/>
     ${rays(500, 82, 14, 24, 12, 2.4)}
     <circle cx="500" cy="82" r="7"/>`
  );
}

function corner() {
  const cubics = [
    [[40, 292], [40, 196], [52, 118], [108, 82]],
    [[108, 82], [168, 42], [214, 64], [248, 40]],
  ];
  const d = ribbon(cubics, (t) => 16 * Math.pow(1 - t, 1.15) + 2.6);
  const end = pointOn(cubics, 0.999);
  const ang = (Math.atan2(end.dy, end.dx) * 180) / Math.PI;
  return svg('0 0 320 340', `<path d="${d}"/><path d="${leafAt(end.x, end.y, ang, 52, 18)}"/>`);
}

function motifSvg() {
  return {
    vine: vine(),
    whiplash: whiplash(),
    spray: spray(),
    bloom: bloom(),
    arch: arch(),
    iron: iron(),
    medallion: medallion(),
    divider: divider(),
    corner: corner(),
  };
}

function cssUrl(markup) {
  return `url("data:image/svg+xml,${encodeURIComponent(markup)}")`;
}

export function nouveauDecoratorCss() {
  const m = motifSvg();
  const u = Object.fromEntries(Object.entries(m).map(([k, v]) => [k, cssUrl(v)]));
  return `
/* Lithograph, not a sticker: halo, rose bloom, and olive line are separate inks. */
[data-era="art-nouveau"]{
 --ew-nv-vine:${u.vine};
 --ew-nv-whiplash:${u.whiplash};
 --ew-nv-spray:${u.spray};
 --ew-nv-bloom:${u.bloom};
 --ew-nv-arch:${u.arch};
 --ew-nv-iron:${u.iron};
 --ew-nv-medallion:${u.medallion};
 --ew-nv-divider:${u.divider};
 --ew-nv-corner:${u.corner};
 --ew-nv-ink:var(--ew-color-leaf);
 --ew-nv-metal:var(--ew-color-brass);
 --ew-nv-primary:var(--ew-nv-spray);
 --ew-nv-secondary:var(--ew-nv-whiplash);
}
[data-era="art-nouveau"][data-dialect="architectural"]{
 --ew-font-display:"Bellefair",Palatino,"Palatino Linotype",serif;
 --ew-nv-ink:var(--ew-color-sage);
 --ew-nv-primary:var(--ew-nv-iron);
 --ew-nv-secondary:var(--ew-nv-arch);
 --ew-structure-control-radius:4px;
 --ew-structure-surface-radius:8px 28px 8px 28px;
}
[data-era="art-nouveau"] .ew-hero{
 position:relative;display:grid;align-items:center;isolation:isolate;overflow:hidden;
 min-height:clamp(560px,74vw,880px);
 padding:clamp(3.25rem,7vw,6.5rem) clamp(1.4rem,5vw,5.5rem);
 background:
  radial-gradient(circle at 76% 46%, color-mix(in oklch, var(--ew-color-brass) 55%, var(--ew-color-bg-page)) 0 9%, transparent 9.4%),
  radial-gradient(circle at 76% 46%, color-mix(in oklch, var(--ew-color-peacock) 18%, transparent) 0 22%, transparent 23%),
  linear-gradient(102deg, var(--ew-color-bg-page) 0 52%, color-mix(in oklch, var(--ew-color-sage) 28%, var(--ew-color-bg-page)) 64% 100%);
}
[data-era="art-nouveau"] .ew-hero__panel{
 position:relative;z-index:2;width:min(100%,1180px);margin-inline:auto;
 display:grid;grid-template-columns:minmax(0,1.15fr) minmax(140px,.9fr);align-items:center;
}
[data-era="art-nouveau"] .ew-hero__content{position:relative;z-index:2;grid-column:1;min-width:0;padding:clamp(.5rem,2vw,1.5rem) 0}
[data-era="art-nouveau"] .ew-hero__content::before{
 content:"";display:block;width:4.75rem;height:2px;margin:0 0 .85rem;background:var(--ew-color-brass);
 box-shadow:0 6px 0 0 var(--ew-color-leaf);
}
[data-era="art-nouveau"] .ew-hero__title{
 font:600 clamp(3.15rem,6.1vw,6.5rem)/.9 var(--ew-font-display);
 letter-spacing:-.02em;max-width:12ch;overflow-wrap:break-word;text-wrap:balance;margin:.08em 0 .28em;
}
[data-era="art-nouveau"] .ew-hero__subtitle{font-size:clamp(1.05rem,1.6vw,1.28rem);max-width:36ch;line-height:1.55;margin:0 0 1.6rem}
[data-era="art-nouveau"] .ew-script{
 font:italic 400 clamp(1.15rem,2vw,1.55rem)/1.3 var(--ew-font-display);
 letter-spacing:.035em;text-transform:none;color:var(--ew-color-leaf);margin:0 0 .35rem;
}
[data-era="art-nouveau"] .ew-hero__backdrop,[data-era="art-nouveau"] .ew-hero__stage{position:absolute;inset:0;pointer-events:none;z-index:0}
[data-era="art-nouveau"] .ew-hero::after{
 content:"";position:absolute;z-index:0;pointer-events:none;
 right:8%;top:6%;width:min(32%,380px);height:90%;
 background:var(--ew-color-rose);
 -webkit-mask:var(--ew-nv-bloom) center / contain no-repeat;
 mask:var(--ew-nv-bloom) center / contain no-repeat;
 opacity:.9;
}
[data-era="art-nouveau"] .ew-hero__stage::before{
 content:"";position:absolute;right:8%;top:6%;width:min(32%,380px);height:90%;
 background:var(--ew-nv-ink);
 -webkit-mask:var(--ew-nv-primary) center / contain no-repeat;
 mask:var(--ew-nv-primary) center / contain no-repeat;
 opacity:.95;
}
[data-era="art-nouveau"] .ew-hero__stage::after{
 content:"";position:absolute;right:6%;bottom:7%;width:min(38%,440px);height:22%;
 background:var(--ew-nv-metal);
 -webkit-mask:var(--ew-nv-secondary) center / contain no-repeat;
 mask:var(--ew-nv-secondary) center / contain no-repeat;
 opacity:.5;
}
[data-era="art-nouveau"] .ew-hero__backdrop::before{
 content:"";position:absolute;right:1%;top:2%;width:min(48%,560px);height:96%;
 background:var(--ew-nv-metal);
 -webkit-mask:var(--ew-nv-medallion) center / contain no-repeat;
 mask:var(--ew-nv-medallion) center / contain no-repeat;
 opacity:.72;
}
[data-era="art-nouveau"] .ew-hero__panel::before{
 content:"";position:absolute;left:-.25rem;top:-1.5rem;width:clamp(84px,10vw,128px);aspect-ratio:1;
 background:var(--ew-nv-metal);pointer-events:none;opacity:.8;
 -webkit-mask:var(--ew-nv-corner) center / contain no-repeat;
 mask:var(--ew-nv-corner) center / contain no-repeat;
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-hero{
 background:linear-gradient(102deg, var(--ew-color-bg-page) 0 60%, color-mix(in oklch, var(--ew-color-peacock) 16%, var(--ew-color-bg-page)) 72% 100%);
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-hero::after,
[data-era="art-nouveau"][data-dialect="architectural"] .ew-hero__backdrop::before{display:none}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-hero__title{
 font-weight:400;font-size:clamp(2.7rem,5.5vw,5.7rem);letter-spacing:.055em;text-transform:uppercase;line-height:.96;max-width:14ch;
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-script{
 font-style:normal;font-weight:400;letter-spacing:.18em;text-transform:uppercase;font-size:clamp(.78rem,1.2vw,.95rem);color:var(--ew-color-peacock);
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-hero__stage::before{
 right:2%;top:0;width:min(36%,420px);height:100%;opacity:.92;
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-hero__stage::after{
 left:auto;right:0;bottom:auto;top:-4%;width:min(46%,520px);height:108%;opacity:.42;
 -webkit-mask:var(--ew-nv-secondary) center / contain no-repeat;
 mask:var(--ew-nv-secondary) center / contain no-repeat;
}
[data-era="art-nouveau"] .ew-nouveau-ornament{
 display:block;position:relative;pointer-events:none;user-select:none;
 background:var(--ew-nv-ink);
 -webkit-mask:var(--ew-nv-vine) center / contain no-repeat;
 mask:var(--ew-nv-vine) center / contain no-repeat;
 opacity:.88;
}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="whiplash"]{-webkit-mask-image:var(--ew-nv-whiplash);mask-image:var(--ew-nv-whiplash)}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="spray"]{-webkit-mask-image:var(--ew-nv-spray);mask-image:var(--ew-nv-spray)}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="bloom"]{background:var(--ew-color-rose);-webkit-mask-image:var(--ew-nv-bloom);mask-image:var(--ew-nv-bloom)}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="arch"]{-webkit-mask-image:var(--ew-nv-arch);mask-image:var(--ew-nv-arch)}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="iron"]{-webkit-mask-image:var(--ew-nv-iron);mask-image:var(--ew-nv-iron)}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="medallion"]{background:var(--ew-nv-metal);-webkit-mask-image:var(--ew-nv-medallion);mask-image:var(--ew-nv-medallion)}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="corner"]{background:var(--ew-nv-metal);-webkit-mask-image:var(--ew-nv-corner);mask-image:var(--ew-nv-corner)}
[data-era="art-nouveau"] .ew-nouveau-ornament[data-motif="divider"]{-webkit-mask-image:var(--ew-nv-divider);mask-image:var(--ew-nv-divider)}
[data-era="art-nouveau"] .ew-card{
 position:relative;isolation:isolate;
 border-radius:36px 10px 28px 8px;
 border-color:color-mix(in oklch, var(--ew-color-brass) 55%, var(--ew-color-border-strong));
 box-shadow:
  inset 0 0 0 1px color-mix(in oklch, var(--ew-color-brass) 70%, transparent),
  inset 0 0 0 5px var(--ew-color-bg-surface),
  inset 0 0 0 6px color-mix(in oklch, var(--ew-color-leaf) 45%, transparent);
}
[data-era="art-nouveau"] .ew-card[data-variant="raised"]::before{
 content:"";position:absolute;right:12px;top:12px;width:64px;height:64px;pointer-events:none;opacity:.55;
 background:var(--ew-nv-metal);
 -webkit-mask:var(--ew-nv-corner) center / contain no-repeat;
 mask:var(--ew-nv-corner) center / contain no-repeat;
}
[data-era="art-nouveau"] .ew-card__header{position:relative;border-bottom:1px solid color-mix(in oklch, var(--ew-color-brass) 45%, var(--ew-color-border-subtle))}
[data-era="art-nouveau"] .ew-card__title{font-family:var(--ew-font-display);font-weight:600;letter-spacing:-.02em}
[data-era="art-nouveau"] .ew-button{
 border-radius:1.45em .4em 1.25em .35em;
 font-weight:600;letter-spacing:.03em;
 transition:background-color .18s ease,border-color .18s ease;
}
[data-era="art-nouveau"] .ew-button:not([data-variant]),
[data-era="art-nouveau"] .ew-button[data-variant="primary"]{
 border-color:color-mix(in oklch, var(--ew-color-brass) 72%, var(--ew-color-action-bg));
 box-shadow:inset 0 0 0 1px color-mix(in oklch, var(--ew-color-accent-fg) 32%, transparent);
}
[data-era="art-nouveau"] .ew-button[data-variant="secondary"]{
 border-radius:.4em 1.45em .35em 1.25em;
 border-color:var(--ew-color-leaf);
}
[data-era="art-nouveau"] .ew-button[data-variant="ghost"]{box-shadow:none}
[data-era="art-nouveau"] .ew-button:focus-visible{outline:3px solid var(--ew-color-field-focus);outline-offset:3px}
[data-era="art-nouveau"] .ew-text-field__control,
[data-era="art-nouveau"] .ew-textarea__control,
[data-era="art-nouveau"] .ew-select__trigger,
[data-era="art-nouveau"] .ew-select__control{
 border-radius:6px;border-color:var(--ew-color-field-border);background:var(--ew-color-field-bg);
}
[data-era="art-nouveau"] .ew-tabs [role="tab"][aria-selected="true"]{border-bottom:2px solid var(--ew-color-brass);box-shadow:inset 0 -4px 0 var(--ew-color-leaf)}
[data-era="art-nouveau"] .ew-dialog{border-radius:32px 10px 26px 8px;box-shadow:var(--ew-elevation-dialog), inset 0 0 0 1px color-mix(in oklch, var(--ew-color-brass) 65%, transparent)}
[data-era="art-nouveau"] .ew-menu__panel,[data-era="art-nouveau"] .ew-popover__panel{border-radius:16px 6px 16px 6px}
[data-era="art-nouveau"] .ew-link{text-decoration-color:var(--ew-color-brass);text-underline-offset:.22em}
[data-era="art-nouveau"] .ew-ornament-divider{position:relative;height:48px;overflow:hidden;background:none}
[data-era="art-nouveau"] .ew-ornament-divider::after{
 content:"";position:absolute;inset:0;background:var(--ew-nv-ink);pointer-events:none;opacity:.8;
 -webkit-mask:var(--ew-nv-divider) center / 100% 100% no-repeat;
 mask:var(--ew-nv-divider) center / 100% 100% no-repeat;
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-card{
 border-radius:8px 28px 8px 28px;
 border-left:3px solid var(--ew-color-peacock);
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-button{border-radius:2px 1.2em 2px 1.2em}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-card__title{
 font-family:var(--ew-font-display);font-weight:400;letter-spacing:.06em;text-transform:uppercase;
}
[data-era="art-nouveau"][data-dialect="architectural"] .ew-ornament-divider::after{
 -webkit-mask-image:var(--ew-nv-whiplash);mask-image:var(--ew-nv-whiplash);
}
[data-era="art-nouveau"][data-fidelity-band="whisper"] .ew-hero,
[data-fidelity-band="whisper"] [data-era="art-nouveau"] .ew-hero{
 min-height:0;padding-block:2.25rem;
 background:var(--ew-color-bg-page);
}
[data-era="art-nouveau"][data-fidelity-band="whisper"] .ew-hero__stage,
[data-fidelity-band="whisper"] [data-era="art-nouveau"] .ew-hero__stage,
[data-era="art-nouveau"][data-fidelity-band="whisper"] .ew-hero__backdrop,
[data-fidelity-band="whisper"] [data-era="art-nouveau"] .ew-hero__backdrop,
[data-era="art-nouveau"][data-fidelity-band="whisper"] .ew-hero::after,
[data-fidelity-band="whisper"] [data-era="art-nouveau"] .ew-hero::after,
[data-era="art-nouveau"][data-fidelity-band="whisper"] .ew-hero__panel::before,
[data-fidelity-band="whisper"] [data-era="art-nouveau"] .ew-hero__panel::before,
[data-era="art-nouveau"][data-fidelity-band="whisper"] .ew-card[data-variant="raised"]::before,
[data-fidelity-band="whisper"] [data-era="art-nouveau"] .ew-card[data-variant="raised"]::before{display:none}
[data-era="art-nouveau"][data-fidelity-band="whisper"] .ew-hero__panel,
[data-fidelity-band="whisper"] [data-era="art-nouveau"] .ew-hero__panel{grid-template-columns:minmax(0,1fr)}
[data-era="art-nouveau"][data-fidelity-band="standard"] .ew-hero,
[data-fidelity-band="standard"] [data-era="art-nouveau"] .ew-hero,
[data-era="art-nouveau"][data-fidelity-band="default"] .ew-hero,
[data-fidelity-band="default"] [data-era="art-nouveau"] .ew-hero,
[data-era="art-nouveau"][data-fidelity-band="signature"] .ew-hero,
[data-fidelity-band="signature"] [data-era="art-nouveau"] .ew-hero{
 min-height:clamp(420px,56vw,680px);
 background:linear-gradient(102deg, var(--ew-color-bg-page) 0 72%, color-mix(in oklch, var(--ew-color-sage) 16%, var(--ew-color-bg-page)) 100%);
}
[data-era="art-nouveau"][data-fidelity-band="standard"] .ew-hero__backdrop,
[data-fidelity-band="standard"] [data-era="art-nouveau"] .ew-hero__backdrop,
[data-era="art-nouveau"][data-fidelity-band="default"] .ew-hero__backdrop,
[data-fidelity-band="default"] [data-era="art-nouveau"] .ew-hero__backdrop,
[data-era="art-nouveau"][data-fidelity-band="signature"] .ew-hero__backdrop,
[data-fidelity-band="signature"] [data-era="art-nouveau"] .ew-hero__backdrop,
[data-era="art-nouveau"][data-fidelity-band="standard"] .ew-hero::after,
[data-fidelity-band="standard"] [data-era="art-nouveau"] .ew-hero::after,
[data-era="art-nouveau"][data-fidelity-band="default"] .ew-hero::after,
[data-fidelity-band="default"] [data-era="art-nouveau"] .ew-hero::after,
[data-era="art-nouveau"][data-fidelity-band="signature"] .ew-hero::after,
[data-fidelity-band="signature"] [data-era="art-nouveau"] .ew-hero::after,
[data-era="art-nouveau"][data-fidelity-band="standard"] .ew-hero__stage::after,
[data-fidelity-band="standard"] [data-era="art-nouveau"] .ew-hero__stage::after,
[data-era="art-nouveau"][data-fidelity-band="default"] .ew-hero__stage::after,
[data-fidelity-band="default"] [data-era="art-nouveau"] .ew-hero__stage::after,
[data-era="art-nouveau"][data-fidelity-band="signature"] .ew-hero__stage::after,
[data-fidelity-band="signature"] [data-era="art-nouveau"] .ew-hero__stage::after,
[data-era="art-nouveau"][data-fidelity-band="standard"] .ew-hero__panel::before,
[data-fidelity-band="standard"] [data-era="art-nouveau"] .ew-hero__panel::before,
[data-era="art-nouveau"][data-fidelity-band="default"] .ew-hero__panel::before,
[data-fidelity-band="default"] [data-era="art-nouveau"] .ew-hero__panel::before,
[data-era="art-nouveau"][data-fidelity-band="signature"] .ew-hero__panel::before,
[data-fidelity-band="signature"] [data-era="art-nouveau"] .ew-hero__panel::before,
[data-era="art-nouveau"][data-fidelity-band="standard"] .ew-card[data-variant="raised"]::before,
[data-fidelity-band="standard"] [data-era="art-nouveau"] .ew-card[data-variant="raised"]::before,
[data-era="art-nouveau"][data-fidelity-band="default"] .ew-card[data-variant="raised"]::before,
[data-fidelity-band="default"] [data-era="art-nouveau"] .ew-card[data-variant="raised"]::before,
[data-era="art-nouveau"][data-fidelity-band="signature"] .ew-card[data-variant="raised"]::before,
[data-fidelity-band="signature"] [data-era="art-nouveau"] .ew-card[data-variant="raised"]::before{display:none}
@media(max-width:720px){
 [data-era="art-nouveau"] .ew-hero{min-height:0;padding:2.75rem 1.2rem 300px}
 [data-era="art-nouveau"] .ew-hero__panel{grid-template-columns:minmax(0,1fr)}
 [data-era="art-nouveau"] .ew-hero__content{grid-column:1;max-width:100%}
 [data-era="art-nouveau"] .ew-hero__title{font-size:clamp(2.7rem,12vw,4.4rem)}
 [data-era="art-nouveau"] .ew-hero::after,
 [data-era="art-nouveau"] .ew-hero__stage::before{
  top:auto;bottom:8px;right:6%;width:min(70%,300px);height:270px;opacity:.92;
 }
 [data-era="art-nouveau"] .ew-hero__backdrop::before{
  top:auto;bottom:0;right:0;width:min(86%,360px);height:300px;opacity:.75;
 }
 [data-era="art-nouveau"] .ew-hero__stage::after{left:0;bottom:250px;width:70%;height:64px;opacity:.4}
 [data-era="art-nouveau"] .ew-hero__panel::before{left:0;top:-.5rem;width:64px;opacity:.45}
 [data-era="art-nouveau"][data-dialect="architectural"] .ew-hero__title{font-size:clamp(2.15rem,10vw,3.8rem)}
 [data-era="art-nouveau"][data-dialect="architectural"] .ew-hero__stage::before,
 [data-era="art-nouveau"][data-dialect="architectural"] .ew-hero__stage::after{
  top:auto;bottom:0;height:280px;width:min(78%,340px);right:4%;opacity:.85;
 }
}
@media(prefers-reduced-motion:reduce){[data-era="art-nouveau"] .ew-button{transition:none}}
@media(forced-colors:active){
 [data-era="art-nouveau"] .ew-hero__stage,
 [data-era="art-nouveau"] .ew-hero__backdrop,
 [data-era="art-nouveau"] .ew-hero::after,
 [data-era="art-nouveau"] .ew-nouveau-ornament,
 [data-era="art-nouveau"] .ew-card[data-variant="raised"]::before{display:none}
}
`;
}
