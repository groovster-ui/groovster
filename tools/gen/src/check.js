import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT, runWithOutRoot } from './paths.js';
import { generateAll } from './generate.js';
import { checkBudgets } from './budgets.js';
import { validateAll } from './validate.js';
import { rel } from './io.js';

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

/**
 * Directory trees compared in full under a given root.
 * Under generated/, only gen-owned paths (docs/llms/rules/manifest) — not a11y/contrast/eval.
 */
const TRACKED_DIRS = [
  'packages/css/dist',
  'packages/elements/dist',
  'packages/tokens/dist',
  'registry',
  'generated/docs',
  'generated/llms',
  'generated/rules',
];

/** Generated React package files (exclude node_modules / hand files). */
function reactGeneratedFiles(root) {
  const files = [];
  const srcDir = path.join(root, 'packages/react/src');
  if (fs.existsSync(srcDir)) {
    for (const file of walkFiles(srcDir)) {
      if (/\.(tsx|ts)$/.test(file)) files.push(file);
    }
  }
  for (const name of ['package.json', 'README.md']) {
    const f = path.join(root, 'packages/react', name);
    if (fs.existsSync(f)) files.push(f);
  }
  return files;
}

function snapshot(root) {
  const map = new Map();
  for (const dir of TRACKED_DIRS) {
    const abs = path.join(root, dir);
    for (const file of walkFiles(abs)) {
      map.set(rel(root, file), fs.readFileSync(file, 'utf8'));
    }
  }
  for (const file of reactGeneratedFiles(root)) {
    map.set(rel(root, file), fs.readFileSync(file, 'utf8'));
  }
  const manifest = path.join(root, 'generated/manifest.json');
  if (fs.existsSync(manifest)) {
    map.set('generated/manifest.json', fs.readFileSync(manifest, 'utf8'));
  }
  const llms = path.join(root, 'llms.txt');
  if (fs.existsSync(llms)) {
    map.set('llms.txt', fs.readFileSync(llms, 'utf8'));
  }
  return map;
}

function bundleElements(outRoot) {
  const result = spawnSync(
    process.execPath,
    [path.join(REPO_ROOT, 'scripts/bundle-elements.mjs'), `--out-root=${outRoot}`],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: { ...process.env, GROOVSTER_OUT_ROOT: outRoot },
    }
  );
  if (result.status !== 0) {
    throw new Error(
      `bundle-elements failed (exit ${result.status}): ${result.stderr || result.stdout || ''}`.trim()
    );
  }
}

function generateInto(outRoot) {
  bundleElements(outRoot);
  return runWithOutRoot(outRoot, () => generateAll());
}

function compareSnapshots(committed, generated) {
  const drift = [];

  for (const [file, content] of generated) {
    if (!committed.has(file)) {
      drift.push({
        file,
        reason: 'new: produced by generate but missing from committed tree',
      });
      continue;
    }
    if (committed.get(file) !== content) {
      drift.push({
        file,
        reason: 'stale or hand-edited; regenerated content differs from committed',
      });
    }
  }

  for (const [file] of committed) {
    if (!generated.has(file)) {
      drift.push({
        file,
        reason: 'orphan: present in committed tree but not produced by generate',
      });
    }
  }

  return drift;
}

function compareDeterminism(first, second) {
  const drift = [];
  for (const [file, content] of first) {
    if (!second.has(file)) {
      drift.push({ file, reason: 'generator is non-deterministic (missing on second run)' });
    } else if (second.get(file) !== content) {
      drift.push({ file, reason: 'generator is non-deterministic' });
    }
  }
  for (const [file] of second) {
    if (!first.has(file)) {
      drift.push({ file, reason: 'generator is non-deterministic (extra on second run)' });
    }
  }
  return drift;
}

function rmTemp(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // best-effort cleanup
  }
}

/**
 * Validate specs, regenerate into temp out-roots (never touching the working tree),
 * then compare committed outputs vs fresh generate for drift / orphans / determinism.
 */
export function checkDriftAndBudgets() {
  const validationErrors = validateAll();
  if (validationErrors.length) {
    return { ok: false, validationErrors, drift: [], budgetFailures: [] };
  }

  const temps = [];
  try {
    const tempA = fs.mkdtempSync(path.join(os.tmpdir(), 'groovster-gen-a-'));
    const tempB = fs.mkdtempSync(path.join(os.tmpdir(), 'groovster-gen-b-'));
    temps.push(tempA, tempB);

    const afterManifest = generateInto(tempA);
    const generated = snapshot(tempA);
    const committed = snapshot(REPO_ROOT);

    const drift = compareSnapshots(committed, generated);

    generateInto(tempB);
    const twice = snapshot(tempB);
    drift.push(...compareDeterminism(generated, twice));

    const budgetFailures = checkBudgets(afterManifest);

    return {
      ok: drift.length === 0 && budgetFailures.length === 0,
      validationErrors: [],
      drift,
      budgetFailures,
      manifest: afterManifest,
    };
  } finally {
    for (const dir of temps) rmTemp(dir);
  }
}

export function checkCommittedFreshness() {
  return checkDriftAndBudgets();
}
