# Eval report — groovster-agent-harness-v1

Deterministic docs, MCP, and hybrid runners. Token counts are wordpiece heuristics, not provider usage. This is not a live LLM benchmark.

Live model evaluation: not-run — Pass --live with GROOVSTER_EVAL_PROVIDER and an API key. Ordinary CI does not call a model.

## Setups
- **docs-agent**: success 100% (33/33), mean score 0.954, mean tokens 787, mean turns 3.55
- **mcp-agent**: success 100% (33/33), mean score 0.881, mean tokens 1809, mean turns 5.55
- **hybrid-agent**: success 100% (33/33), mean score 0.929, mean tokens 1488, mean turns 3.55
