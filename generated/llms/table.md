## Table (`ew-table`)

Era table with a caption, rules, optional zebra, and sortable headers.

HTML:
```html
<table class="ew-table" data-responsive="stack"><caption>Specifics</caption><thead><tr><th aria-sort="ascending">Lot</th></tr></thead><tbody><tr class="is-selected" aria-selected="true"><td data-label="Lot">Bowl</td></tr></tbody></table>
```

CSS: @groovster/css/table.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: table
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
