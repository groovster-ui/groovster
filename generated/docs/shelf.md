# Shelf

> Generated from `spec/components/shelf.json`. Do not hand-edit.

Horizontal title row with scroll-snap and keyboard access.

## Canonical HTML

```html
<section class="ew-shelf" aria-label="Continue"><h2 class="ew-shelf__title ew-title--section">Continue</h2><div class="ew-shelf__row" tabindex="0"></div></section>
```

## Imports

- `@groovster/css/shelf.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: region
- The row scrolls on the inline axis. Arrow keys scroll when the row is focused. Children are links or buttons.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
