# Changelog

## Unreleased

### Added

- Swiss International and Bauhaus are first-class eras, with costume geometry, light and dark tokens, reference pages, and recipe routing.

### Changed

- Deco drops the title plate. Hero, card, and dialog frames are 1px brass rules — an outer border plus a hairline inner rule — on the lacquer and ivory palette. The fan, sunburst, and stepped corner ornaments stay. `demos/showcase/DECO.md` describes this look.

### Fixed

- Neon card headers wrap and shrink below 640px so a dashboard card stays inside a 390px viewport.
- Neon and Atomic lay out the shared hero tree (backdrop, stage, panel) so the title stays in the first viewport, above or beside the art.
- Recipe pages no longer force `h1` to weight 400, so era display faces can set their own weight.
- Atomic kidney ornaments stay inside the card and clear of the type.
- The Atomic NEW! starburst keeps the exclamation on the star.
- The Neon perspective floor meets the bottom edge of the hero.

### Breaking

- The Earth era is removed (`data-era="earth"`), including its CSS pack, tokens, recipe default, and fonts that only Earth used. Editorial recipes now default to Swiss.
- `@groovster/tokens` no longer ships per-era `packages/tokens/dist/tier2/<era>.shared.tokens.json` (dropped when the package became independently distributable in PR #18). Mode-specific files replace them: `tier2/<era>.light.tokens.json` and `tier2/<era>.dark.tokens.json`. Cross-component tokens stay at `tier3/components.shared.tokens.json`.
