/**
 * Optional real-model evaluation. Not used by ordinary CI.
 * Credentials come from the environment and are never written into reports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dispatch } from '../../../packages/mcp/src/tools.js';
import { validateMarkup } from './validate-markup.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(here, '../../..');
const OUT = path.join(REPO, 'generated/eval/live.json');

const TOOLS = [
  {
    name: 'list_eras',
    description: 'List Groovster eras.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'get_era_spec',
    description: 'Read one era card.',
    parameters: {
      type: 'object',
      properties: { era: { type: 'string' } },
      required: ['era'],
    },
  },
  {
    name: 'get_component',
    description: 'Read canonical HTML for one component.',
    parameters: {
      type: 'object',
      properties: { name: { type: 'string' }, era: { type: 'string' } },
      required: ['name'],
    },
  },
  {
    name: 'validate',
    description: 'Validate markup. Returns pass and exact fixes.',
    parameters: {
      type: 'object',
      properties: { markup: { type: 'string' }, era: { type: 'string' } },
      required: ['markup'],
    },
  },
];

/** USD per token. Used only when a provider does not return a price. */
const PRICE_PER_TOKEN = {
  'gpt-4.1-mini': { input: 0.4 / 1e6, output: 1.6 / 1e6 },
  'gpt-4.1': { input: 2 / 1e6, output: 8 / 1e6 },
  'claude-sonnet-4-5': { input: 3 / 1e6, output: 15 / 1e6 },
  'claude-haiku-4-5': { input: 1 / 1e6, output: 5 / 1e6 },
};

export function resolveLiveConfig() {
  const provider = process.env.GROOVSTER_EVAL_PROVIDER || '';
  const openai = process.env.OPENAI_API_KEY;
  const anthropic = process.env.ANTHROPIC_API_KEY;
  if (provider === 'openai' || (!provider && openai && !anthropic)) {
    if (!openai) return { error: 'OPENAI_API_KEY is not set' };
    return { provider: 'openai', model: process.env.GROOVSTER_EVAL_MODEL || 'gpt-4.1-mini', apiKey: openai };
  }
  if (provider === 'anthropic' || (!provider && anthropic)) {
    if (!anthropic) return { error: 'ANTHROPIC_API_KEY is not set' };
    return {
      provider: 'anthropic',
      model: process.env.GROOVSTER_EVAL_MODEL || 'claude-haiku-4-5',
      apiKey: anthropic,
    };
  }
  return { error: 'Set GROOVSTER_EVAL_PROVIDER=openai|anthropic and the matching API key. No live calls were made.' };
}

function estimateCost(model, inputTokens, outputTokens) {
  const price = PRICE_PER_TOKEN[model];
  if (!price || inputTokens == null || outputTokens == null) {
    return { costUsd: null, costSource: 'unavailable' };
  }
  return {
    costUsd: Number((inputTokens * price.input + outputTokens * price.output).toFixed(6)),
    costSource: 'estimate',
  };
}

