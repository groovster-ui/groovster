## IconButton (`ew-icon-button`)

Icon-only button with required accessible name.

HTML:
```html
<button type="button" class="ew-icon-button" data-variant="ghost" aria-label="Close">
  <span class="ew-icon-button__icon" aria-hidden="true">×</span>
</button>
```

CSS: @groovster/css/icon-button.css + @groovster/css/eras/<era>.css
Variants: variant=primary|secondary|ghost(default:ghost)
Sizes: sm|md|lg (default md)
ARIA: button
Do: Always provide aria-label.
Don't: Don't ship icon-only without a name.
