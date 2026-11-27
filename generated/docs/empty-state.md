# Empty state

> Generated from `spec/components/empty-state.json`. Do not hand-edit.

Title, short explanation, and an optional action when a list or card is empty.

## Canonical HTML

```html
<div class="ew-empty-state"><h2 class="ew-empty-state__title ew-title--panel">Nothing here</h2><p class="ew-empty-state__body">No messages match.</p></div>
```

## Imports

- `@groovster/css/empty-state.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: status
- Pair with .is-empty on the parent list or card. Keep one clear action.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
