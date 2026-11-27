## Stat (`ew-stat`)

A value, a label, and an up or down delta that is not color alone.

HTML:
```html
<div class="ew-stat"><p class="ew-stat__label">Watched</p><p class="ew-stat__value">128</p><p class="ew-stat__delta" data-dir="up">12%</p></div>
```

CSS: @groovster/css/stat.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: group
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
