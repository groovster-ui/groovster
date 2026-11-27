## Button (`ew-button`)

Pressable control for primary actions. Zero attributes = medium primary button.

HTML:
```html
<button type="button" class="ew-button">Save</button>
```

CSS: @groovster/css/button.css + @groovster/css/eras/<era>.css
Variants: variant=primary|secondary|ghost|danger(default:primary)
Sizes: sm|md|lg (default md)
ARIA: button (native <button> preferred)
Do: Use a real <button> with an accessible name.
Don't: Don't put a display face, uppercase, or wide tracking on the label. Opt in with .ew-caps. Ghost and icon buttons frame only on hover, focus, or .ew-button--framed.
