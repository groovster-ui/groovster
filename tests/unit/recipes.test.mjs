import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateAll } from '../../tools/gen/src/validate.js';
import { loadRecipes, recipeCard } from '../../tools/gen/src/recipes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('recipe specs validate', () => {
  assert.deepEqual(validateAll(), []);
});

test('recipes and portable skill', () => {
  const recipes = loadRecipes();
  assert.deepEqual(recipes.map((recipe) => recipe.id), ['chat', 'commerce', 'dashboard', 'editorial', 'event', 'hospitality', 'mail', 'marketplace', 'personal', 'streaming']);
  const skill = fs.readFileSync(path.join(root, 'skills/groovster/SKILL.md'), 'utf8');
  assert.ok(skill.startsWith('---\nname: groovster\n'));
  assert.equal(skill.includes('disable-model-invocation'), false);
  assert.ok(fs.existsSync(path.join(root, 'skills/groovster/examples/art-deco-hotel.md')));
  assert.ok(fs.existsSync(path.join(root, 'skills/groovster/references/anatomy.md')));
  const anatomy = fs.readFileSync(path.join(root, 'skills/groovster/references/anatomy.md'), 'utf8');
  assert.match(anatomy, /class="ew-hero__panel"/);
  assert.ok(fs.existsSync(path.join(root, 'skills/groovster/references/llms/button.md')));
  assert.equal(skill.includes('generated/llms/'), false);
});

test('generated recipe cards match the skill references', () => {
  for (const recipe of loadRecipes()) {
    const generated = fs.readFileSync(path.join(root, 'generated/llms', `recipe-${recipe.id}.card.txt`), 'utf8');
    const reference = fs.readFileSync(path.join(root, 'skills/groovster/references', `${recipe.id}.md`), 'utf8');
    assert.equal(generated, reference);
    const body = generated.replace(/^GENERATED FILE[\s\S]*?\n\n/, '');
    assert.equal(body, recipeCard(recipe));
  }
});

test('reference sites use Groovster markup and no remote runtime', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'generated/manifest.json'), 'utf8'));
  const byId = new Map(
    manifest.components.map((id) => [
      id,
      JSON.parse(fs.readFileSync(path.join(root, 'spec/components', `${id}.json`), 'utf8')),
    ]),
  );
  for (const recipe of loadRecipes()) {
    const html = fs.readFileSync(path.join(root, recipe.demo.path), 'utf8');
    assert.equal(/https?:\/\//.test(html), false, recipe.id);
    assert.equal(/react|tailwind|cdn\.|fonts\.google/i.test(html), false, recipe.id);
    for (const id of recipe.components.required) {
      const className = byId.get(id).className;
      assert.ok(html.includes(className), `${recipe.id} missing ${className}`);
    }
  }
  for (const name of ['css', 'elements', 'tokens']) {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'packages', name, 'package.json'), 'utf8'));
    assert.equal(pkg.dependencies, undefined, name);
    assert.equal(pkg.peerDependencies, undefined, name);
  }
});
