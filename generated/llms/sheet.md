## Sheet (`ew-sheet`)

Surface for a document or a mobile filter sheet.

HTML:
```html
<div class="ew-sheet"><div class="ew-sheet__head"></div><div class="ew-sheet__body"></div></div>
```

CSS: @groovster/css/sheet.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: region
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
