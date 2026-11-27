## Toolbar (`ew-toolbar`)

App bar with start, center, and end slots. Optional sticky and overflow.

HTML:
```html
<header><div class="ew-toolbar" role="toolbar" aria-label="Mailbox" data-sticky="true"><div class="ew-toolbar__start"></div><div class="ew-toolbar__center"></div><div class="ew-toolbar__end"></div></div></header>
```

CSS: @groovster/css/toolbar.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: toolbar
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
