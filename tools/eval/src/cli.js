#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateMarkup } from './validate-markup.js';
import { validateMarkup as mcpValidate } from '../../../packages/mcp/src/validate.js';
import { runDocsAgent, runMcpAgent, countTokens } from './agents.js';
import { renderCheck } from './render-check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(here, '../../..');
const SPEC_EVAL = path.join(REPO, 'spec/eval');
const OUT = path.join(REPO, 'generated/eval');
const writeBaseline = process.argv.includes('--write-baseline');
const setupFilter = (() => {
  const i = process.argv.indexOf('--setup');
  return i >= 0 ? process.argv[i + 1] : null;
})();
const skipRender = process.argv.includes('--skip-render');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function runTask(task, setup) {
  const agent =
    setup.mcp
      ? runMcpAgent(task)
      : runDocsAgent(task, { repoRoot: REPO });

  const struct = validateMarkup(agent.html, task.expect || {});
  const era = task.eras?.[0];
  const mcp = mcpValidate(agent.html, era, { detail: 'full' });
  const validatePass = struct.pass && mcp.pass;

  let render = { pass: true, issues: [] };
  if (!skipRender) {
    render = await renderCheck(REPO, agent.html, task.expect || {});
  }

  const pass = validatePass && render.pass;
  const validationScore = validatePass ? 1 : Math.max(0, 1 - (struct.issues.length + (mcp.issues?.length || 0)) * 0.15);
  const structureScore = struct.pass ? 1 : struct.score ?? 0.4;
  const tokenScore =
    agent.totalTokens <= 800 ? 1 : agent.totalTokens <= 1600 ? 0.7 : agent.totalTokens <= 3200 ? 0.45 : 0.25;
  const turnScore = agent.turns <= 3 ? 1 : agent.turns <= 6 ? 0.7 : agent.turns <= 10 ? 0.45 : 0.25;
  const weights = { validate: 0.5, structure: 0.2, tokens: 0.15, turns: 0.15 };
  const total =
    weights.validate * validationScore +
    weights.structure * structureScore +
    weights.tokens * tokenScore +
    weights.turns * turnScore;

  return {
    taskId: task.id,
    setupId: setup.id,
    pass,
    scores: {
      validate: Number(validationScore.toFixed(3)),
      structure: Number(structureScore.toFixed(3)),
      tokens: tokenScore,
      turns: turnScore,
      total: Number(total.toFixed(3)),
    },
    metrics: {
      promptTokens: agent.promptTokens,
      completionTokens: agent.completionTokens,
      totalTokens: agent.totalTokens,
      turns: agent.turns,
      tokenizer: 'wordpiece-heuristic',
    },
    issues: [...struct.issues, ...(mcp.issues || []).map((i) => i.problem || i), ...render.issues],
    fixes: [...struct.fixes, ...(mcp.fixes || [])],
    source: setup.mcp ? 'mcp-agent' : 'docs-agent',
    renderPass: render.pass,
  };
}

async function main() {
  const suite = readJson(path.join(SPEC_EVAL, 'suite.json'));
  // Prefer the two real agent setups (docs vs MCP); allow filter override.
  const preferred = suite.setups.filter((s) => s.id === 'docs-agent' || s.id === 'mcp-agent');
  const setups = (preferred.length >= 2 ? preferred : suite.setups).filter(
    (s) => !setupFilter || s.id === setupFilter
  );
  const results = [];

  for (const setup of setups) {
    for (const taskId of suite.tasks) {
      const task = readJson(path.join(SPEC_EVAL, 'tasks', `${taskId}.json`));
      results.push(await runTask(task, setup));
    }
  }

  const bySetup = {};
  for (const r of results) {
    bySetup[r.setupId] ??= { passed: 0, total: 0, tokenSum: 0, turnSum: 0, scoreSum: 0 };
    const b = bySetup[r.setupId];
    b.total += 1;
    if (r.pass) b.passed += 1;
    b.tokenSum += r.metrics?.totalTokens || 0;
    b.turnSum += r.metrics?.turns || 0;
    b.scoreSum += r.scores?.total || 0;
  }

  const summary = {
    suite: suite.name,
    version: suite.version,
    generatedAt: new Date().toISOString(),
    mode: 'live-agent-harness',
    note: 'Docs-agent vs MCP-agent: real tool/doc I/O token counts, turn counts, validate + Playwright render check.',
    setups: Object.fromEntries(
      Object.entries(bySetup).map(([id, b]) => [
        id,
        {
          successRate: b.total ? b.passed / b.total : 0,
          meanScore: b.total ? b.scoreSum / b.total : 0,
          meanTokens: b.total ? b.tokenSum / b.total : 0,
          meanTurns: b.total ? b.turnSum / b.total : 0,
          passed: b.passed,
          total: b.total,
        },
      ])
    ),
    results,
  };

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'latest.json'), JSON.stringify(summary, null, 2) + '\n');

  if (writeBaseline) {
    const baseline = { ...summary, baseline: true, label: 'agent-harness-v1' };
    fs.writeFileSync(path.join(OUT, 'baseline.json'), JSON.stringify(baseline, null, 2) + '\n');
    fs.writeFileSync(path.join(SPEC_EVAL, 'baseline.json'), JSON.stringify(baseline, null, 2) + '\n');
  }

  const lines = [
    `# Eval report — ${suite.name}`,
    '',
    summary.note,
    '',
    '## Setups',
    ...Object.entries(summary.setups).map(
      ([id, s]) =>
        `- **${id}**: success ${(s.successRate * 100).toFixed(0)}% (${s.passed}/${s.total}), mean score ${s.meanScore.toFixed(3)}, mean tokens ${s.meanTokens.toFixed(0)}, mean turns ${s.meanTurns.toFixed(2)}`
    ),
    '',
  ];
  fs.writeFileSync(path.join(OUT, 'REPORT.md'), lines.join('\n'));

  const failed = results.filter((r) => !r.pass);
  console.log(
    `Eval ${suite.name}: ${results.length - failed.length}/${results.length} passed across ${setups.length} setups (tokenizer=${countTokens('test') && 'wordpiece'}).`
  );
  for (const [id, s] of Object.entries(summary.setups)) {
    console.log(
      `  ${id}: ${(s.successRate * 100).toFixed(0)}% success, mean tokens ${s.meanTokens.toFixed(0)}, mean turns ${s.meanTurns.toFixed(2)}`
    );
  }
  if (writeBaseline) console.log('Wrote baseline.json');
  if (failed.length) {
    console.error('Failures:');
    for (const f of failed.slice(0, 20)) {
      console.error(`  ${f.setupId}/${f.taskId}: ${f.issues.slice(0, 3).join('; ')}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
