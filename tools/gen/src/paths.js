import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '../../..');
export const SPEC_ROOT = path.join(REPO_ROOT, 'spec');
export const SCHEMA_ROOT = path.join(SPEC_ROOT, 'schema');
export const GEN_CSS = path.join(REPO_ROOT, 'packages/css/dist');
export const GEN_DOCS = path.join(REPO_ROOT, 'generated/docs');
export const GEN_LLMS = path.join(REPO_ROOT, 'generated/llms');
export const GEN_MANIFEST = path.join(REPO_ROOT, 'generated/manifest.json');
export const BUDGETS_PATH = path.join(SPEC_ROOT, 'budgets/output-budgets.json');
