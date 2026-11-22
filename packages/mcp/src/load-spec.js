
import fs from 'node:fs';
import path from 'node:path';
import { SPEC_ROOT } from './paths.js';

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listJson(dir, pred) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...listJson(full, pred));
    else if (pred(full)) out.push(full);
  }
  return out;
}

export function loadComponents() {
  return listJson(path.join(SPEC_ROOT, 'components'), (f) => f.endsWith('.json'))
    .map(readJson)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function loadEras() {
  return listJson(path.join(SPEC_ROOT, 'eras'), (f) => f.endsWith('era.spec.json'))
    .map(readJson)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getComponent(name) {
  const id = String(name || '').toLowerCase().replace(/\s+/g, '-');
  const aliases = { textfield: 'text-field', text_field: 'text-field' };
  const key = aliases[id] || id;
  return loadComponents().find((c) => c.id === key || c.name.toLowerCase() === String(name).toLowerCase()) || null;
}

export function getEra(name) {
  const raw = String(name || '').toLowerCase();
  const eras = loadEras();
  return (
    eras.find((e) => e.id === raw) ||
    eras.find((e) => (e.aliases || []).includes(raw)) ||
    eras.find((e) => e.name.toLowerCase() === raw) ||
    null
  );
}

export function eraCard(era) {
  return (era.card?.lines || []).join('\n');
}
