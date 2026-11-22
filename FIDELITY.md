# Fidelity API

## Current Implementation

Groovster uses `data-fidelity-band` as the **only** supported fidelity API.

### Valid Values

- `default` - Use era's recommended fidelity (automatically applied)
- `whisper` - Minimal ornament, muted shadows, reduced drama
- `costume` - Full structural ornament (era-dependent availability)

### Usage

```html
<!-- Default fidelity (recommended) -->
<div data-era="deco">...</div>

<!-- Muted, minimal ornament -->
<div data-era="deco" data-fidelity-band="whisper">...</div>

<!-- Full ornament (atomic, neon only) -->
<div data-era="mcm-atomic" data-fidelity-band="costume">...</div>
```

## Decision

**Numeric `data-fidelity` (0-100) is NOT implemented.**

Rationale:
- Band-based fidelity provides clear, named presets
- Easier for agents to reason about ("whisper" vs "costume")  
- Avoids continuous interpolation complexity
- Matches existing CSS architecture

The generator sets `--ew-fidelity-default` from era specs, but no continuous mapping exists. Component CSS uses fidelity bands as discrete selectors.

## For Future Continuous Fidelity

If numeric fidelity is needed later:

1. Add `@property --ew-fidelity` with range 0-100
2. Map bands: whisper = 0-30, default = 31-70, costume = 71-100
3. Use CSS `clamp()` or `calc()` to interpolate ornament opacity
4. Update all 7 era specs with continuous ornament scales

Current architecture supports heavy ornament via decorator slots and backdrop layers, ready for era-authenticity redesign.
