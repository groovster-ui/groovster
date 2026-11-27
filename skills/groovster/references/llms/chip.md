## Chip (`ew-chip`)

Filter, label, or removable token. Selectable chips use aria-pressed.

HTML:
```html
<button type="button" class="ew-chip" aria-pressed="false">Unread</button>
```

CSS: @groovster/css/chip.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: button
Do: Use a button for filters so aria-pressed is valid.
Don't: Do not encode selection with color alone.
