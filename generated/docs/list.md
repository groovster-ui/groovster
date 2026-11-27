# List

> Generated from `spec/components/list.json`. Do not hand-edit.

Dense row with a lead, truncated text, and trailing meta. Selected and unread states.

## Canonical HTML

```html
<ul class="ew-list" role="listbox" aria-label="Messages"><li><button type="button" class="ew-list-item is-unread" role="option" aria-selected="false" tabindex="0"><span class="ew-list-item__main"><span class="ew-list-item__primary">Maya Okafor</span><span class="ew-list-item__secondary">The kiln fired clean</span></span><span class="ew-list-item__meta">9:40</span></button></li></ul>
```

## Imports

- `@groovster/css/list.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: listbox
- Roving tabindex: one option tabindex=0, the rest -1. Arrow keys move the tab stop. Home and End jump. Enter or Space selects.
- is-unread is bold plus a marker. aria-selected or .is-selected adds a bar.

## Do

- Use a button or link as the row so it is in the tab order.

## Don't

- Do not put the display face on the row label.
