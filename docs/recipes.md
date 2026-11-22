# Website recipes

Recipes are composition notes. The HTML stays the same when `data-era` changes.

| Recipe | Demo | Default era |
|---|---|---|
| editorial | `demos/recipes/editorial/` | earth, costume |
| event | `demos/recipes/event/` | neon, dark, costume |
| commerce | `demos/recipes/commerce/` | groovy, standard |
| hospitality | `demos/recipes/hospitality/` | deco, costume |
| dashboard | `demos/recipes/dashboard/` | neutral, whisper |

Generated cards: `generated/llms/recipe-<id>.card.txt`. The skill copies those cards into `skills/groovster/references/`. The MCP package ships the same cards at `data/llms/recipe-<id>.card.txt`.

## Add a recipe

1. Add `spec/recipes/<id>.json` that matches `spec/schema/recipe.schema.json`.
2. Add `demos/recipes/<id>/index.html` with `data-recipe`, `data-era`, `data-mode`, `data-fidelity-band`, and the required section ids.
3. Keep one hero tree (stage plus panel) unless the recipe documents a deviation. The dashboard omits `.ew-hero`.
4. Run `pnpm gen`.
5. Mention the id in `skills/groovster/SKILL.md`.

`recommend` matches keywords on word boundaries, then ranks by hit count and `priority`. Do not reuse a keyword that already routes an era test, such as wellness, organic, craft, or cafe.

Serve the demos from the repository root. Paths are relative to each page. `demos/launch/` previews every recipe and every era in one frame.
