# Typing indicator

> Generated from `spec/components/typing-indicator.json`. Do not hand-edit.

Three dots while someone is typing. Static when motion is reduced.

## Canonical HTML

```html
<span class="ew-typing-indicator" role="status" aria-label="Maya is typing"><i></i><i></i><i></i></span>
```

## Imports

- `@groovster/css/typing-indicator.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: status
- The accessible name says who is typing. Reduced motion shows still dots.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
