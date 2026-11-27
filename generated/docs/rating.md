# Rating

> Generated from `spec/components/rating.json`. Do not hand-edit.

Star rating with a written count.

## Canonical HTML

```html
<div class="ew-rating"></div>
```

## Imports

- `@groovster/css/rating.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: region
- Rating uses the shared app class. Pair a written label with any icon.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
