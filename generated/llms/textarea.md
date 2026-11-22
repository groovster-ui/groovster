## Textarea (`ew-textarea`)

Multi-line text field with label. Native textarea.

HTML:
```html
<div class="ew-textarea">
  <label class="ew-textarea__label" for="bio">Bio</label>
  <textarea id="bio" class="ew-textarea__control" rows="4"></textarea>
</div>
```

CSS: @groovster/css/textarea.css + @groovster/css/eras/<era>.css
Variants: variant=outline|filled(default:outline)
Sizes: sm|md|lg (default md)
ARIA: textbox (native textarea)
Do: Always label.
Don't: Don't use placeholder as the only label.
