# OrnamentDivider

> Generated from `spec/components/ornament-divider.json`. Do not hand-edit.

Structural divider; eras supply ornament via decorators.

## Canonical HTML

```html
<hr class="ew-ornament-divider" data-variant="ornament" />
```

## Imports

- `@era-widgets/css/ornament-divider.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): line | ornament (default: line)

## ARIA

- Role: separator
- Prefer <hr> or role=separator.
- Decorative-only dividers can be aria-hidden.

## Do

- Use for sectioning, not for layout hacks.
- Let eras own the motif.

## Don't

- Don't wallpaper every section with costume ornaments at low fidelity.
- Don't convey meaning only via ornament.
