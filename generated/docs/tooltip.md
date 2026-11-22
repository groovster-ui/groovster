# Tooltip

> Generated from `spec/components/tooltip.json`. Do not hand-edit.

CSS tooltip for non-essential hints. Never the only accessible name.

## Canonical HTML

```html
<span class="ew-tooltip">
  <button type="button" class="ew-button" aria-describedby="tip-1">Info</button>
  <span id="tip-1" class="ew-tooltip__tip" role="tooltip">More detail</span>
</span>
```

## Imports

- `@era-widgets/css/tooltip.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: tooltip
- Tooltips must not be the only name for a control.
- Show on focus as well as hover.

## Do

- Duplicate essential info in accessible text.
- Support keyboard focus.

## Don't

- Don't put critical instructions only in a tooltip.
- Don't use tooltip for error messages.
