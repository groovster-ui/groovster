## Tooltip (`ew-tooltip`)

CSS tooltip for non-essential hints. Never the only accessible name.

HTML:
```html
<span class="ew-tooltip">
  <button type="button" class="ew-button" aria-describedby="tip-1">Info</button>
  <span id="tip-1" class="ew-tooltip__tip" role="tooltip">More detail</span>
</span>
```

CSS: @era-widgets/css/tooltip.css + @era-widgets/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md|lg (default md)
ARIA: tooltip
Do: Duplicate essential info in accessible text.
Don't: Don't put critical instructions only in a tooltip.
