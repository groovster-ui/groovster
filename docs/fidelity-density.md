# Fidelity and density

Run:

```bash
pnpm fidelity:density
```

The script writes `generated/eval/fidelity-density.json` and screenshots under `generated/eval/shots/`. Those files are measurements, not a preference score.

Read the JSON this way:

- Compare `heroHeight` for the same site across `whisper`, `standard`, and `costume` in neutral, deco, and neon.
- Compare `cellPad` and `cardHeight` when the question is whether ornament crowds a control.
- `coveredCells` counts table cells whose center is painted by another element. A count above zero means ornament is hiding a value.
- `overflow` is a layout failure.
- The reduced-motion sample records `animationDuration` on the deco hero.

Body text should stay at least 4.5:1 against its background. Large display type can use 3:1. The existing contrast check covers token pairs. The recipe browser runs axe on each reference site.

A separate global density control is not part of Groovster. The dashboard recipe uses tighter page CSS. Add a global control only if `coveredCells` shows that costume ornament hides table data and a small, dependency-free change can fix it.

## Measured on this tree

`pnpm fidelity:density` wrote 55 samples. `coveredCells` was 0 in every sample. `overflow` was false at 1280 and at 390. No global density control was added.

Hero height in pixels, desktop, for whisper / standard / costume:

| Site | Neutral | Deco | Neon |
|---|---|---|---|
| Editorial | 175 / 175 / 175 | 404 / 404 / 472 | 368 / 368 / 634 |
| Festival | 207 / 207 / 207 | 624 / 624 / 636 | 704 / 704 / 930 |
| Shop | 175 / 175 / 175 | 404 / 404 / 472 | 260 / 260 / 526 |
| Hotel | 131 / 131 / 131 | 624 / 624 / 624 | 704 / 704 / 918 |
| Dashboard | no hero | no hero | no hero |

Neutral hero height does not change across bands. Neon costume is the large jump, because the stage is in the layout. Deco costume adds a smaller step on the editorial and shop heroes, and deco cards grow from whisper to standard (about 27px) and then stay put.

Dashboard table cells stay at `6px 8px` in every era and band. Card chrome grows (neutral 100px, deco costume 146px, neon costume 169px) without covering a cell.

With `prefers-reduced-motion: reduce`, the deco hero ray animation duration measured `0.00001s` on the four hero sites. The dashboard has no hero animation.

Body font size stayed 16px. These numbers describe layout. They are not a visual-preference score. Screenshots are in `generated/eval/shots/`.
