# Published outputs — no imports

**Rule:** Consumer-facing distributable files must **import nothing**.

## In scope

| Path | Forbidden |
|---|---|
| `packages/css/dist/**/*.css` | CSS `@import` |
| `packages/elements/dist/**/*.{js,mjs,cjs}` | `import` / `export … from` / `require()` of modules |
| Package root entry JS for elements (if any) | same as above |

Bundles must be self-contained. Era/component CSS is concatenated or linked by the consumer via `<link>` / multiple `<link>` tags — never `@import` inside published CSS.

## Out of scope

- `tools/**` (generator, eval, contrast)
- `demos/**` (may use `<link rel="stylesheet">` and `<script src>` for the Tabs WC)
- `generated/docs`, `generated/llms`

## CI

`pnpm check` runs this gate. `pnpm no-imports` runs it alone.
