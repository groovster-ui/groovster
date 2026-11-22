import fs from 'node:fs';
import path from 'node:path';
import { SPEC_ROOT, outPath } from './paths.js';
import { listFiles, readJson, writeText, rel } from './io.js';

const HEADER = 'GENERATED FILE — do not edit. Source: spec/recipes/. Run: pnpm gen\n\n';

export function loadRecipes() {
  return listFiles(path.join(SPEC_ROOT, 'recipes'), (file) => file.endsWith('.json'))
    .map((file) => readJson(file))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function recipeCard(recipe) {
  const avoid = recipe.eras.avoid.length ? recipe.eras.avoid.join(', ') : 'none';
  const also = recipe.eras.alsoFits.length ? recipe.eras.alsoFits.join(', ') : 'none';
  const optionalSections = recipe.sections.optional.map((section) => section.id).join(', ') || 'none';
  const optionalComponents = recipe.components.optional.join(', ') || 'none';
  const deviations = recipe.eraDeviations.map((item) => `${item.eras.join('|')}: ${item.note}`).join(' ');
  return [
    `# ${recipe.name} (${recipe.id})`,
    recipe.summary,
    `Category: ${recipe.category}`,
    `Eras: ${recipe.eras.recommended.join(', ')}. Also: ${also}. Avoid: ${avoid}.`,
    `Fidelity: page ${recipe.fidelity.page}; forms ${recipe.fidelity.forms}; data ${recipe.fidelity.data}. ${recipe.fidelity.notes}`,
    `Sections: ${recipe.sections.required.map((section) => section.id).join(', ')}. Optional: ${optionalSections}.`,
    `Components: ${recipe.components.required.join(', ')}. Optional: ${optionalComponents}.`,
    `Layout: ${recipe.layouts.join(' ')}`,
    `Responsive (${recipe.responsive.breakpoint}): ${recipe.responsive.behavior}`,
    `Type: ${recipe.typography.priorities.join(' ')}`,
    `Spacing: ${recipe.spacing.priority}`,
    `Density: ${recipe.density}.`,
    `Interactions: ${recipe.interactions.join(' ')}`,
    `A11y: ${recipe.accessibility.join(' ')}`,
    `Ornament: ${recipe.ornament.use.join(' ')} Avoid: ${recipe.ornament.avoid.join(' ')}`,
    `Deviations: ${deviations}`,
    `Demo: ${recipe.demo.path} (${recipe.demo.era}, ${recipe.demo.mode}, ${recipe.demo.fidelity}).`,
    'Same HTML for every era. Set data-era, data-mode, and data-fidelity-band on the root.',
    'Anatomy: references/anatomy.md. Component notes: references/llms/<component>.md.',
    '',
  ].join('\n');
}

export function recipeIndexLines(recipes) {
  if (!recipes.length) return [];
  return [
    '## Recipes (cards: generated/llms/recipe-<id>.card.txt)',
    `${recipes.map((recipe) => recipe.id).join(', ')}. Composition, not a new era.`,
    '',
  ];
}

function anatomyDoc(components) {
  const blocks = components
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((component) => `## ${component.id}\n\n\`\`\`html\n${component.canonicalHtml.trim()}\n\`\`\``);
  return [
    '# Component anatomy',
    '',
    'Canonical HTML only. Load the section you are writing. Full notes are in references/llms/<id>.md.',
    'Set data-era on a root. Fidelity bands: whisper, standard, costume.',
    'One hero tree for every era. Era CSS places the backdrop, stage, and panel.',
    'Hard widgets need @groovster/elements/era-elements.js: ew-tabs, ew-select, ew-menu, ew-popover, ew-tooltip, ew-toast-region, ew-slider.',
    '',
    '## hero',
    '',
    '```html',
    '<section class="ew-hero">',
    '  <div class="ew-hero__backdrop" aria-hidden="true"></div>',
    '  <div class="ew-hero__stage" aria-hidden="true"></div>',
    '  <div class="ew-hero__panel">',
    '    <div class="ew-hero__rays" aria-hidden="true"></div>',
    '    <div class="ew-hero__content">',
    '      <div class="ew-hero__fan" aria-hidden="true"></div>',
    '      <p class="ew-script">Kicker</p>',
    '      <h1 class="ew-hero__title">Title</h1>',
    '      <p class="ew-hero__subtitle">Subtitle</p>',
    '    </div>',
    '  </div>',
    '</section>',
    '```',
    '',
    ...blocks,
    '',
  ].join('\n');
}

export function writeRecipeDocs({ recipes, components, outputs }) {
  const outRoot = outPath('.');
  for (const recipe of recipes) {
    const card = HEADER + recipeCard(recipe);
    const cardPath = outPath('generated/llms', `recipe-${recipe.id}.card.txt`);
    const docPath = outPath('generated/recipes', `${recipe.id}.md`);
    const skillPath = outPath('skills/groovster/references', `${recipe.id}.md`);
    writeText(cardPath, card);
    writeText(docPath, card);
    writeText(skillPath, card);
    outputs.push(rel(outRoot, cardPath), rel(outRoot, docPath), rel(outRoot, skillPath));
  }
  if (!components.length) return;
  const anatomyPath = outPath('skills/groovster/references/anatomy.md');
  writeText(anatomyPath, HEADER + anatomyDoc(components));
  outputs.push(rel(outRoot, anatomyPath));
  const skillLlms = outPath('skills/groovster/references/llms');
  fs.mkdirSync(skillLlms, { recursive: true });
  for (const component of components) {
    const src = outPath('generated/llms', `${component.id}.md`);
    const dest = path.join(skillLlms, `${component.id}.md`);
    fs.copyFileSync(src, dest);
    outputs.push(rel(outRoot, dest));
  }
}
