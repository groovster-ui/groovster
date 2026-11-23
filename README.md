# Groovster

CSS-first, spec-first UI skins for coding agents. Eras change geometry, typography, ornament, elevation, and surface — not only color. The canonical interface is HTML and CSS. React and MCP are optional layers over that contract.

**Working title:** Era Widgets. **Never:** Forma UI.

Requires Node `>=20` and pnpm `9.15.9` (`packageManager` in the root `package.json`).

## Architecture

| Path | Role |
|---|---|
| `spec/` | Authoritative components, eras, tokens, budgets, and website recipes |
| `tools/gen/` | Deterministic generator |
| `packages/css/` | Dependency-free era and component CSS |
| `packages/elements/` | Light-DOM custom elements for behavior CSS cannot own |
| `packages/react/` | Generated React wrappers. Peer dependency on React. Published from `dist/` |
| `packages/mcp/` | MCP server. Published with a `data/` copy of the specs it needs |
| `registry/` | Generated registry items |
| `generated/` | Generated docs and agent instructions |

Do not hand-edit generator output. Change `spec/` or `tools/gen/`, then run `pnpm gen`.

## Websites

Five reference sites and an every-era preview:

- `demos/recipes/editorial/`, `event/`, `commerce/`, `hospitality/`, `dashboard/`
- `demos/launch/` — one page, every era
- Agent skill: `skills/groovster/SKILL.md`
- Install notes: `docs/agents.md`

## Install and check

```bash
pnpm install --frozen-lockfile
pnpm gen
pnpm check
```

`pnpm check` validates specs, regenerates, and fails on drift, budget overflows, `@import` in published CSS, or module imports in published element scripts.

## HTML and CSS

Link one stylesheet. Full bundle, or a base file plus the components and eras you use:

```html
<link rel="stylesheet" href="node_modules/@groovster/css/era-widgets.css" />
<!-- or @groovster/css/base.css, button.css, eras/deco.css -->
<div class="ew-root" data-era="deco" data-mode="light">
  <button type="button" class="ew-button">Save</button>
</div>
```

Published CSS is self-contained: no `@import`. Fonts are OFL WOFF2 files under `@groovster/css/fonts/*`.

### Fidelity

`data-fidelity-band` is the fidelity API.

- `costume` — full ornament. **Default when the attribute is absent.**
- `standard` — era geometry with quieter ornament.
- `whisper` — minimal ornament.

`default` and `signature` are deprecated aliases of `standard`. Numeric `data-fidelity` is not a supported attribute. The band may sit on the era element or an ancestor. Details: `FIDELITY.md`.

## React

```bash
pnpm react:build
```

```tsx
import { EraRoot, Button, Checkbox } from '@groovster/react';
import '@groovster/css/era-widgets.css';

export function Demo() {
  return (
    <EraRoot era="deco" fidelityBand="costume">
      <Checkbox name="terms" value="yes" label="Accept terms" />
      <Button>Save</Button>
    </EraRoot>
  );
}
```

`fidelityBand` is `whisper`, `standard`, or `costume`. React 18 and 19 are peer-compatible: wrappers use `forwardRef` and do not rely on React 19-only APIs. The package does not bundle React.

Tabs, select, menu, popover, tooltip, toast, and slider render custom elements. Load `@groovster/elements` before those behaviors run:

```html
<script src="node_modules/@groovster/elements/dist/era-elements.js"></script>
```

## MCP

```bash
pnpm mcp
pnpm mcp:smoke
```

`pnpm mcp:smoke` calls the six tools in the repo and again from a packed install outside the repo. Cursor can launch `packages/mcp/src/server.js` over stdio. A published install uses `npx era-widgets-mcp` and the packaged `data/` directory.

Tools: `list_eras`, `get_era_spec`, `get_component`, `install`, `recommend`, `validate`.

## Change a component

1. Edit `spec/components/<id>.json`.
2. Run `pnpm gen`.
3. Commit the spec and the generated files together.

Do not add a framework package for the look. Eras stay in CSS.

## Tests

```bash
pnpm test:unit          # generator, drift classifier, token parity
pnpm react:build && pnpm test:react   # build once, then markup plus browser interaction
pnpm test:elements      # custom-element remount and updates
pnpm test:a11y          # axe, keyboard, responsive metrics
pnpm test:packages      # install packed React and CSS outside the workspace
pnpm mcp:smoke
pnpm eval               # deterministic docs / MCP / hybrid harness
pnpm eval -- --live     # optional real-model run; skipped without an API key
pnpm eval:sites         # recipe instruction weight and reference-site checks
pnpm test:sites         # browser checks for the five reference sites
pnpm sizes              # uncompressed, gzip, and brotli sizes
```

`pnpm eval` is a deterministic harness. Its token counts are heuristics. Live model results are recorded only when `GROOVSTER_EVAL_PROVIDER` and a provider key are set. The report keeps those sections separate and does not invent scores.

`pnpm eval:sites` measures instruction weight and whether the reference sites satisfy their recipes. It does not score visual quality and it does not call a model.

## Known limits

- Era skins are the ids in `spec/eras`. Twenty-one components.
- Vue and Svelte wrappers are not implemented.
- Real-model evaluation is optional and is not a release gate.
- Era spec files still store legacy numeric fidelity ranges because the era schema requires them. Public HTML, React, MCP, and examples use bands.

## Tradeoffs

Groovster stays a CSS-first skin system. React and MCP call the same specs; they are not second implementations of the visuals. JavaScript is limited to widgets whose behavior is not native (tabs, select, menu, popover, tooltip, toast, slider). That keeps the agent-facing markup stable and the published CSS free of a bundler. The cost is that rich widgets need a small element script, and fidelity is three named bands rather than a continuous scale.

Which agent setup is most efficient — docs, MCP, or hybrid — is an empirical question. The deterministic harness compares all three on the same tasks. A live leaderboard requires `pnpm eval -- --live` and is not claimed here.

## License

MIT for the core. Default era fonts are OFL.
