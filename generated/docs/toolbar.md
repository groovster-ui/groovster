# Toolbar

> Generated from `spec/components/toolbar.json`. Do not hand-edit.

App bar with start, center, and end slots. Optional sticky and overflow.

## Canonical HTML

```html
<div class="ew-toolbar" role="toolbar" aria-label="Mailbox" data-sticky="true"><div class="ew-toolbar__start"></div><div class="ew-toolbar__center"></div><div class="ew-toolbar__end"></div></div>
```

## Imports

- `@groovster/css/toolbar.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: toolbar
- role=toolbar when the bar holds related controls. Put overflow in .ew-toolbar__overflow.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
