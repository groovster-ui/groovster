#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateMarkup } from './validate-markup.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(here, '../../..');
const SPEC_EVAL = path.join(REPO, 'spec/eval');
const OUT = path.join(REPO, 'generated/eval');
const writeBaseline = process.argv.includes('--write-baseline');
const setupFilter = (() => {
  const i = process.argv.indexOf('--setup');
  return i >= 0 ? process.argv[i + 1] : null;
})();

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function estimateTokens(text) {
  // Rough placeholder: ~4 chars/token
  return Math.ceil((text || '').length / 4);
}

function runTask(task, setup, fixtureHtml) {
  const validation = validateMarkup(fixtureHtml, task.expect || {});
  const promptTokens = estimateTokens(task.prompt);
  const completionTokens = estimateTokens(fixtureHtml);
  const turns = 1; // golden fixture path = single-turn success placeholder
  const structureScore = validation.pass ? 1 : validation.score;
  const tokenScore = completionTokens <= 400 ? 1 : completionTokens <= 800 ? 0.7 : 0.4;
  const turnScore = turns <= 1 ? 1 : turns <= 3 ? 0.7 : 0.4;
  const weights = { validate: 0.5, structure: 0.2, tokens: 0.15, turns: 0.15 };
  const total =
    weights.validate * validation.score +
    weights.structure * structureScore +
    weights.tokens * tokenScore +
    weights.turns * turnScore;

  return {
    taskId: task.id,
    setupId: setup.id,
    pass: validation.pass,
    scores: {
      validate: Number(validation.score.toFixed(3)),
      structure: Number(structureScore.toFixed(3)),
      tokens: tokenScore,
      turns: turnScore,
      total: Number(total.toFixed(3)),
    },
    metrics: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      turns,
    },
    issues: validation.issues,
    fixes: validation.fixes,
    source: 'fixture',
  };
}

function main() {
  const suite = readJson(path.join(SPEC_EVAL, 'suite.json'));
  const setups = suite.setups.filter((s) => !setupFilter || s.id === setupFilter);
  const results = [];

  for (const setup of setups) {
    for (const taskId of suite.tasks) {
      const task = readJson(path.join(SPEC_EVAL, 'tasks', `${taskId}.json`));
      const fixturePath = path.join(SPEC_EVAL, 'fixtures', `${taskId}.html`);
      if (!fs.existsSync(fixturePath)) {
        results.push({
          taskId,
          setupId: setup.id,
          pass: false,
          scores: { total: 0 },
          issues: [`missing fixture ${fixturePath}`],
          source: 'missing-fixture',
        });
        continue;
      }
      const html = fs.readFileSync(fixturePath, 'utf8');
      results.push(runTask(task, setup, html));
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
    mode: 'fixture-baseline',
    note: 'Live agent runners not automated yet. This records validate/tokens/turns scaffolding against golden fixtures for each setup.',
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
  const latestPath = path.join(OUT, 'latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(summary, null, 2) + '\n');

  if (writeBaseline) {
    const baseline = {
      ...summary,
      baseline: true,
      label: 'fixture-golden-v0',
      recordedNote: 'Placeholder baseline until live Cursor/Claude agent loops land. Do not treat as agent success rate.',
    };
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
    '## How to run',
    '',
    '```bash',
    'pnpm eval                 # score fixtures for all setups',
    'pnpm eval:baseline        # write generated/eval/baseline.json + spec/eval/baseline.json',
    'pnpm eval -- --setup cursor-agent',
    '```',
    '',
    'Live agents: place model output HTML at `spec/eval/runs/<setup>/<taskId>.html` (runner TBD) and re-score.',
    '',
  ];
  fs.writeFileSync(path.join(OUT, 'REPORT.md'), lines.join('\n'));

  const failed = results.filter((r) => !r.pass);
  console.log(`Eval ${suite.name}: ${results.length - failed.length}/${results.length} fixture checks passed across ${setups.length} setups.`);
  for (const [id, s] of Object.entries(summary.setups)) {
    console.log(
      `  ${id}: ${(s.successRate * 100).toFixed(0)}% success, mean tokens ${s.meanTokens.toFixed(0)}, mean turns ${s.meanTurns.toFixed(2)}`
    );
  }
  if (writeBaseline) console.log('Wrote baseline.json');
  if (failed.length) {
    console.error('Failures:');
    for (const f of failed) console.error(`  ${f.setupId}/${f.taskId}: ${f.issues.join('; ')}`);
    process.exit(1);
  }
}

main();
