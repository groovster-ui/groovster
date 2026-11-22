import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from './paths.js';
import { generateAll } from './generate.js';
import { checkBudgets } from './budgets.js';
import { validateAll } from './validate.js';

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

const TRACKED_ROOTS = [
  path.join(REPO_ROOT, 'packages/css/dist'),
  path.join(REPO_ROOT, 'packages/elements/dist'),
  path.join(REPO_ROOT, 'generated'),
];

function snapshot(roots) {
  const map = new Map();
  for (const root of roots) {
    for (const file of walkFiles(root)) {
      map.set(path.relative(REPO_ROOT, file), fs.readFileSync(file, 'utf8'));
    }
  }
  return map;
}

/**
 * Regenerate in place (deterministic), then:
 * - flag drift vs committed snapshot
 * - flag orphan files that disappeared from a fresh generate
 * - re-run generate for determinism
 * - check agent budgets (including real MCP replies)
 */
export function checkDriftAndBudgets() {
  const validationErrors = validateAll();
  if (validationErrors.length) {
    return { ok: false, validationErrors, drift: [], budgetFailures: [] };
  }

  const before = snapshot(TRACKED_ROOTS);

  // Rebuild elements dist so orphan/stale checks cover published JS too.
  spawnSync(process.execPath, [path.join(REPO_ROOT, 'scripts/bundle-elements.mjs')], {
    cwd: path.join(REPO_ROOT, 'packages/elements'),
    stdio: 'ignore',
  });

  const afterManifest = generateAll();
  const after = snapshot(TRACKED_ROOTS);
  const drift = [];

  for (const [rel, content] of after) {
    if (!before.has(rel)) continue;
    if (before.get(rel) !== content) {
      drift.push({ file: rel, reason: 'stale or hand-edited; regenerated content differs from committed' });
    }
  }

  for (const [rel] of before) {
    if (!after.has(rel)) {
      drift.push({ file: rel, reason: 'orphan: present in tree but not produced by generate' });
    }
  }

  // Determinism: second generate must match
  generateAll();
  const twice = snapshot(TRACKED_ROOTS);
  for (const [rel, content] of after) {
    if (twice.get(rel) !== content) {
      drift.push({ file: rel, reason: 'generator is non-deterministic' });
    }
  }

  const budgetFailures = checkBudgets(afterManifest);

  return {
    ok: drift.length === 0 && budgetFailures.length === 0,
    validationErrors: [],
    drift,
    budgetFailures,
    manifest: afterManifest,
  };
}

export function checkCommittedFreshness() {
  return checkDriftAndBudgets();
}
