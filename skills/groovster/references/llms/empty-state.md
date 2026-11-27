## Empty state (`ew-empty-state`)

Title, short explanation, and an optional action when a list or card is empty.

HTML:
```html
<div class="ew-empty-state"><h2 class="ew-empty-state__title ew-title--panel">Nothing here</h2><p class="ew-empty-state__body">No messages match.</p></div>
```

CSS: @groovster/css/empty-state.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: status
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
