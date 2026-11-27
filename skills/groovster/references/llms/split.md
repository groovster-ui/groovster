## Split pane (`ew-split`)

Two-column app split that stacks under 800px.

HTML:
```html
<div class="ew-split"><div class="ew-split__side"></div><div class="ew-split__main"></div></div>
```

CSS: @groovster/css/split.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: group
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
