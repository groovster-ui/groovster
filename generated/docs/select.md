# Select

> Generated from `spec/components/select.json`. Do not hand-edit.

Native select with era chrome. Rich combobox WC deferred.

## Canonical HTML

```html
<div class="ew-select">
  <label class="ew-select__label" for="country">Country</label>
  <select id="country" class="ew-select__control">
    <option value="us">United States</option>
    <option value="ca">Canada</option>
  </select>
</div>
```

## Imports

- `@era-widgets/css/select.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): outline | filled (default: outline)

## ARIA

- Role: listbox/combobox (native select)
- Native <select> for Phase 3.
- Custom listbox WC may replace later without changing public class names.

## Do

- Label the select.
- Prefer native options for accessibility.

## Don't

- Don't rebuild a fake select in divs without a WC.
- Don't remove focus rings.
