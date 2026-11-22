import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '../../packages/mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '../../packages/mcp/node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function withClient(fn) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(REPO, 'packages/mcp/src/server.js')],
    cwd: REPO,
    stderr: 'pipe',
  });
  const client = new Client({ name: 'mcp-stdio-test', version: '0.0.0' });
  await client.connect(transport);
  try {
    await fn(client);
  } finally {
    await client.close().catch(() => {});
    await transport.close().catch(() => {});
  }
}

test('stdio tools/list', async () => {
  await withClient(async (client) => {
    const listed = await client.listTools();
    assert.ok(Array.isArray(listed.tools));
    const names = listed.tools.map((t) => t.name);
    for (const n of ['list_eras', 'get_era_spec', 'get_component', 'install', 'recommend', 'validate']) {
      assert.ok(names.includes(n), `missing tool ${n}`);
    }
  });
});

test('stdio valid tools/call', async () => {
  await withClient(async (client) => {
    const result = await client.callTool({ name: 'list_eras', arguments: {} });
    assert.notEqual(result.isError, true);
    const text = result.content?.[0]?.text;
    assert.ok(text);
    const body = JSON.parse(text);
    assert.ok(Array.isArray(body.eras) && body.eras.length > 0);

    const rec = await client.callTool({
      name: 'recommend',
      arguments: { description: 'law firm marketing site' },
    });
    assert.notEqual(rec.isError, true);
    const recBody = JSON.parse(rec.content[0].text);
    assert.equal(recBody.era, 'deco');
  });
});

test('stdio call with bad args (missing required)', async () => {
  await withClient(async (client) => {
    const result = await client.callTool({ name: 'get_era_spec', arguments: {} });
    assert.equal(result.isError, true);
    const text = result.content?.[0]?.text || '';
    assert.match(text, /Missing required|era/i);
  });
});

test('stdio unknown tool', async () => {
  await withClient(async (client) => {
    const result = await client.callTool({ name: 'definitely_not_a_tool', arguments: {} });
    assert.equal(result.isError, true);
    const text = result.content?.[0]?.text || '';
    assert.match(text, /Unknown tool/i);
  });
});
