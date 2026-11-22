#!/usr/bin/env node
/**
 * End-to-end: serve the built registry and fetch a component JSON as shadcn would.
 * Full `npx shadcn add` needs a real project scaffold; we validate the registry
 * contract (HTTP 200 + required fields) against GROOVSTER_REGISTRY_URL or local.
 */
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REG = path.join(REPO, 'registry');
const BASE = process.env.GROOVSTER_REGISTRY_URL;

async function checkItem(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const json = await res.json();
  if (!json.name || !json.files?.length) throw new Error(`Invalid registry item at ${url}`);
  if (!json.files.some((f) => f.content || f.path)) throw new Error(`Missing file payload at ${url}`);
  return json.name;
}

if (BASE) {
  const name = await checkItem(`${BASE.replace(/\/$/, '')}/button.json`);
  console.log(`Registry e2e OK (remote): ${name}`);
  process.exit(0);
}

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(REG, url.replace(/^\//, ''));
  if (!file.startsWith(REG) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end('missing');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();
const localBase = `http://127.0.0.1:${port}/r`;
try {
  const components = ['button', 'tabs', 'select', 'card', 'dialog'];
  for (const id of components) {
    const name = await checkItem(`${localBase}/${id}.json`);
    console.log(`  ok ${name}`);
  }
  // Simulate shadcn-style add URL
  console.log(`Registry e2e OK. Example: npx shadcn@latest add ${localBase}/button.json`);
} finally {
  server.close();
}
