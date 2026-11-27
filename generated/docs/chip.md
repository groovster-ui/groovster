# Chip

> Generated from `spec/components/chip.json`. Do not hand-edit.

Filter, label, or removable token. Selectable chips use aria-pressed.

## Canonical HTML

```html
<button type="button" class="ew-chip" aria-pressed="false">Unread</button>
```

## Imports

- `@groovster/css/chip.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: button
- Selectable chips toggle aria-pressed. Removable chips include a button.ew-chip__remove with an accessible name.

## Do

- Use a button for filters so aria-pressed is valid.

## Don't

- Do not encode selection with color alone.
