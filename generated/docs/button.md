# Button

> Generated from `spec/components/button.json`. Do not hand-edit.

Pressable control for primary actions. Zero attributes = medium primary button.

## Canonical HTML

```html
<button type="button" class="ew-button">Save</button>
```

## Imports

- `@era-widgets/css/button.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): primary | secondary | ghost | danger (default: primary)

## ARIA

- Role: button (native <button> preferred)
- Prefer native <button type="button|submit|reset"> over div[role=button].
- When loading, set aria-busy=true and keep the accessible name.
- Disabled: use disabled attribute on <button>, not only aria-disabled.

## Do

- Use a real <button> with an accessible name.
- Change era with data-era on an ancestor; keep button markup neutral.
- Use data-variant only when not primary.

## Don't

- Don't put warped display fonts on the control label.
- Don't rely on glow for contrast.
- Don't nest interactive elements inside the button.
