
import { VERSION } from './paths.js';
import { eraCard, getComponent, getEra, loadComponents, loadEras } from './load-spec.js';
import { validateMarkup } from './validate.js';

function pin(payload) {
  return { version: VERSION, ...payload };
}

export function listEras({ detail } = {}) {
  const eras = loadEras();
  if (detail === 'full') {
    return pin({
      eras: eras.map((e) => ({
        id: e.id,
        name: e.name,
        oneLiner: e.identity.oneLiner,
        fidelity: e.fidelity.recommended,
        bestFit: e.identity.bestFit,
        neverDo: e.neverDo,
      })),
    });
  }
  return pin({
    eras: eras.map((e) => ({
      id: e.id,
      oneLiner: e.identity.oneLiner,
      fidelity: e.fidelity.recommended.default,
      bestFit: (e.identity.bestFit || []).slice(0, 2),
    })),
  });
}

export function getEraSpec({ era, detail } = {}) {
  const e = getEra(era);
  if (!e) {
    return pin({ error: `Unknown era "${era}"`, change: 'change era to neutral|deco|mcm-atomic|neon' });
  }
  const card = eraCard(e);
  if (detail === 'full') {
    return pin({
      id: e.id,
      card,
      axes: e.axes,
      fonts: e.fonts,
      fidelity: e.fidelity,
      neverDo: e.neverDo,
      dialects: e.dialects || [],
    });
  }
  return pin({
    id: e.id,
    card,
    neverDo: e.neverDo.slice(0, 3),
    fidelity: e.fidelity.recommended,
  });
}

export function getComponentTool({ name, era, framework, detail } = {}) {
  const comp = getComponent(name);
  if (!comp) {
    return pin({
      error: `Unknown component "${name}"`,
      change: `change name to one of: ${loadComponents().map((c) => c.id).join(', ')}`,
    });
  }
  const eraId = era ? getEra(era)?.id : null;
  const cssImport = `@era-widgets/css/${comp.id}.css`;
  const eraImport = eraId ? `@era-widgets/css/eras/${eraId}.css` : '@era-widgets/css/eras/<era>.css';
  const html =
    eraId && !comp.canonicalHtml.includes('data-era')
      ? `<div data-era="${eraId}">\n${comp.canonicalHtml}\n</div>`
      : comp.canonicalHtml;

  // framework wrappers are later; HTML is canonical
  if (framework && framework !== 'html' && detail !== 'full') {
    return pin({
      name: comp.id,
      note: 'Canonical API is HTML. React wrapper not required for agents.',
      html,
      css: [`import "${cssImport}";`, eraId ? `import "${eraImport}";` : `/* set data-era on an ancestor */`],
      a11y: comp.aria.notes[0],
    });
  }

  if (detail === 'full') {
    return pin({
      name: comp.id,
      summary: comp.summary,
      html,
      css: [cssImport, eraImport],
      variants: comp.variants,
      aria: comp.aria,
      do: comp.do,
      dont: comp.dont,
      keyboard: comp.keyboard,
    });
  }

  return pin({
    name: comp.id,
    html,
    css: `import "${cssImport}";` + (eraId ? ` import "${eraImport}";` : ''),
    a11y: comp.aria.notes[0],
  });
}

export function installTool({ name, target } = {}) {
  const tgt = (target || 'npm').toLowerCase();
  const comp = name ? getComponent(name) : null;
  const lines = [];
  if (tgt === 'registry' || tgt === 'shadcn') {
    lines.push(`npx shadcn@latest add http://localhost:4174/r/${comp ? comp.id : 'button'}.json`);
    lines.push('Or open registry/registry.json from this repo and copy the item URL once hosted.');
  } else if (tgt === 'copy' || tgt === 'copy-in') {
    lines.push('Copy packages/css/dist/era-widgets.css into your project.');
    if (comp?.id === 'tabs') lines.push('Copy packages/elements/dist/ew-tabs.js and load via <script>.');
    lines.push('Use canonical HTML from get_component; set data-era on a root.');
  } else {
    lines.push('pnpm add @era-widgets/css @era-widgets/elements @era-widgets/tokens');
    lines.push('Link CSS: <link rel="stylesheet" href="node_modules/@era-widgets/css/era-widgets.css" />');
    if (comp?.id === 'tabs') {
      lines.push('<script src="node_modules/@era-widgets/elements/ew-tabs.js" type="module"></script>');
    }
  }
  return pin({
    target: tgt,
    component: comp?.id || null,
    steps: lines,
  });
}

