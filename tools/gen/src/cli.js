#!/usr/bin/env node
import { validateAll } from './validate.js';
import { generateAll } from './generate.js';
import { checkBudgets } from './budgets.js';
import { checkDriftAndBudgets } from './check.js';
import { checkNoImports } from './no-imports.js';

const cmd = process.argv[2] || 'gen';

function fail(msg, detail) {
  console.error(msg);
  if (detail) console.error(JSON.stringify(detail, null, 2));
  process.exit(1);
}

if (cmd === 'validate') {
  const errors = validateAll();
  if (errors.length) fail('Spec validation failed', errors);
  console.log('OK: all component, era, and token specs validate.');
  process.exit(0);
}

if (cmd === 'gen') {
  const errors = validateAll();
  if (errors.length) fail('Spec validation failed', errors);
  const manifest = generateAll();
  const budgetFailures = checkBudgets(manifest);
  if (budgetFailures.length) fail('Output exceeded size budgets', budgetFailures);
  console.log(`Generated ${manifest.outputs.length} files.`);
  console.log(`Components: ${manifest.components.join(', ')}`);
  console.log(`Eras: ${manifest.eras.join(', ')}`);
  process.exit(0);
}

if (cmd === 'check') {
  const result = checkDriftAndBudgets();
  if (result.validationErrors.length) fail('Spec validation failed', result.validationErrors);
  if (result.buildErrors?.length) fail('Generator build failed', result.buildErrors);
  if (result.drift.length) fail('Generated files drifted (hand-edits or stale). Re-run pnpm gen and commit.', result.drift);
  if (result.budgetFailures.length) fail('Output exceeded size budgets', result.budgetFailures);
  const imports = checkNoImports();
  if (imports.length) fail('Published outputs must import nothing (@import / ESM import / require forbidden)', imports);
  console.log('OK: validation, budgets, drift, and no-import checks passed.');
  process.exit(0);
}

if (cmd === 'no-imports') {
  const imports = checkNoImports();
  if (imports.length) fail('Published outputs must import nothing', imports);
  console.log('OK: no @import / module imports in published CSS/JS.');
  process.exit(0);
}

fail(`Unknown command: ${cmd}. Use gen | validate | check`);
