## Product card (`ew-product-card`)

Fixed-ratio listing with a two-line title and a price.

HTML:
```html
<div class="ew-product-card"></div>
```

CSS: @groovster/css/product-card.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: region
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
