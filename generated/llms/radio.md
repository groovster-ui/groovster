## Radio (`ew-radio`)

Radio option in a named group. Native radios; eras skin the disc.

HTML:
```html
<fieldset class="ew-radio-group">
  <legend>Plan</legend>
  <label class="ew-radio"><input class="ew-radio__control" type="radio" name="plan" value="basic" /><span class="ew-radio__disc" aria-hidden="true"></span><span class="ew-radio__label">Basic</span></label>
  <label class="ew-radio"><input class="ew-radio__control" type="radio" name="plan" value="pro" /><span class="ew-radio__disc" aria-hidden="true"></span><span class="ew-radio__label">Pro</span></label>
</fieldset>
```

CSS: @groovster/css/radio.css + @groovster/css/eras/<era>.css
Variants: variant=default|card(default:default)
Sizes: sm|md|lg (default md)
ARIA: radio (native)
Do: Group with name + fieldset.
Don't: Don't use radios for multi-select.
