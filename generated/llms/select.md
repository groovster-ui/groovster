## Select (`ew-select`)

Native select with era chrome. Rich combobox WC deferred.

HTML:
```html
<ew-select class="ew-select">
  <label class="ew-select__label" for="country">Country</label>
  <select id="country" class="ew-select__control">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>
</ew-select>
```

CSS: @groovster/css/select.css + @groovster/css/eras/<era>.css
Variants: variant=outline|filled(default:outline)
Sizes: sm|md|lg (default md)
ARIA: button + listbox (ew-select)
Do: Label the select.
Don't: Don't rebuild a fake select in divs without a WC.
