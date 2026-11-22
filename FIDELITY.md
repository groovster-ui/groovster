# Fidelity API

## Current Implementation

Groovster uses `data-fidelity-band` as the **only** supported fidelity API.

### Valid Values

- `costume` — Full structural ornament. **This is the default** when `data-fidelity-band` is absent.
- `standard` — Clear era geometry with quieter ornament (deprecated aliases: `default`, `signature`).
- `whisper` — Minimal ornament, muted shadows, reduced drama.

The band may be set on the era element **or any ancestor** (e.g. `html` / `body` / `.ew-root`). Costume ornament applies unless a mute band (`whisper` | `standard` | `default` | `signature`) is present on self or an ancestor.

### Usage

```html
<!-- Costume ornament (default — no band attribute needed) -->
<div data-era="deco">...</div>

<!-- Explicit costume (same as omitting the attribute) -->
<div data-era="deco" data-fidelity-band="costume">...</div>

<!-- Quieter geometry -->
<div data-era="deco" data-fidelity-band="standard">...</div>

<!-- Deprecated alias of standard (still works) -->
<div data-era="deco" data-fidelity-band="default">...</div>

<!-- Muted, minimal ornament -->
<div data-era="deco" data-fidelity-band="whisper">...</div>

<!-- Band on an ancestor applies to nested eras -->
<html data-fidelity-band="whisper">
  <div data-era="neon">...</div>
</html>
```

## Decision

**Numeric `data-fidelity` (0–100) is NOT supported.**

Rationale:
- Band-based fidelity provides clear, named presets
- Easier for agents to reason about ("whisper" vs "costume")
- Avoids continuous interpolation complexity
- Matches the CSS architecture (costume-on by default; mute bands opt down)

`--ew-band` resolves from `data-fidelity-band` and inherits. Component/decorator CSS uses discrete band selectors, not continuous opacity curves.
