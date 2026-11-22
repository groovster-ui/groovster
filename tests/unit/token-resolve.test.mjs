import assert from 'node:assert/strict';
import test from 'node:test';
import { collectTokenValues as genCollect, resolveValueAgainst as genResolve } from '../../tools/gen/src/tokens-to-css.js';
import { collectTokenValues as mcpCollect, resolveValueAgainst as mcpResolve } from '../../packages/mcp/src/token-resolve.js';

test('MCP token resolution matches the generator', () => {
  const tree = {
    color: {
      ink: { $type: 'color', $value: '#112233' },
      fg: { $type: 'color', $value: '{color.ink}' },
    },
  };
  const genMap = genCollect(tree);
  const mcpMap = mcpCollect(tree);
  assert.deepEqual([...mcpMap.entries()], [...genMap.entries()]);
  assert.equal(mcpResolve(mcpMap, '{color.fg}'), genResolve(genMap, '{color.fg}'));
});
