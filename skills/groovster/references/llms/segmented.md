## Segmented control (`ew-segmented`)

A single-choice control with radiogroup semantics.

HTML:
```html
<div class="ew-segmented" role="radiogroup" aria-label="View"><button type="button" class="ew-segmented__item" role="radio" aria-checked="true">List</button><button type="button" class="ew-segmented__item" role="radio" aria-checked="false">Grid</button></div>
```

CSS: @groovster/css/segmented.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: radiogroup
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
