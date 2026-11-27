## Meter (`ew-meter`)

Labeled linear meter or progress, plus a small radial.

HTML:
```html
<div class="ew-meter"><span class="ew-meter__label" id="m1">Storage</span><meter class="ew-meter__bar" min="0" max="100" value="18" aria-labelledby="m1">18%</meter></div>
```

CSS: @groovster/css/meter.css + @groovster/css/eras/<era>.css
Variants: variant=linear|radial(default:linear)
Sizes: sm|md (default md)
ARIA: meter
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
