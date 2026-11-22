# Alert

> Generated from `spec/components/alert.json`. Do not hand-edit.

Inline alert for page-level feedback.

## Canonical HTML

```html
<div class="ew-alert" data-variant="warning" role="status">
  <strong class="ew-alert__title">Check your email</strong>
  <p class="ew-alert__body">We sent a confirmation link.</p>
</div>
```

## Imports

- `@groovster/css/alert.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): info | success | warning | danger (default: info)

## ARIA

- Role: status or alert
- Use role=alert for time-sensitive danger.
- Otherwise status/polite is enough.

## Do

- Choose variant by severity.
- Keep copy actionable.

## Don't

- Don't use danger for ordinary tips.
- Don't hide alerts that require action.
