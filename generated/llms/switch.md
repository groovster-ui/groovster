## Switch (`ew-switch`)

Binary on/off control. Prefer checkbox with switch role styling, or input type=checkbox with appearance skinning.

HTML:
```html
<label class="ew-switch">
  <input class="ew-switch__control" type="checkbox" role="switch" aria-checked="false" />
  <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
  <span class="ew-switch__label">Notifications</span>
</label>
```

CSS: @groovster/css/switch.css + @groovster/css/eras/<era>.css
Variants: variant=default|success(default:default)
Sizes: sm|md|lg (default md)
ARIA: switch (via role=switch on checkbox) or checkbox
Do: Keep a visible text label.
Don't: Don't animate the thumb in a way that ignores prefers-reduced-motion.
