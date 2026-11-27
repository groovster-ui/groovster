# Style expansion: families and dialects

Use existing `data-era` for a family and `data-dialect` for an optional variant. Fidelity remains independent (`data-fidelity-band="whisper|standard|costume"`); mode remains light/dark. Existing era IDs are unchanged.

| Era | New dialects |
| --- | --- |
| nordic | botanical-pop, minimal, folk |
| futurist | mechanical, typographic, aero |
| folklore | woodland, cottage, traditional |
| mcm-atomic | organic |
| deco | riviera |
| groovy | liquid |
| memphis | new-wave |

New Wave is provisionally a Memphis dialect for compatibility with the current flat catalog; it is historically a sibling postmodern movement, not a subset of Memphis. Revisit if a general Postmodern family is introduced. Heritage commercial branding and architectural editorial illustration remain experimental directions, not shipped eras. Reference photographs inspired the design grammar; no artwork is copied.

Example: `<div class="ew-root" data-era="nordic" data-dialect="botanical-pop" data-fidelity-band="standard" data-mode="light">`.

## Design program

Nordic is cut-paper botanical modernism: asymmetric organic surfaces, strong plant silhouettes, restrained humanist controls. Minimal deliberately suppresses artwork; Folk uses a smaller rhythmic border and warmer accents. Futurist is directional print geometry: straight-edged compact controls, compressed display, diagonal mechanical bands; Typographic uses an editorial rule, Aero uses a horizontal speed motif. Folklore is illustrated storybook structure: irregular rounded surfaces, midnight woodland silhouettes, cottage flowers or balanced folk borders. All art is local SVG and decorative, never a source of functional text.

Each family styles hero, card, dialog, input/button geometry, checkbox, switch, chip, badge, navigation, statistics, table, divider, alert and toast. The four existing-family dialects have distinct palettes and component overrides. Costume uses full illustration; Standard removes hero illustration but keeps structural rules; Whisper also removes prominent header rules. Both modes use semantic color roles. The compact layout retains readable body typography.

## Preview and review

Run `pnpm gen` and serve the repository root, then open [Style lab](../demos/showcase/style-lab.html). The lab reads the generated manifest and canonical specs: every era, dialect and component is discovered rather than maintained as a static list. It has a common dashboard, mode/fidelity/density switches and a complete gallery. The browser regression test visits every new dialect in both modes and all three bands, and exercises the new families at phone width. No third-party assets or runtime dependencies were added.

Before release, regenerate all outputs with `pnpm gen`, run `pnpm check`, browser and accessibility tests, package size checks and MCP smoke tests. Review default and each dialect in both modes and all three bands against reference designs. This is an initial source implementation, not a visually validated release.
