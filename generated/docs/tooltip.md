# Tooltip

> Generated from `spec/components/tooltip.json`. Do not hand-edit.

CSS tooltip for non-essential hints. Never the only accessible name.

## Canonical HTML

```html
<ew-tooltip class="ew-tooltip">
  <button type="button" class="ew-button" aria-describedby="tip-1">Info</button>
  <span id="tip-1" class="ew-tooltip__tip" role="tooltip">More detail</span>
</ew-tooltip>
```

## Imports

- `@groovster/css/tooltip.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: tooltip
- <ew-tooltip> shows on focus/hover; Escape hides.
- Never the only accessible name.
- Zag.js not used.

## Do

- Duplicate essential info in accessible text.
- Support keyboard focus.

## Don't

- Don't put critical instructions only in a tooltip.
- Don't use tooltip for error messages.
