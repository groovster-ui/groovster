# Link

> Generated from `spec/components/link.json`. Do not hand-edit.

Text link with era underline/voice.

## Canonical HTML

```html
<a class="ew-link" href="/pricing">View pricing</a>
```

## Imports

- `@era-widgets/css/link.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default | subtle | nav (default: default)

## ARIA

- Role: link (native a)
- Use real <a href>.
- Distinguish visited if needed via CSS.

## Do

- Use href.
- Underline or otherwise mark as link beyond color.

## Don't

- Don't use buttons styled as links for navigation.
- Don't remove focus styles.
