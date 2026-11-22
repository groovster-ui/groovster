import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = path.resolve(here, '..');
export const DATA_ROOT = path.join(PACKAGE_ROOT, 'data');
export const VERSION = '0.1.0-alpha.0';

function monorepoSpec() {
  let dir = PACKAGE_ROOT;
  for (let i = 0; i < 5; i += 1) {
    const spec = path.join(dir, 'spec');
    if (
      fs.existsSync(path.join(spec, 'components')) &&
      fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))
    ) {
      return spec;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const packaged = fs.existsSync(path.join(DATA_ROOT, 'components'));
export const SPEC_ROOT = packaged ? DATA_ROOT : monorepoSpec();

if (!SPEC_ROOT) {
  throw new Error(
    '@groovster/mcp is missing specification data. Reinstall the package or run `pnpm gen` in the Groovster repo.'
  );
}

export function assertInsideSpec(file) {
  const root = path.resolve(SPEC_ROOT);
  const resolved = path.resolve(file);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error('Refusing to read a path outside the Groovster specification directory.');
  }
  return resolved;
}

export function safeId(value, label) {
  const text = String(value || '');
  if (!/^[a-z0-9-]+$/.test(text)) {
    throw new Error(`Invalid ${label} "${text}". Expected lowercase letters, numbers, and hyphens.`);
  }
  return text;
}
