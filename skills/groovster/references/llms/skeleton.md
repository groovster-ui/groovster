## Skeleton (`ew-skeleton`)

Placeholder while content loads. Still when motion is reduced.

HTML:
```html
<div class="ew-skeleton" data-variant="block" aria-hidden="true"></div>
```

CSS: @groovster/css/skeleton.css + @groovster/css/eras/<era>.css
Variants: variant=line|block(default:line)
Sizes: sm|md (default md)
ARIA: none
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
