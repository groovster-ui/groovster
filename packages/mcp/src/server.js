#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { TOOL_DEFS, dispatch } from './tools.js';
import { VERSION } from './paths.js';

const server = new Server(
  { name: 'groovster', version: VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFS.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const name = request.params.name;
    const args = request.params.arguments || {};
    const def = TOOL_DEFS.find((t) => t.name === name);
    if (!def) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool ${name}` }) }],
        isError: true,
      };
    }
    const required = def.inputSchema?.required || [];
    const missing = required.filter((key) => args[key] == null || args[key] === '');
    if (missing.length) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Missing required argument(s): ${missing.join(', ')}`,
            }),
          },
        ],
        isError: true,
      };
    }
    const result = dispatch(name, args);
    if (result && typeof result === 'object' && result.error) {
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
        isError: true,
      };
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: message }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
