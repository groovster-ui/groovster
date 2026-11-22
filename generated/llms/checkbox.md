## Checkbox (`ew-checkbox`)

Labeled checkbox. Native input; eras skin the box.

HTML:
```html
<label class="ew-checkbox">
  <input class="ew-checkbox__control" type="checkbox" />
  <span class="ew-checkbox__box" aria-hidden="true"></span>
  <span class="ew-checkbox__label">Accept terms</span>
</label>
```

CSS: @era-widgets/css/checkbox.css + @era-widgets/css/eras/<era>.css
Variants: variant=default|card(default:default)
Sizes: sm|md|lg (default md)
ARIA: checkbox (native)
Do: Use a visible label.
Don't: Don't use only color for checked state.
