## Nav rail (`ew-nav-rail`)

Sidebar items with an icon, label, and count. Collapses to icons.

HTML:
```html
<nav class="ew-nav-rail" aria-label="Mail"><a class="ew-nav-rail__item" href="#inbox" aria-current="page"><span class="ew-nav-rail__label">Inbox</span><span class="ew-badge">8</span></a></nav>
```

CSS: @groovster/css/nav-rail.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: navigation
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
