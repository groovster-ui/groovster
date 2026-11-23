import fs from 'node:fs';
import path from 'node:path';

/**
 * Era ids from spec/eras/<id>/era.spec.json, sorted by id.
 * Callers must not keep a separate hardcoded list.
 */
export function listEraIds(repoRoot) {
  const dir = path.join(repoRoot, 'spec/eras');
  if (!fs.existsSync(dir)) {
    throw new Error(`Era specs are missing at ${dir}`);
  }
  const ids = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const specPath = path.join(dir, entry.name, 'era.spec.json');
    if (!fs.existsSync(specPath)) continue;
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    if (!spec.id) throw new Error(`${specPath} has no id`);
    ids.push(spec.id);
  }
  if (!ids.length) throw new Error(`No era specs found in ${dir}`);
  return ids.sort((a, b) => a.localeCompare(b));
}
