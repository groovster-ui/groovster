# Badge

> Generated from `spec/components/badge.json`. Do not hand-edit.

Count or status dot for labels, nav, and reactions.

## Canonical HTML

```html
<span class="ew-badge">3</span>
```

## Imports

- `@groovster/css/badge.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): count | dot | neutral (default: count)

## ARIA

- Role: status
- A count needs visible text. A dot sets data-variant=dot and an aria-label on the parent.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
