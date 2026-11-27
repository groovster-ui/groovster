## Density (`ew-density`)

App heading scale and compact or comfortable density. Quiet cards and body type on controls.

HTML:
```html
<div class="ew-density" data-density="compact"><h1 class="ew-title ew-title--page">Inbox</h1></div>
```

CSS: @groovster/css/density.css + @groovster/css/eras/<era>.css
Variants: density=comfortable|compact(default:comfortable)
Sizes: sm|md (default md)
ARIA: none
Do: Put data-density on any container. Use .ew-title--page for the screen title, --section for groups, --panel inside cards and dialogs.
Don't: Do not use the Swiss section clamp on dialog, card, or shelf titles.
