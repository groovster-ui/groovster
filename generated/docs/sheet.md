# Sheet

> Generated from `spec/components/sheet.json`. Do not hand-edit.

Surface for a document or a mobile filter sheet.

## Canonical HTML

```html
<div class="ew-sheet"><div class="ew-sheet__head"></div><div class="ew-sheet__body"></div></div>
```

## Imports

- `@groovster/css/sheet.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: region
- Use data-variant=mobile for a bottom sheet under 600px. Give the region an accessible name.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