export function recommendTool({ description } = {}) {
  const text = String(description || '').toLowerCase();
  const rules = [
    { test: /(law|legal|luxury|hotel|editorial|finance|brass|jazz)/, era: 'deco', fidelity: 25, dialect: null },
    { test: /(synth|neon|game|night|festival|retro.?wave|outrun|cyber)/, era: 'neon', fidelity: 55, dialect: 'synthwave' },
    { test: /(miami|pastel|day.?glow|vice)/, era: 'neon', fidelity: 45, dialect: 'miami' },
    { test: /(memphis|confetti|postmodern|squiggle)/, era: 'memphis', fidelity: 50, dialect: null },
    { test: /(groovy|70s|avocado|disco|funk)/, era: 'groovy', fidelity: 40, dialect: null },
    { test: /(earth|organic|wellness|craft|linen|moss)/, era: 'earth', fidelity: 30, dialect: null },
    { test: /(cafe|lifestyle|mid.?century|atomic|playful|product.?stor)/, era: 'mcm-atomic', fidelity: 40, dialect: 'atomic' },
    { test: /(admin|settings|saas|dashboard|serious|enterprise|default)/, era: 'neutral', fidelity: 0, dialect: null },
  ];
  let pick = { era: 'neutral', fidelity: 10, dialect: null, reason: 'default quiet system skin' };
  for (const r of rules) {
    if (r.test.test(text)) {
      pick = { era: r.era, fidelity: r.fidelity, dialect: r.dialect, reason: `matched /${r.test.source}/` };
      break;
    }
  }
  const era = getEra(pick.era);
  return pin({
    era: pick.era,
    fidelity: pick.fidelity,
    dialect: pick.dialect,
    oneLiner: era?.identity?.oneLiner,
    reason: pick.reason,
  });
}

export function validateTool({ markup, era, detail } = {}) {
  return validateMarkup(markup, era, { detail });
}

export const TOOL_DEFS = [
  {
    name: 'list_eras',
    description: 'List Era Widgets packs with one-line identity and recommended fidelity.',
    inputSchema: {
      type: 'object',
      properties: {
        detail: { type: 'string', enum: ['default', 'full'], description: 'full returns neverDo and bestFit' },
      },
    },
  },
  {
    name: 'get_era_spec',
    description: 'Compact era card (10–20 lines) + neverDo. detail=full for axes/fonts.',
    inputSchema: {
      type: 'object',
      required: ['era'],
      properties: {
        era: { type: 'string', description: 'neutral | deco | mcm-atomic | neon (aliases: atomic, synthwave)' },
        detail: { type: 'string', enum: ['default', 'full'] },
      },
    },
  },
  {
    name: 'get_component',
    description: 'Canonical HTML + CSS import for a widget. Small by default.',
    inputSchema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
        era: { type: 'string' },
        framework: { type: 'string', description: 'html (default). react reserved.' },
        detail: { type: 'string', enum: ['default', 'full'] },
      },
    },
  },
  {
    name: 'install',
    description: 'Install instructions for npm, shadcn registry, or copy-in.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        target: { type: 'string', enum: ['npm', 'registry', 'shadcn', 'copy', 'copy-in'] },
      },
    },
  },
  {
    name: 'recommend',
    description: 'Suggest era + fidelity (+ dialect) for a product description.',
    inputSchema: {
      type: 'object',
      required: ['description'],
      properties: { description: { type: 'string' } },
    },
  },
  {
    name: 'validate',
    description: 'Validate markup against era/spec. Returns exact change X to Y fixes.',
    inputSchema: {
      type: 'object',
      required: ['markup'],
      properties: {
        markup: { type: 'string' },
        era: { type: 'string' },
        detail: { type: 'string', enum: ['default', 'full'] },
      },
    },
  },
];

export function dispatch(name, args = {}) {
  switch (name) {
    case 'list_eras':
      return listEras(args);
    case 'get_era_spec':
      return getEraSpec(args);
    case 'get_component':
      return getComponentTool(args);
    case 'install':
      return installTool(args);
    case 'recommend':
      return recommendTool(args);
    case 'validate':
      return validateTool(args);
    default:
      return pin({ error: `Unknown tool ${name}` });
  }
}
