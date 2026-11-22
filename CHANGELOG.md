# Changelog

## Unreleased

### Breaking

- `@groovster/tokens` no longer ships per-era `packages/tokens/dist/tier2/<era>.shared.tokens.json` (dropped when the package became independently distributable in PR #18). Mode-specific files replace them: `tier2/<era>.light.tokens.json` and `tier2/<era>.dark.tokens.json`. Cross-component tokens stay at `tier3/components.shared.tokens.json`.
