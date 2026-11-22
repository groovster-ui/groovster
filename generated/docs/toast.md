# Toast

> Generated from `spec/components/toast.json`. Do not hand-edit.

Transient notification region. CSS chrome; live region polite by default.

## Canonical HTML

```html
<div class="ew-toast-region" aria-live="polite" aria-relevant="additions">
  <div class="ew-toast" data-variant="success">
    <strong class="ew-toast__title">Saved</strong>
    <p class="ew-toast__body">Your changes are live.</p>
  </div>
</div>
```

## Imports

- `@era-widgets/css/toast.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): info | success | warning | danger (default: info)

## ARIA

- Role: status (polite) or alert
- Wrap toasts in an aria-live region.
- Danger may use role=alert sparingly.

## Do

- Use a live region.
- Keep messages short.

## Don't

- Don't stack critical errors only as toasts.
- Don't auto-dismiss faster than readable.
