# Deco library classes

Costume ornament is the default when `data-fidelity-band` is absent. Opt down with `whisper` or `standard` (`default` / `signature` are deprecated aliases).

The current costume look has no title plate. Frames are 1px brass: an outer border and a 1px inner rule. Surfaces are lacquer and ivory, with Limelight titles in brass. The fan, the bottom sunburst, and the stepped corner ornaments stay. Screenshots in `shots/` are this look.

## Hero

| Class | Role |
| --- | --- |
| `.ew-hero` | Hero shell |
| `.ew-hero__backdrop` | Bottom-center sunburst (scrolls with the hero; not a fixed page layer) |
| `.ew-hero__panel` | 1px gold frame with a 1px inner rule. No title plate |
| `.ew-hero__rays` | Speed lines behind the title |
| `.ew-hero__fan` | Fan crest above the title |
| `.ew-hero__content` | Title / subtitle / CTA stack |
| `.ew-hero__title` | Limelight display title on the panel, not on a separate plate |
| `.ew-hero__subtitle` | Tracking subtitle |
| `.ew-hero__cta` | CTA row |

## Sections & tiers

| Class | Role |
| --- | --- |
| `.ew-section-heading` | Centered section title with flanking chevrons |
| `.ew-tier-card` | Stepped pricing / tier plate |
| `.ew-tier-card__price` | Gold-gradient price numeral |

Centering is opt-in via these classes (or your own layout). Bare `h1`/`h2`/`h3` are uppercase only — not force-centered.
