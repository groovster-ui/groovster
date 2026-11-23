# Eval report — groovster-harness-self-test-v1

Mode: **harness-self-test**

Deterministic docs, MCP, and hybrid runners. Positive tasks must pass validation. Negative tasks must fail it. Token counts are wordpiece heuristics, not provider usage. This is not a live LLM benchmark.

Live model evaluation: not-run — Pass --live with GROOVSTER_EVAL_PROVIDER and an API key. Ordinary CI does not call a model.

## Setups
- **docs-agent**: success 100% (36/36; 3 negative), mean score 0.939, mean tokens 783, mean turns 3.53
- **mcp-agent**: success 100% (36/36; 3 negative), mean score 0.859, mean tokens 1958, mean turns 5.53
- **hybrid-agent**: success 100% (36/36; 3 negative), mean score 0.912, mean tokens 1503, mean turns 3.53
