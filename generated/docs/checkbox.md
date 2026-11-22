# Checkbox

> Generated from `spec/components/checkbox.json`. Do not hand-edit.

Labeled checkbox. Native input; eras skin the box.

## Canonical HTML

```html
<label class="ew-checkbox">
  <input class="ew-checkbox__control" type="checkbox" />
  <span class="ew-checkbox__box" aria-hidden="true"></span>
  <span class="ew-checkbox__label">Accept terms</span>
</label>
```

## Imports

- `@era-widgets/css/checkbox.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default | card (default: default)

## ARIA

- Role: checkbox (native)
- Prefer native checkbox inside a label.
- Indeterminate via property, expose carefully.

## Do

- Use a visible label.
- Keep hit target ≥24px.

## Don't

- Don't use only color for checked state.
- Don't nest interactive controls in the label besides the checkbox.
