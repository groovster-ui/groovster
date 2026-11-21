# Eval report — era-widgets-button-card-v0

Live agent runners not automated yet. This records validate/tokens/turns scaffolding against golden fixtures for each setup.

## Setups
- **cursor-agent**: success 100% (12/12), mean score 1.000, mean tokens 135, mean turns 1.00
- **claude-code**: success 100% (12/12), mean score 1.000, mean tokens 135, mean turns 1.00

## How to run

```bash
pnpm eval                 # score fixtures for all setups
pnpm eval:baseline        # write generated/eval/baseline.json + spec/eval/baseline.json
pnpm eval -- --setup cursor-agent
```

Live agents: place model output HTML at `spec/eval/runs/<setup>/<taskId>.html` (runner TBD) and re-score.
