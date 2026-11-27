## Shelf (`ew-shelf`)

Horizontal title row with scroll-snap and keyboard access.

HTML:
```html
<section class="ew-shelf" aria-label="Continue"><h2 class="ew-shelf__title ew-title--section">Continue</h2><div class="ew-shelf__row" tabindex="0"></div></section>
```

CSS: @groovster/css/shelf.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: region
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
