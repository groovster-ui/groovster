import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './paths.js';

/**
 * The only era list. Every checker, demo switcher, and fixture reads this
 * catalog (spec/eras/<id>/era.spec.json) instead of a handwritten array.
 */
export function loadEraCatalog(repoRoot = REPO_ROOT) {
  const dir = path.join(repoRoot, 'spec/eras');
  if (!fs.existsSync(dir)) throw new Error(`Era specs are missing at ${dir}`);
  const eras = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const specPath = path.join(dir, entry.name, 'era.spec.json');
    if (!fs.existsSync(specPath)) continue;
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    if (!spec.id) throw new Error(`${specPath} has no id`);
    eras.push(spec);
  }
  if (!eras.length) throw new Error(`No era specs found in ${dir}`);
  return eras.sort((a, b) => a.id.localeCompare(b.id));
}

export function listEraIds(repoRoot = REPO_ROOT) {
  return loadEraCatalog(repoRoot).map((era) => era.id);
}

export function eraSwitchEntries(repoRoot = REPO_ROOT) {
  return loadEraCatalog(repoRoot).map((era) => [era.id, era.name]);
}
