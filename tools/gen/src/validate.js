import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { SCHEMA_ROOT, SPEC_ROOT } from './paths.js';
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

  return errors;
}
