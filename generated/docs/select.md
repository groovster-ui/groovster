# Select

> Generated from `spec/components/select.json`. Do not hand-edit.

Native select with era chrome. Rich combobox WC deferred.

## Canonical HTML

```html
<ew-select class="ew-select">
  <label class="ew-select__label" for="country">Country</label>
  <select id="country" class="ew-select__control">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>
</ew-select>
```

## Imports

- `@era-widgets/css/select.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): outline | filled (default: outline)

## ARIA

- Role: button + listbox (ew-select)
- Use <ew-select> to enhance a native <select> into an APG listbox pattern.
- Native select remains in the DOM (hidden) for form posting.
- Zag.js not used.

## Do

- Label the select.
- Prefer native options for accessibility.

## Don't

- Don't rebuild a fake select in divs without a WC.
- Don't remove focus rings.
