# Toolbar

> Generated from `spec/components/toolbar.json`. Do not hand-edit.

App bar with start, center, and end slots. Optional sticky and overflow.

## Canonical HTML

```html
<header><div class="ew-toolbar" role="toolbar" aria-label="Mailbox" data-sticky="true"><div class="ew-toolbar__start"></div><div class="ew-toolbar__center"></div><div class="ew-toolbar__end"></div></div></header>
```

## Imports

- `@groovster/css/toolbar.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: toolbar
- Put the toolbar group inside a header landmark. Do not set role=toolbar on the header itself.
- The group is role=toolbar with an accessible name. Overflow goes in .ew-toolbar__overflow.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
