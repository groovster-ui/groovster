## TextField (`ew-text-field`)

Labeled single-line text input. Native <input>; eras skin the chrome only.

HTML:
```html
<div class="ew-text-field">
  <label class="ew-text-field__label" for="email">Email</label>
  <input id="email" class="ew-text-field__control" type="email" autocomplete="email" />
</div>
```

CSS: @groovster/css/text-field.css + @groovster/css/eras/<era>.css
Variants: variant=outline|filled|underline(default:outline)
Sizes: sm|md|lg (default md)
ARIA: textbox (native input)
Do: Always provide a visible label.
Don't: Don't remove focus rings; eras may restyle them, not delete them.
