# Price

> Generated from `spec/components/price.json`. Do not hand-edit.

Tabular price with an optional was-price and note.

## Canonical HTML

```html
<div class="ew-price"></div>
```

## Imports

- `@groovster/css/price.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: region
- Price uses the shared app class. Pair a written label with any icon.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
