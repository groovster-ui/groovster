# Era Widgets

**Working title:** Era Widgets · **Repo:** `groovster` · **Never:** Forma UI

CSS-first, **spec-first** UI skins for coding agents. Eras rewrite structure (edges, ornament, surface, elevation, type voice), not just colors. Humans are the secondary audience.

Authority: project roadmap v2 (Agent Store `docs/era-widgets-roadmap-v2.md`).

## Principles (locked)

1. **Spec-first** — components, eras, and tokens live under `spec/`; code/docs/`llms.txt` are **generated**. Hand drift fails CI.
2. **HTML + CSS is the public API** — e.g. `<button class="ew-button" data-variant="primary">`.
3. **Zero JS for the look** — `data-era` × `data-mode` × `data-fidelity`.
4. **Native first** for behavior; small owned web components later for hard widgets.
5. **Agent efficiency** — size budgets on MCP defaults, era cards, and llms sections.

Phase 0 builds the **contract**: schemas, hero specs, Neutral + hero trio packs, generator skeleton, budgets, smoke page. React / Base UI / full MCP are **out of scope** here.

## Repo map

```
spec/schema/          JSON Schemas (component, era, tokens)
spec/components/      Hero widget specs
spec/eras/            Era packs (neutral, deco, mcm-atomic, neon)
spec/tokens/          DTCG-style tokens (tiers 1–3)
spec/budgets/         Agent-facing output size budgets
tools/gen/            `pnpm gen` / validate / drift+budget check
packages/css/dist/    Generated CSS (do not hand-edit)
generated/            Docs stubs + llms sections (generated)
demos/smoke/          Plain HTML era flip page
```

## Setup

```bash
pnpm install
pnpm gen        # validate specs → CSS, docs stubs, llms.txt, budget check
pnpm check      # validate + budgets + fail on hand-drifted generated files
```

## Smoke

```bash
pnpm gen
pnpm exec serve demos/smoke   # or: python3 -m http.server -d demos/smoke 4173
# open the served URL; use the toolbar to flip data-era among neutral | deco | mcm-atomic | neon
```

Or open `demos/smoke/index.html` after `pnpm gen` (CSS path is relative to the repo).

## Adding a component (Phase 0 contract)

1. Write `spec/components/<id>.json` (schema-validated).
2. Run `pnpm gen`.
3. Commit the spec **and** generated outputs together.



## Phase 1 — CSS core + Tabs element

```bash
pnpm gen
pnpm check          # validate + drift/budgets + no-imports + contrast
pnpm no-imports     # published CSS/JS must not @import / import modules
pnpm contrast       # AA contrast on 4 packs (glow ignored)
pnpm test:a11y      # Playwright axe + Tabs keyboard APG
```

Smoke (era **look** flips with zero JS via `:has()` radios):

```bash
python3 -m http.server 4173 --directory demos/smoke
```

Tabs behavior: `<script src="packages/elements/dist/ew-tabs.js">` — dependency-free, **no imports** in the published file. Zag.js not used.

## License

MIT (core). Default era fonts are open-licensed only (OFL).

## Eval (Button + Card starter)

```bash
pnpm eval              # score golden fixtures for cursor-agent + claude-code setups
pnpm eval:baseline     # persist baseline under generated/eval/ and spec/eval/
```

Tasks live in `spec/eval/tasks/` (≥10). Scoring covers validate / structure / tokens / turns.
Live agent automation is not required yet — fixtures establish the harness + baseline placeholder.
See `generated/eval/REPORT.md` after a run.

