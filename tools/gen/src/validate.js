import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { REPO_ROOT, SCHEMA_ROOT, SPEC_ROOT } from './paths.js';
import { listFiles, readJson } from './io.js';

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv;
}

export function validateAll() {
  const ajv = createAjv();
  const componentSchema = readJson(path.join(SCHEMA_ROOT, 'component.schema.json'));
  const eraSchema = readJson(path.join(SCHEMA_ROOT, 'era.schema.json'));
  const tokensSchema = readJson(path.join(SCHEMA_ROOT, 'tokens.schema.json'));
  const validateComponent = ajv.compile(componentSchema);
  const validateEra = ajv.compile(eraSchema);
  const validateTokens = ajv.compile(tokensSchema);

  const errors = [];

  for (const file of listFiles(path.join(SPEC_ROOT, 'components'), (f) => f.endsWith('.json'))) {
    const data = readJson(file);
    if (!validateComponent(data)) {
      errors.push({ file, errors: validateComponent.errors });
    }
  }

  for (const file of listFiles(path.join(SPEC_ROOT, 'eras'), (f) => f.endsWith('era.spec.json'))) {
    const data = readJson(file);
    if (!validateEra(data)) {
      errors.push({ file, errors: validateEra.errors });
    }
  }

  for (const file of listFiles(path.join(SPEC_ROOT, 'tokens'), (f) => f.endsWith('.tokens.json'))) {
    const data = readJson(file);
    if (!validateTokens(data)) {
      errors.push({ file, errors: validateTokens.errors });
    }
  }

  const recipeSchemaPath = path.join(SCHEMA_ROOT, 'recipe.schema.json');
  if (fs.existsSync(recipeSchemaPath)) {
    const validateRecipe = ajv.compile(readJson(recipeSchemaPath));
    const componentIds = new Set(
      listFiles(path.join(SPEC_ROOT, 'components'), (f) => f.endsWith('.json')).map((file) => readJson(file).id),
    );
    const eraIds = new Set(
      listFiles(path.join(SPEC_ROOT, 'eras'), (f) => f.endsWith('era.spec.json')).map((file) => readJson(file).id),
    );
    const seen = new Set();
    for (const file of listFiles(path.join(SPEC_ROOT, 'recipes'), (f) => f.endsWith('.json'))) {
      const data = readJson(file);
      if (!validateRecipe(data)) {
        errors.push({ file, errors: validateRecipe.errors });
        continue;
      }
      if (seen.has(data.id)) errors.push({ file, errors: [{ message: `duplicate recipe id ${data.id}` }] });
      seen.add(data.id);
      const componentRefs = [...data.components.required, ...data.components.optional];
      for (const id of componentRefs) {
        if (!componentIds.has(id)) errors.push({ file, errors: [{ message: `unknown component ${id}` }] });
      }
      const eraRefs = [
        ...data.eras.recommended,
        ...data.eras.alsoFits,
        ...data.eras.avoid,
        ...data.eraDeviations.flatMap((item) => item.eras),
      ];
      for (const id of eraRefs) {
        if (!eraIds.has(id)) errors.push({ file, errors: [{ message: `unknown era ${id}` }] });
      }
      const demoPath = path.join(REPO_ROOT, data.demo.path);
      if (!fs.existsSync(demoPath)) {
        errors.push({ file, errors: [{ message: `missing demo ${data.demo.path}` }] });
        continue;
      }
      const html = fs.readFileSync(demoPath, 'utf8');
      for (const attr of ['data-recipe', 'data-era', 'data-mode', 'data-fidelity-band']) {
        if (!html.includes(attr)) errors.push({ file, errors: [{ message: `demo missing ${attr}` }] });
      }
      if (!html.includes(`data-recipe="${data.id}"`)) {
        errors.push({ file, errors: [{ message: `demo data-recipe is not ${data.id}` }] });
      }
      for (const section of data.sections.required) {
        if (!html.includes(`id="${section.id}"`)) {
          errors.push({ file, errors: [{ message: `demo missing section #${section.id}` }] });
        }
      }
      if (/https?:\/\//.test(html)) errors.push({ file, errors: [{ message: 'demo contains a remote URL' }] });
    }
  }

  return errors;
}
