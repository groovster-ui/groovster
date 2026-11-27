## Media card (`ew-media-card`)

Poster or widescreen card with an overlay title and a watched bar.

HTML:
```html
<a class="ew-media-card" data-ratio="poster" href="#title"><span class="ew-media-card__title">Night Market</span><span class="ew-media-card__progress" style="width:40%"></span></a>
```

CSS: @groovster/css/media-card.css + @groovster/css/eras/<era>.css
Variants: ratio=poster|wide(default:poster)
Sizes: sm|md (default md)
ARIA: link
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
