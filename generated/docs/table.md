# Table

> Generated from `spec/components/table.json`. Do not hand-edit.

Era table with a caption, rules, optional zebra, and sortable headers.

## Canonical HTML

```html
<table class="ew-table" data-responsive="stack"><caption>Specifics</caption><thead><tr><th aria-sort="ascending">Lot</th></tr></thead><tbody><tr class="is-selected" aria-selected="true"><td data-label="Lot">Bowl</td></tr></tbody></table>
```

## Imports

- `@groovster/css/table.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: table
- aria-sort on sortable headers. data-responsive=stack stacks rows under 600px using data-label. Wrap with .ew-table-scroll to scroll instead.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
