
import { VERSION } from './paths.js';
import { eraCard, getComponent, getEra, loadComponents, loadEras, loadRecipes } from './load-spec.js';
import { validateMarkup } from './validate.js';

const REGISTRY_BASE = (process.env.GROOVSTER_REGISTRY_URL || 'https://groovsterui.com/r').replace(/\/$/, '');

function pin(payload) {
  return { version: VERSION, ...payload };
}

function eraIds() {
  return loadEras().map((e) => e.id);
}

function hardWidgetScript(compId) {
  const map = {
    tabs: 'ew-tabs.js',
    select: 'ew-select.js',
    menu: 'ew-menu.js',
    popover: 'ew-popover.js',
    tooltip: 'ew-tooltip.js',
    toast: 'ew-toast.js',
    slider: 'ew-slider.js',
  };
  return map[compId] || null;
}

export function listEras({ detail } = {}) {
  const eras = loadEras();
  if (detail === 'full') {
    return pin({
      eras: eras.map((e) => ({
        id: e.id,
        name: e.name,
        oneLiner: e.identity.oneLiner,
        fidelityBand: 'costume',
        bands: ['whisper', 'standard', 'costume'],
        bestFit: e.identity.bestFit,
        neverDo: e.neverDo,
      })),
    });
  }
  return pin({
    eras: eras.map((e) => ({
      id: e.id,
      oneLiner: e.identity.oneLiner,
      fidelityBand: 'costume',
      bestFit: (e.identity.bestFit || []).slice(0, 2),
    })),
  });
}

