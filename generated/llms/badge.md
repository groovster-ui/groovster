## Badge (`ew-badge`)

Count or status dot for labels, nav, and reactions.

HTML:
```html
<span class="ew-badge">3</span>
```

CSS: @groovster/css/badge.css + @groovster/css/eras/<era>.css
Variants: variant=count|dot|neutral(default:count)
Sizes: sm|md (default md)
ARIA: status
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
