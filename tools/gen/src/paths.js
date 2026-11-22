import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
/** Spec/source root — always the real repository (never a temp out root). */
export const REPO_ROOT = path.resolve(here, '../../..');
export const SPEC_ROOT = path.join(REPO_ROOT, 'spec');
export const SCHEMA_ROOT = path.join(SPEC_ROOT, 'schema');
export const BUDGETS_PATH = path.join(SPEC_ROOT, 'budgets/output-budgets.json');

/** Writable output root. Defaults to REPO_ROOT; check.js may point at a temp tree. */
let outRoot = REPO_ROOT;

export function getOutRoot() {
  return outRoot;
}

export function setOutRoot(root) {
  outRoot = root ? path.resolve(root) : REPO_ROOT;
}

/** Run fn with generated outputs redirected to `root` (specs still read from REPO_ROOT). */
export function runWithOutRoot(root, fn) {
  const prev = outRoot;
  outRoot = path.resolve(root);
  try {
    return fn();
  } finally {
    outRoot = prev;
  }
}

export function outPath(...parts) {
  return path.join(outRoot, ...parts);
}

export function getGenCss() {
  return outPath('packages/css/dist');
}
export function getGenDocs() {
  return outPath('generated/docs');
}
export function getGenLlms() {
  return outPath('generated/llms');
}
export function getGenManifest() {
  return outPath('generated/manifest.json');
}
