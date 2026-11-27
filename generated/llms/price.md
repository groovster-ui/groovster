## Price (`ew-price`)

Tabular price with an optional was-price and note.

HTML:
```html
<div class="ew-price"></div>
```

CSS: @groovster/css/price.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: region
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
