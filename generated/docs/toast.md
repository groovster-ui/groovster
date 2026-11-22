# Toast

> Generated from `spec/components/toast.json`. Do not hand-edit.

Transient notification region. CSS chrome; live region polite by default.

## Canonical HTML

```html
<ew-toast-region class="ew-toast-region" aria-live="polite"></ew-toast-region>
<!-- region.show({ title, body, variant }) -->
```

## Imports

- `@era-widgets/css/toast.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): info | success | warning | danger (default: info)

## ARIA

- Role: status / alert
- Use <ew-toast-region>.show(...) for polite announcements.
- Zag.js not used.

## Do

- Use a live region.
- Keep messages short.

## Don't

- Don't stack critical errors only as toasts.
- Don't auto-dismiss faster than readable.
