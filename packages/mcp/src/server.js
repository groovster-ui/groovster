#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { TOOL_DEFS, dispatch } from './tools.js';
import { VERSION } from './paths.js';

const server = new Server(
  { name: 'era-widgets', version: VERSION },
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
  const name = request.params.name;
  const args = request.params.arguments || {};
  const result = dispatch(name, args);
  const text = JSON.stringify(result, null, 2);
  return {
    content: [{ type: 'text', text }],
    structuredContent: result,
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
