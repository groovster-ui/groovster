
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

function loadDir(kind, predicate) {
  const dir = path.join(SPEC_ROOT, kind);
  if (!fs.existsSync(dir)) {
    throw new Error(`Groovster ${kind} specs are missing at ${dir}.`);
  }
  const files = listJson(dir, predicate);
  if (!files.length) {
    throw new Error(`Groovster ${kind} specs directory is empty: ${dir}`);
  }
  return files.map(readJson);
}

export function loadComponents() {
  return loadDir('components', (f) => f.endsWith('.json')).sort((a, b) => a.id.localeCompare(b.id));
}

export function loadEras() {
  return loadDir('eras', (f) => f.endsWith('era.spec.json')).sort((a, b) => a.id.localeCompare(b.id));
}

export function loadRecipes() {
  const dir = path.join(SPEC_ROOT, 'recipes');
  if (!fs.existsSync(dir)) return [];
  return listJson(dir, (f) => f.endsWith('.json'))
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
