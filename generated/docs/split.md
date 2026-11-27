# Split pane

> Generated from `spec/components/split.json`. Do not hand-edit.

Two-column app split that stacks under 800px.

## Canonical HTML

```html
<div class="ew-split"><div class="ew-split__side"></div><div class="ew-split__main"></div></div>
```

## Imports

- `@groovster/css/split.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: group
- The side and main regions need their own labels when they are navigation or main.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
