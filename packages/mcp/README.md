# @groovster/mcp

MCP server for Era Widgets. Compact replies by default (`detail: "full"` for more).

## Tools

| Tool | Default return |
|---|---|
| `list_eras` | id, oneLiner, fidelity bands (`whisper\|standard\|costume`; costume default), bestFit (2) |
| `get_era_spec` | 10–20 line era card + top neverDo |
| `get_component` | HTML snippet + CSS import + one a11y note |
| `install` | npm / registry / copy steps |
| `recommend` | era + fidelity + dialect |
| `validate` | `pass` + exact `change X to Y` fixes |

## Run

```bash
pnpm --filter @groovster/mcp start
# Cursor MCP config: command node, args [ "packages/mcp/src/server.js" ], cwd repo root
pnpm --filter @groovster/mcp smoke
```
