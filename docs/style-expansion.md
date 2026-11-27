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

Before release, regenerate all outputs with `pnpm gen`, run `pnpm check`, browser and accessibility tests, package size checks and MCP smoke tests. Review default and each dialect in both modes and all three bands against reference designs. This is an initial source implementation, not a visually validated release.
