## Countdown (`ew-countdown`)

Time left, with an urgent state that is not colour alone.

HTML:
```html
<div class="ew-countdown"></div>
```

CSS: @groovster/css/countdown.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: region
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
