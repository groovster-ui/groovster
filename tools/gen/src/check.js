import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from './paths.js';
import { generateAll } from './generate.js';
import { checkBudgets } from './budgets.js';
import { validateAll } from './validate.js';

/** Generator-owned paths. Runtime reports and package build output are excluded. */
export const OWNED_PREFIXES = [
  'packages/css/dist/',
  'packages/elements/dist/',
  'packages/tokens/dist/',
  'packages/react/src/',
  'packages/mcp/data/',
  'registry/',
  'generated/docs/',
  'generated/llms/',
  'generated/rules/',
  'generated/recipes/',
  'skills/groovster/references/',
];

export const OWNED_FILES = new Set([
  'packages/react/package.json',
  'packages/react/README.md',
  'generated/manifest.json',
  'llms.txt',
  'tests/a11y/fixtures/matrix.html',
]);

export const RUNTIME_PREFIXES = [
  'generated/eval/',
  'generated/a11y/',
  'generated/contrast/',
  'packages/react/dist/',
];

export function isRuntimeArtifact(relPath) {
  return RUNTIME_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

export function isOwnedPath(relPath) {
  if (isRuntimeArtifact(relPath)) return false;
  if (OWNED_FILES.has(relPath)) return true;
  return OWNED_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

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

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

export function buffersEqual(a, b) {
  if (!a || !b) return false;
  return Buffer.isBuffer(a) && Buffer.isBuffer(b) ? a.equals(b) : a === b;
}

/**
 * Compare a committed snapshot, a generation, and a second generation.
 * `owned` is every file currently inside generator-owned roots.
 */
export function classifyDrift({ committed, generated, regenerated, manifest, owned }) {
  const drift = [];
  const manifestSet = new Set(manifest || []);
  const seen = new Set();

  for (const file of manifestSet) {
    seen.add(file);
    if (!generated.has(file)) {
      drift.push({ file, reason: 'missing: listed in the generation manifest but not produced' });
      continue;
    }
    if (!committed.has(file)) {
      drift.push({ file, reason: 'missing from baseline: generator produced a file that is not committed' });
    } else if (!buffersEqual(committed.get(file), generated.get(file))) {
      drift.push({ file, reason: 'modified: committed bytes differ from generator output' });
    }
    if (regenerated && generated.has(file) && !buffersEqual(generated.get(file), regenerated.get(file))) {
      drift.push({ file, reason: 'nondeterministic: a second generation changed the bytes' });
    }
  }

  for (const file of owned || []) {
    if (!isOwnedPath(file) || manifestSet.has(file)) continue;
    drift.push({ file, reason: 'unexpected: generator-owned path is not in the manifest' });
  }

  for (const file of committed.keys()) {
    if (!isOwnedPath(file) || manifestSet.has(file) || generated.has(file)) continue;
    drift.push({ file, reason: 'orphan: committed generated file was not reproduced' });
  }

  return drift.filter((item) => {
    const key = `${item.file}:${item.reason}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function snapshotOwned() {
  const map = new Map();
  const roots = [
    ...OWNED_PREFIXES.map((prefix) => path.join(REPO_ROOT, prefix)),
    ...OWNED_FILES,
  ];
  for (const root of roots) {
    const abs = path.isAbsolute(root) ? root : path.join(REPO_ROOT, root);
    if (!fs.existsSync(abs)) continue;
    const files = fs.statSync(abs).isDirectory() ? walkFiles(abs) : [abs];
    for (const file of files) {
      const relPath = toPosix(path.relative(REPO_ROOT, file));
      if (!isOwnedPath(relPath)) continue;
      map.set(relPath, fs.readFileSync(file));
    }
  }
  return map;
}

function listOwnedFiles() {
  return [...snapshotOwned().keys()];
}

export function commandFailure(result, label) {
  if (!result) return `${label} did not run`;
  if (result.error) return `${label} failed to start: ${result.error.message}`;
  if (result.status !== 0) {
    const stderr = result.stderr ? String(result.stderr).trim() : '';
    return `${label} exited ${result.status}${stderr ? `: ${stderr}` : ''}`;
  }
  return null;
}

function restoreSnapshot(before, afterKeys) {
  for (const [relPath, bytes] of before) {
    const abs = path.join(REPO_ROOT, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, bytes);
  }
  for (const relPath of afterKeys) {
    if (before.has(relPath)) continue;
    fs.rmSync(path.join(REPO_ROOT, relPath), { force: true });
  }
}

/**
 * Snapshot committed bytes first, regenerate, then compare.
 * On drift, restore the snapshot so a failed check does not hide the original files.
 */
export function checkDriftAndBudgets() {
  const validationErrors = validateAll();
  if (validationErrors.length) {
    return { ok: false, validationErrors, drift: [], budgetFailures: [], buildErrors: [] };
  }

  const before = snapshotOwned();
  const bundle = spawnSync(process.execPath, [path.join(REPO_ROOT, 'scripts/bundle-elements.mjs')], {
    cwd: path.join(REPO_ROOT, 'packages/elements'),
    encoding: 'utf8',
  });
  const buildErrors = [];
  const bundleError = commandFailure(bundle, 'elements bundle');
  if (bundleError) {
    restoreSnapshot(before, listOwnedFiles());
    return { ok: false, validationErrors: [], drift: [], budgetFailures: [], buildErrors: [bundleError] };
  }

  let afterManifest;
  try {
    afterManifest = generateAll();
  } catch (error) {
    restoreSnapshot(before, listOwnedFiles());
    return {
      ok: false,
      validationErrors: [],
      drift: [],
      budgetFailures: [],
      buildErrors: [`generate failed: ${error.message}`],
    };
  }

  const generated = snapshotOwned();
  let regeneratedManifest;
  try {
    regeneratedManifest = generateAll();
  } catch (error) {
    restoreSnapshot(before, [...generated.keys()]);
    return {
      ok: false,
      validationErrors: [],
      drift: [],
      budgetFailures: [],
      buildErrors: [`second generate failed: ${error.message}`],
    };
  }
  const regenerated = snapshotOwned();
  const manifest = (regeneratedManifest?.outputs || afterManifest.outputs || []).slice().sort();
  const drift = classifyDrift({
    committed: before,
    generated,
    regenerated,
    manifest,
    owned: [...regenerated.keys()],
  });
  const budgetFailures = checkBudgets(afterManifest);

  if (drift.length || budgetFailures.length) {
    restoreSnapshot(before, [...regenerated.keys()]);
  }

  return {
    ok: drift.length === 0 && budgetFailures.length === 0 && buildErrors.length === 0,
    validationErrors: [],
    drift,
    budgetFailures,
    buildErrors,
    manifest: afterManifest,
  };
}

export function checkCommittedFreshness() {
  return checkDriftAndBudgets();
}
