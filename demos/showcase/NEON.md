# Neon library classes

Costume ornament is the default when `data-fidelity-band` is absent. Opt down with `whisper` or `standard` (`default` / `signature` are deprecated aliases).

## Hero

| Class | Role |
| --- | --- |
| `.ew-hero` | Hero shell with dusk/night gradient |
| `.ew-hero__stage` | **Required** horizon band holding sun, mountains, grid (without it the sun collapses and mountains can overlap CTAs) |
| `.ew-hero__grid` | Perspective grid floor (fills the stage) |
| `.ew-hero__sun` | Striped sunset sun on the horizon |
| `.ew-hero__mountains` | Cyan wireframe mountain polyline |
| `.ew-hero__scanlines` | Faint VHS scanline overlay |
| `.ew-hero__content` | Title / script / subtitle / CTA stack (above the stage) |
| `.ew-hero__title` | Chrome metallic headline |
| `.ew-hero__subtitle` | Tracking Orbitron subtitle |
| `.ew-hero__cta` | CTA row |

## Type & marks

| Class | Role |
| --- | --- |
| `.ew-chrome` | Metallic horizon-split chrome type (inherits font-size; `data-size="sm|md|lg"` optional). Hero titles keep the display clamp. |
| `.ew-script` | Hot-pink brush-script overlay (~-8°) |
| `.ew-sun-mark` | Small striped sun for logo / empty states |
| `.ew-section-heading` | Orbitron section title |
| `.ew-scanlines` | Optional page scanline overlay |
| `.ew-tier-card` | Pricing plate with wedge neon frame |
| `.ew-tier-card__price` | Chrome price numeral |

## Acceptance (costume dark / light vs bible)

Blind glance: costume dark and bare read as 80s synthwave without being told. Light is a Miami dusk pink sky with saturated cyan/magenta.

| Motif | Costume dark | Costume light | Notes |
| --- | --- | --- | --- |
| Perspective grid | yes | yes | Magenta/cyan floor, masked fade |
| Striped sunset sun | yes | yes | Half-set on horizon + `.ew-sun-mark` |
| Wireframe mountains | yes | yes | Cyan polyline |
| Neon glow tubes | yes | yes | Cosmetic; borders pass ≥3:1 flat |
| Chrome type | yes | yes | Horizon-split + white stroke + solid fallback |
| Brush-script overlay | yes | yes | `.ew-script` ~-8° |
| Scanlines / VHS | yes | yes | `pointer-events: none`; reduced-motion / forced-colors mute |
| Wedge geometry | yes | yes | SVG-mask frames (border follows cut) |

### Still imperfect

- `~/groovster-bible/neon/contact-sheet.png` was not available in this environment for side-by-side pixel review.
- Chrome reads strong; Monoton + gradient can look more tubular/striped than classic metal reflection depending on glyph metrics.
- Wedge frames keep a rectangular layout box (same Deco SVG-mask pattern); the painted border follows the cut.
- Dark active tabs use a glowing underline; light mode uses an ink plate + magenta underline for AA at 13px.
- Whisper correctly strips hero ornament; residual widget selected-tab fill can still read as a plate in some shots.
- Neutral / Deco / MCM border tokens were deepened slightly so the extended non-text ≥3:1 contrast checks pass across every era.
