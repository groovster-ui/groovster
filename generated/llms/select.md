## Select (`ew-select`)

Native select with era chrome. Rich combobox WC deferred.

HTML:
```html
<div class="ew-select">
  <label class="ew-select__label" for="country">Country</label>
  <select id="country" class="ew-select__control">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>
</div>
```

CSS: @era-widgets/css/select.css + @era-widgets/css/eras/<era>.css
Variants: variant=outline|filled(default:outline)
Sizes: sm|md|lg (default md)
ARIA: listbox/combobox (native select)
Do: Label the select.
Don't: Don't rebuild a fake select in divs without a WC.
