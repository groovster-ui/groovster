# IconButton

> Generated from `spec/components/icon-button.json`. Do not hand-edit.

Icon-only button with required accessible name.

## Canonical HTML

```html
<button type="button" class="ew-icon-button" data-variant="ghost" aria-label="Close">
  <span class="ew-icon-button__icon" aria-hidden="true">×</span>
</button>
```

## Imports

- `@era-widgets/css/icon-button.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): primary | secondary | ghost (default: ghost)

## ARIA

- Role: button
- Must have accessible name (aria-label).
- Icon decorative via aria-hidden.

## Do

- Always provide aria-label.
- Keep 40×40px hit target when possible.

## Don't

- Don't ship icon-only without a name.
- Don't use for navigation that should be a link.
