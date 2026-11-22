#!/usr/bin/env node
/**
 * Install the packed MCP package outside the repo and exercise its tools.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
const repoRoot = path.resolve(pkgRoot, '../..');

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`${command} ${args.join(' ')} failed\n${stderr || stdout}`));
      else resolve(stdout);
    });
  });
}

function frame(message) {
  return `${JSON.stringify(message)}\n`;
}

function readMessages(stream) {
  let buffer = '';
  const queue = [];
  let waiter = null;
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buffer += chunk;
    let newline = buffer.indexOf('\n');
    while (newline !== -1) {
      const line = buffer.slice(0, newline).replace(/\r$/, '');
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf('\n');
      if (!line.trim()) continue;
      queue.push(JSON.parse(line));
      if (waiter) {
        const next = waiter;
        waiter = null;
        next(queue.shift());
      }
    }
  });
  return () => (queue.length ? Promise.resolve(queue.shift()) : new Promise((resolve) => {
    waiter = resolve;
  }));
}

export async function smokeStandalone() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'groovster-mcp-'));
  const packed = (await run('npm', ['pack', '--json', '--pack-destination', tmp], pkgRoot)).trim();
  const meta = JSON.parse(packed.slice(packed.indexOf('[')));
  const tarball = path.join(tmp, meta[0].filename);
  await run('npm', ['init', '-y'], tmp);
  await run('npm', ['install', '--ignore-scripts', tarball], tmp);
  const installed = path.join(tmp, 'node_modules', '@groovster', 'mcp');
  const specProbe = await run(process.execPath, ['--input-type=module', '-e', `import { SPEC_ROOT } from '${installed}/src/paths.js'; if (SPEC_ROOT.startsWith(${JSON.stringify(repoRoot)})) process.exit(2); console.log(SPEC_ROOT);`], tmp);
  if (!specProbe.includes(path.join(installed, 'data'))) {
    throw new Error(`Standalone MCP resolved specs outside the install: ${specProbe}`);
  }
  const child = spawn(process.execPath, [path.join(installed, 'src/server.js')], {
    cwd: tmp,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const next = readMessages(child.stdout);
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });
  let id = 0;
  const request = async (method, params) => {
    const msg = { jsonrpc: '2.0', id: ++id, method, params };
    child.stdin.write(frame(msg));
    const reply = await Promise.race([
      next(),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out waiting for ${method}${stderr ? `\n${stderr}` : ''}`)), 20000)),
    ]);
    if (reply.error) throw new Error(reply.error.message || JSON.stringify(reply.error));
    return reply.result;
  };
  await request('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'groovster-smoke', version: '0.0.0' },
  });
  child.stdin.write(frame({ jsonrpc: '2.0', method: 'notifications/initialized' }));
  const listed = await request('tools/list', {});
  const names = listed.tools.map((tool) => tool.name).sort();
  const expected = ['get_component', 'get_era_spec', 'install', 'list_eras', 'recommend', 'validate'];
  if (names.join() !== expected.join()) {
    throw new Error(`Unexpected tools: ${names.join(', ')}`);
  }
  const eras = await request('tools/call', { name: 'list_eras', arguments: {} });
  const eraText = eras.content?.[0]?.text || '';
  if (!eraText.includes('deco')) throw new Error(`list_eras missing deco: ${eraText.slice(0, 200)}`);
  const component = await request('tools/call', { name: 'get_component', arguments: { name: 'button', era: 'deco' } });
  const componentText = component.content?.[0]?.text || '';
  if (!componentText.includes('ew-button')) throw new Error('get_component did not return button markup');
  const era = await request('tools/call', { name: 'get_era_spec', arguments: { era: 'deco' } });
  if (!(era.content?.[0]?.text || '').includes('deco')) throw new Error('get_era_spec missed deco');
  const invalid = await request('tools/call', { name: 'validate', arguments: { markup: '<div><button class="ew-button">x</button></div>', era: 'deco' } });
  if (!(invalid.content?.[0]?.text || '').includes('fixes')) throw new Error('validate did not return fixes');
  child.kill();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('Standalone MCP package smoke OK');
}
