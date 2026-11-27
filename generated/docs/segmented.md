# Segmented control

> Generated from `spec/components/segmented.json`. Do not hand-edit.

A single-choice control with radiogroup semantics.

## Canonical HTML

```html
<div class="ew-segmented" role="radiogroup" aria-label="View"><button type="button" class="ew-segmented__item" role="radio" aria-checked="true">List</button><button type="button" class="ew-segmented__item" role="radio" aria-checked="false">Grid</button></div>
```

## Imports

- `@groovster/css/segmented.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: radiogroup
- One item has aria-checked=true. Arrow keys move the check. Only the checked item is in the tab order.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
