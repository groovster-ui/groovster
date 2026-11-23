/**
 * Deterministic website-instruction harness.
 * This does not call a model and does not score visual quality.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { countTokens } from './agents.js';
import { recommendTool } from '../../../packages/mcp/src/tools.js';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const outDir = path.join(repo, 'generated/eval/websites');

const TASKS = [
  {
    id: 'hotel',
    prompt: 'Build an elegant art deco hotel booking website.',
    recipe: 'hospitality',
    sections: ['masthead', 'rooms', 'reserve', 'visit'],
  },
  {
    id: 'festival',
    prompt: 'Create a beautiful 1980s-inspired music festival website with ticket purchasing, schedules, and mobile support.',
    recipe: 'event',
    sections: ['masthead', 'lineup', 'schedule', 'tickets'],
  },
  {
    id: 'editorial',
    prompt: 'Design an editorial publication with a strong reading experience.',
    recipe: 'editorial',
    sections: ['masthead', 'story', 'departments', 'newsletter'],
  },
  {
    id: 'shop',
    prompt: 'Build a small ecommerce application for a boutique home shop.',
    recipe: 'commerce',
    sections: ['masthead', 'filters', 'catalog', 'cart'],
  },
  {
    id: 'dashboard',
    prompt: 'Build an operational dashboard for a dispatch board.',
    recipe: 'dashboard',
    sections: ['masthead', 'metrics', 'filters', 'queues'],
  },
];

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function structural(html, sections) {
  const missing = sections.filter((id) => !html.includes(`id="${id}"`));
  return { ok: missing.length === 0 && html.includes('<html'), missing };
}

function genericHtml(task) {
  const sections = task.sections.map((id) => `<section id="${id}"><h2>${id}</h2></section>`).join('\n');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${task.id}</title></head><body><h1>${task.prompt}</h1>${sections}</body></html>`;
}

function footprint() {
  const full = fs.readFileSync(path.join(repo, 'packages/css/dist/era-widgets.css'));
  const parts = ['base.css', 'button.css', 'card.css', 'text-field.css', 'eras/deco.css'].map((name) =>
    fs.readFileSync(path.join(repo, 'packages/css/dist', name)),
  );
  const selective = Buffer.concat(parts);
  return {
    fullGzip: zlib.gzipSync(full).length,
    selectiveGzip: zlib.gzipSync(selective).length,
    note: 'Demos that switch every era link the full bundle. A fixed era can link base, used components, and that era.',
  };
}

const skill = read('skills/groovster/SKILL.md');
const index = read('llms.txt');
const button = read('generated/llms/button.md');
const card = read('generated/llms/card.md');
const rows = [];
let failed = false;

for (const task of TASKS) {
  const recipeCard = read(`generated/llms/recipe-${task.recipe}.card.txt`);
  const demo = read(`demos/recipes/${task.recipe}/index.html`);
  const generic = genericHtml(task);
  const genericCheck = structural(generic, task.sections);
  const skillCheck = structural(demo, task.sections);
  const advice = recommendTool({ description: task.prompt });
  if (!genericCheck.ok || !skillCheck.ok) failed = true;
  rows.push({
    id: task.id,
    prompt: task.prompt,
    setups: {
      generic: {
        kind: 'plain-html-template',
        tokens: countTokens('Use semantic HTML and CSS. No component library.'),
        structural: genericCheck,
        usesGroovster: false,
      },
      docs: {
        kind: 'instruction-weight',
        tokens: countTokens(index + button + card),
        markupClaim: false,
        note: 'Counts the index plus two component files. Does not generate a page.',
      },
      skill: {
        kind: 'reference-site',
        tokens: countTokens(skill + recipeCard),
        structural: skillCheck,
        note: 'Checks the existing reference site. This is not a model completion.',
      },
      'skill-mcp': {
        kind: 'reference-site-plus-recommend',
        tokens: countTokens(skill + recipeCard + JSON.stringify(advice)),
        toolCalls: 1,
        era: advice.era,
        fidelityBand: advice.fidelityBand,
        recipe: advice.recipe?.id || null,
        structural: skillCheck,
      },
    },
  });
}

const report = {
  live: {
    status: 'not-run',
    reason: 'Live model calls were not authorized.',
    credentialDetected: Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GROOVSTER_EVAL_API_KEY),
  },
  visualQuality: 'not scored',
  footprint: footprint(),
  tasks: rows,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const lines = [
  '# Website instruction harness',
  '',
  'This file is not a visual-quality score and not a live-agent benchmark.',
  `Live models: ${report.live.status}. ${report.live.reason}`,
  `Credential present: ${report.live.credentialDetected}. The value is not recorded.`,
  '',
  `Full CSS gzip: ${report.footprint.fullGzip} bytes. Selective deco page gzip: ${report.footprint.selectiveGzip} bytes.`,
  '',
  '| Task | Generic tokens | Docs tokens | Skill tokens | Skill+MCP tokens | MCP recipe | Skill structure |',
  '|---|---:|---:|---:|---:|---|---|',
];
for (const row of rows) {
  const s = row.setups;
  lines.push(
    `| ${row.id} | ${s.generic.tokens} | ${s.docs.tokens} | ${s.skill.tokens} | ${s['skill-mcp'].tokens} | ${s['skill-mcp'].recipe} | ${s.skill.structural.ok} |`,
  );
}
lines.push('', 'Generic rows are a plain HTML template. Skill rows check the reference sites and instruction size.', '');
fs.writeFileSync(path.join(outDir, 'REPORT.md'), lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