export function getEraSpec({ era, detail } = {}) {
  const e = getEra(era);
  if (!e) {
    return pin({
      error: `Unknown era "${era}"`,
      change: `change era to ${eraIds().join('|')}`,
    });
  }
  const card = eraCard(e);
  if (detail === 'full') {
    return pin({
      id: e.id,
      card,
      axes: e.axes,
      fonts: e.fonts,
      fidelityBand: 'costume',
      bands: (e.fidelity?.bands || []).map((band) => band.id),
      neverDo: e.neverDo,
      dialects: e.dialects || [],
    });
  }
  return pin({
    id: e.id,
    card,
    neverDo: e.neverDo.slice(0, 3),
    fidelityBand: 'costume',
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
  const cssImport = `@groovster/css/${comp.id}.css`;
  const eraImport = eraId ? `@groovster/css/eras/${eraId}.css` : '@groovster/css/eras/<era>.css';
  const html =
    eraId && !comp.canonicalHtml.includes('data-era')
      ? `<div data-era="${eraId}">\n${comp.canonicalHtml}\n</div>`
      : comp.canonicalHtml;

  if (framework && framework !== 'html' && detail !== 'full') {
    return pin({
      name: comp.id,
      note: 'Canonical API is HTML. React wrapper available as @groovster/react.',
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
  const script = comp ? hardWidgetScript(comp.id) : null;
  if (tgt === 'registry' || tgt === 'shadcn') {
    const id = comp ? comp.id : 'button';
    lines.push(`npx shadcn@latest add ${REGISTRY_BASE}/${id}.json`);
    lines.push(`Registry base: ${REGISTRY_BASE} (override with GROOVSTER_REGISTRY_URL).`);
  } else if (tgt === 'copy' || tgt === 'copy-in') {
    lines.push('Copy packages/css/dist/era-widgets.css into your project.');
    if (script) {
      lines.push(
        'Copy packages/elements/dist/era-elements.js (required bundle for hard widgets) and load via <script src="…/era-elements.js">.'
      );
      lines.push(`Optional per-widget file: packages/elements/dist/${script}`);
    } else if (!comp) {
      lines.push('For hard widgets copy packages/elements/dist/era-elements.js.');
    }
    lines.push('Use canonical HTML from get_component; set data-era on a root.');
  } else {
    // Default/npm: packages are unpublished alpha — copy or link from the repo (no pnpm add).
    lines.push(
      'Packages are unpublished alpha — copy or link from the Groovster repo (no published registry package yet).'
    );
    lines.push(
      'Link or copy packages/css/dist/era-widgets.css → node_modules/@groovster/css/dist/era-widgets.css'
    );
    lines.push(
      'Link CSS: <link rel="stylesheet" href="node_modules/@groovster/css/dist/era-widgets.css" />'
    );
    if (script) {
      lines.push(
        'Link or copy packages/elements/dist/era-elements.js → node_modules/@groovster/elements/dist/era-elements.js (required bundle for hard widgets).'
      );
      lines.push('<script src="node_modules/@groovster/elements/dist/era-elements.js"></script>');
      lines.push(`Optional per-widget file: packages/elements/dist/${script}`);
    } else if (!comp) {
      lines.push(
        'For hard widgets, also link/copy packages/elements/dist/era-elements.js → node_modules/@groovster/elements/dist/era-elements.js'
      );
      lines.push('<script src="node_modules/@groovster/elements/dist/era-elements.js"></script>');
    }
  }
  lines.push(
    'Agent skill: copy skills/groovster into .cursor/skills, .claude/skills, or .agents/skills. See docs/agents.md.',
  );
  return pin({
    target: tgt,
    component: comp?.id || null,
    steps: lines,
  });
}

function keywordHit(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i').test(text);
}

function recipeTerms(recipe) {
  const terms = [...(recipe.keywords || [])];
  if (recipe.id && !terms.includes(recipe.id)) terms.push(recipe.id);
  for (const part of String(recipe.name || '').toLowerCase().split(/[^a-z0-9]+/)) {
    if (part.length > 2 && !terms.includes(part)) terms.push(part);
  }
  return terms;
}

function scoreRecipe(recipe, text, { keywordsOnly = false } = {}) {
  const terms = keywordsOnly ? recipe.keywords || [] : recipeTerms(recipe);
  let hits = 0;
  const matched = [];
  for (const word of terms) {
    if (!keywordHit(text, word)) continue;
    hits += 1;
    matched.push(word);
  }
  return { hits, matched, rank: hits * 1000 + (recipe.priority || 0) };
}

function matchRecipe(text) {
  let best = null;
  let bestRank = -1;
  for (const recipe of loadRecipes()) {
    const scored = scoreRecipe(recipe, text, { keywordsOnly: true });
    if (!scored.hits || scored.rank <= bestRank) continue;
    best = recipe;
    bestRank = scored.rank;
  }
  return best;
}

function recipeAdvice(recipe) {
  if (!recipe) return null;
  return {
    id: recipe.id,
    summary: recipe.summary,
    era: recipe.eras.recommended[0],
    eras: recipe.eras.recommended,
    fidelity: recipe.fidelity.page,
    components: recipe.components.required,
    card: `data/llms/recipe-${recipe.id}.card.txt`,
  };
}

export function findRecipeTool({ query } = {}) {
  const text = String(query || '').toLowerCase();
  const ranked = loadRecipes()
    .map((recipe) => ({ recipe, ...scoreRecipe(recipe, text) }))
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.rank - a.rank || a.recipe.id.localeCompare(b.recipe.id));
  return pin({
    query: text,
    recipes: ranked.map((item) => ({
      ...recipeAdvice(item.recipe),
      rank: item.rank,
      matched: item.matched,
    })),
  });
}

export function recommendTool({ description } = {}) {
  const text = String(description || '').toLowerCase();
  const rules = [
    { test: /(law|legal|luxury|hotel|editorial|finance|brass|jazz)/, era: 'deco', fidelityBand: 'whisper', dialect: null },
    { test: /(synth|neon|game|night|festival|retro.?wave|outrun|cyber)/, era: 'neon', fidelityBand: 'standard', dialect: 'synthwave' },
    { test: /(miami|pastel|day.?glow|vice)/, era: 'neon', fidelityBand: 'standard', dialect: 'miami' },
    { test: /(memphis|confetti|postmodern|squiggle)/, era: 'memphis', fidelityBand: 'standard', dialect: null },
    { test: /(groovy|70s|avocado|disco|funk)/, era: 'groovy', fidelityBand: 'standard', dialect: null },
    { test: /(earth|organic|wellness|craft|linen|moss)/, era: 'earth', fidelityBand: 'standard', dialect: null },
    { test: /(cafe|lifestyle|mid.?century|atomic|playful|product.?stor)/, era: 'mcm-atomic', fidelityBand: 'standard', dialect: 'atomic' },
    { test: /(admin|settings|saas|dashboard|serious|enterprise|default)/, era: 'neutral', fidelityBand: 'whisper', dialect: null },
  ];
  let pick = { era: 'neutral', fidelityBand: 'whisper', dialect: null, reason: 'default quiet system skin' };
  let eraHit = false;
  for (const r of rules) {
    if (r.test.test(text)) {
      pick = { era: r.era, fidelityBand: r.fidelityBand, dialect: r.dialect, reason: `matched /${r.test.source}/` };
      eraHit = true;
      break;
    }
  }
  const recipe = matchRecipe(text);
  if (recipe && !eraHit) {
    pick = {
      era: recipe.eras.recommended[0],
      fidelityBand: recipe.fidelity.page,
      dialect: null,
      reason: `recipe ${recipe.id}`,
    };
  }
  const era = getEra(pick.era);
  return pin({
    era: pick.era,
    fidelityBand: pick.fidelityBand,
    dialect: pick.dialect,
    oneLiner: era?.identity?.oneLiner,
    reason: pick.reason,
    recipe: recipeAdvice(recipe),
  });
}

export function validateTool({ markup, era, detail } = {}) {
  if (typeof markup !== 'string') return pin({ error: 'markup must be a string' });
  if (markup.length > 200000) return pin({ error: 'markup exceeds 200000 characters' });
  return validateMarkup(markup, era, { detail });
}

export const TOOL_DEFS = [
  {
    name: 'list_eras',
    description:
      'List Groovster era packs. Fidelity bands: whisper|standard|costume (costume default; default/signature → standard). Neon/Atomic costume heroes require .ew-hero__stage. Deco: .ew-hero__panel + stepped frames.',
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
        era: { type: 'string', description: eraIds().join(' | ') },
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
    description: 'Suggest era, fidelity, and a website recipe id when one fits. Returns a card path inside this package, not full specs.',
    inputSchema: {
      type: 'object',
      required: ['description'],
      properties: { description: { type: 'string' } },
    },
  },
  {
    name: 'find_recipe',
    description:
      'Rank website recipes for a query. Each hit includes the recommended era, fidelity, and a recipe card path shipped in this package.',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'What the site is, in plain language.' },
      },
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
  try {
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
      case 'find_recipe':
        return findRecipeTool(args);
      case 'validate':
        return validateTool(args);
      default:
        return pin({
          error: `Unknown tool "${name}"`,
          isError: true,
          change: 'change tool to list_eras|get_era_spec|get_component|install|recommend|find_recipe|validate',
        });
    }
  } catch (error) {
    return pin({ error: error instanceof Error ? error.message : String(error), isError: true });
  }
}
