## Button (`ew-button`)

Pressable control for primary actions. Zero attributes = medium primary button.

HTML:
```html
<button type="button" class="ew-button">Save</button>
```

CSS: @era-widgets/css/button.css + @era-widgets/css/eras/<era>.css
Variants: variant=primary|secondary|ghost|danger(default:primary)
Sizes: sm|md|lg (default md)
ARIA: button (native <button> preferred)
Do: Use a real <button> with an accessible name.
Don't: Don't put warped display fonts on the control label.