function extractHtml(text) {
  const fenced = String(text || '').match(/```html\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const start = String(text || '').search(/<(?:div|article|button|form|dialog|label|nav|ew-[\w-]+)\b/i);
  return start >= 0 ? text.slice(start).trim() : '';
}

async function openaiTurn({ apiKey, model, messages, tools }) {
  const started = Date.now();
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages,
      tools: tools.map((tool) => ({ type: 'function', function: tool })),
    }),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error?.message || `OpenAI HTTP ${response.status}`);
  }
  const message = json.choices?.[0]?.message || {};
  return {
    message,
    text: message.content || '',
    toolCalls: (message.tool_calls || []).map((call) => ({
      id: call.id,
      name: call.function?.name,
      arguments: JSON.parse(call.function?.arguments || '{}'),
    })),
    inputTokens: json.usage?.prompt_tokens ?? null,
    outputTokens: json.usage?.completion_tokens ?? null,
    tokenSource: json.usage ? 'provider' : 'unavailable',
    model: json.model || model,
    latencyMs: Date.now() - started,
  };
}

async function anthropicTurn({ apiKey, model, messages, tools }) {
  const started = Date.now();
  const system = messages.filter((item) => item.role === 'system').map((item) => item.content).join('\n');
  const chat = messages.filter((item) => item.role !== 'system');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      temperature: 0,
      system,
      tools: tools.map((tool) => ({ name: tool.name, description: tool.description, input_schema: tool.parameters })),
      messages: chat,
    }),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error?.message || `Anthropic HTTP ${response.status}`);
  }
  const blocks = json.content || [];
  const text = blocks.filter((block) => block.type === 'text').map((block) => block.text).join('\n');
  const toolCalls = blocks.filter((block) => block.type === 'tool_use').map((block) => ({
    id: block.id,
    name: block.name,
    arguments: block.input || {},
  }));
  return {
    message: { role: 'assistant', content: blocks },
    text,
    toolCalls,
    inputTokens: json.usage?.input_tokens ?? null,
    outputTokens: json.usage?.output_tokens ?? null,
    tokenSource: json.usage ? 'provider' : 'unavailable',
    model: json.model || model,
    latencyMs: Date.now() - started,
  };
}

function docsFor(mode) {
  if (mode === 'mcp') return '';
  const index = fs.readFileSync(path.join(REPO, 'generated/llms/llms.txt'), 'utf8');
  if (mode === 'hybrid') return index;
  const extras = ['button', 'card', 'dialog', 'text-field', 'switch', 'tabs']
    .map((id) => {
      const file = path.join(REPO, 'generated/llms', `${id}.md`);
      return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    })
    .join('\n');
  return `${index}\n${extras}`;
}

async function runOne({ config, task, mode }) {
  const tools = mode === 'docs' ? [] : TOOLS;
  const system = [
    'You are implementing a Groovster UI. Reply with one HTML document using ew-* classes.',
    'Fidelity is data-fidelity-band="whisper|standard|costume". Costume is the default. Do not emit numeric data-fidelity.',
    'Do not invent components. Use the documentation and tools you are given. The expected answer is not included.',
  ].join(' ');
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: `${docsFor(mode)}\n\nTask:\n${task.prompt}` },
  ];
  let inputTokens = 0;
  let outputTokens = 0;
  let providerTokens = false;
  let latencyMs = 0;
  let toolCalls = 0;
  let model = config.model;
  const started = Date.now();

  for (let turn = 0; turn < 6; turn += 1) {
    const step = config.provider === 'anthropic'
      ? await anthropicTurn({ ...config, messages, tools })
      : await openaiTurn({ ...config, messages, tools });
    latencyMs += step.latencyMs;
    model = step.model || model;
    if (step.tokenSource === 'provider') {
      providerTokens = true;
      inputTokens += step.inputTokens || 0;
      outputTokens += step.outputTokens || 0;
    }
    if (!step.toolCalls.length) {
      const html = extractHtml(step.text);
      const struct = validateMarkup(html, task.expect || {});
      const cost = estimateCost(model, providerTokens ? inputTokens : null, providerTokens ? outputTokens : null);
      return {
        taskId: task.id,
        mode,
        model,
        provider: config.provider,
        pass: struct.pass,
        html,
        issues: struct.issues,
        turns: turn + 1,
        toolCalls,
        inputTokens: providerTokens ? inputTokens : null,
        outputTokens: providerTokens ? outputTokens : null,
        tokenSource: providerTokens ? 'provider' : 'unavailable',
        latencyMs: Date.now() - started,
        ...cost,
      };
    }
    toolCalls += step.toolCalls.length;
    if (config.provider === 'anthropic') {
      messages.push({ role: 'assistant', content: step.message.content });
      messages.push({
        role: 'user',
        content: step.toolCalls.map((call) => ({
          type: 'tool_result',
          tool_use_id: call.id,
          content: JSON.stringify(dispatch(call.name, call.arguments)),
        })),
      });
    } else {
      messages.push(step.message);
      for (const call of step.toolCalls) {
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(dispatch(call.name, call.arguments)),
        });
      }
    }
  }

  return {
    taskId: task.id,
    mode,
    model,
    provider: config.provider,
    pass: false,
    issues: ['stopped after 6 turns without HTML'],
    turns: 6,
    toolCalls,
    inputTokens: providerTokens ? inputTokens : null,
    outputTokens: providerTokens ? outputTokens : null,
    tokenSource: providerTokens ? 'provider' : 'unavailable',
    latencyMs,
    ...estimateCost(model, providerTokens ? inputTokens : null, providerTokens ? outputTokens : null),
  };
}

export async function runLiveEvaluation({ tasks }) {
  const config = resolveLiveConfig();
  if (config.error) {
    const report = { status: 'not-run', reason: config.error, results: [] };
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');
    return report;
  }
  const modes = ['docs', 'mcp', 'hybrid'];
  const results = [];
  for (const task of tasks) {
    for (const mode of modes) {
      try {
        results.push(await runOne({ config, task, mode }));
      } catch (error) {
        results.push({
          taskId: task.id,
          mode,
          model: config.model,
          provider: config.provider,
          pass: false,
          issues: [error.message],
          tokenSource: 'unavailable',
          costSource: 'unavailable',
          costUsd: null,
        });
      }
    }
  }
  const failed = results.filter((item) => !item.pass).length;
  const report = {
    status: 'completed',
    reason: null,
    provider: config.provider,
    model: config.model,
    repeatedTrials: 1,
    note: 'One trial per task and mode. Provider token fields are usage from the API. costUsd is an estimate unless costSource says otherwise.',
    passed: results.length - failed,
    failed,
    total: results.length,
    results,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + '\n');
  return report;
}
