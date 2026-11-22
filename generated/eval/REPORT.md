# Eval report — era-widgets-phase2-v0

Live agent runners not automated yet. This records validate/tokens/turns scaffolding against golden fixtures for each setup.

## Setups
- **cursor-agent**: success 100% (33/33), mean score 1.000, mean tokens 121, mean turns 1.00
- **claude-code**: success 100% (33/33), mean score 1.000, mean tokens 121, mean turns 1.00
- **openai-agent**: success 100% (33/33), mean score 1.000, mean tokens 121, mean turns 1.00
- **cursor-agent-mcp**: success 100% (33/33), mean score 1.000, mean tokens 121, mean turns 1.00

## How to run

```bash
pnpm eval                 # score fixtures for all setups
pnpm eval:baseline        # write generated/eval/baseline.json + spec/eval/baseline.json
pnpm eval -- --setup cursor-agent
```

Live agents: place model output HTML at `spec/eval/runs/<setup>/<taskId>.html` (runner TBD) and re-score.
