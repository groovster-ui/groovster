import fs from 'node:fs';
import path from 'node:path';

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeText(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const normalized = contents.endsWith('\n') ? contents : contents + '\n';
  fs.writeFileSync(file, normalized, 'utf8');
}

export function listFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

export function rel(from, to) {
  return path.relative(from, to).split(path.sep).join('/');
}
