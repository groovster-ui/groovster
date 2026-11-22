## Tooltip (`ew-tooltip`)

CSS tooltip for non-essential hints. Never the only accessible name.

HTML:
```html
<ew-tooltip class="ew-tooltip">
  <button type="button" class="ew-button" aria-describedby="tip-1">Info</button>
  <span id="tip-1" class="ew-tooltip__tip" role="tooltip">More detail</span>
</ew-tooltip>
```

CSS: @groovster/css/tooltip.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md|lg (default md)
ARIA: tooltip
Do: Duplicate essential info in accessible text.
Don't: Don't put critical instructions only in a tooltip.
