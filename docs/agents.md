# Using Groovster from an agent

Groovster does not require an account, an API key, or a hosted compiler. Copy files from this repository.

## Skill

The same folder works in each environment:

| Environment | Project path | User path |
|---|---|---|
| Cursor | `.cursor/skills/groovster` | `~/.cursor/skills/groovster` |
| Claude Code | `.claude/skills/groovster` | `~/.claude/skills/groovster` |
| Codex | `.agents/skills/groovster` | `~/.codex/skills/groovster` |

From a project that can see this repo:

```bash
node /path/to/groovster/scripts/install-skill.mjs --all
```

That copies `skills/groovster` into the three project paths. If a destination is already a link to the source, the script leaves it.

Codex also reads `AGENTS.md`. Point a separate app at the skill folder. Do not paste every component document into the prompt.

## CSS and behavior

Copy `packages/css/dist/era-widgets.css` together with `packages/css/dist/fonts/`. The stylesheet loads those fonts with a relative URL.

A page that switches all seven eras can link the full bundle. A page fixed to one era can link `base.css`, the component files it uses, and `eras/<id>.css`.

Hard widgets (tabs, select, menu, popover, tooltip, toast, slider) need `packages/elements/dist/era-elements.js`. Published CSS and that script import no packages.

## MCP

Optional. The server is `packages/mcp/src/server.js` over stdio. `recommend` returns an era, a fidelity band, and a recipe card path. It does not return full component specs unless you call `get_component`.

## Limits

Recipes describe composition. They do not add a theme. Payments, accounts, and remote images are out of scope. Fidelity is `whisper`, `standard`, or `costume` on the same element as `data-era`, or on an ancestor.
