# TextField

> Generated from `spec/components/text-field.json`. Do not hand-edit.

Labeled single-line text input. Native <input>; eras skin the chrome only.

## Canonical HTML

```html
<div class="ew-text-field">
  <label class="ew-text-field__label" for="email">Email</label>
  <input id="email" class="ew-text-field__control" type="email" autocomplete="email" />
</div>
```

## Imports

- `@era-widgets/css/text-field.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): outline | filled | underline (default: outline)

## ARIA

- Role: textbox (native input)
- Wire label via for/id.
- Point aria-describedby at description and/or error ids.
- On error, set aria-invalid=true and keep the error text in the accessibility tree.

## Do

- Always provide a visible label.
- Use native input types (email, password, search) when appropriate.
- Keep placeholder as hint only — never as the only label.

## Don't

- Don't remove focus rings; eras may restyle them, not delete them.
- Don't put the only instructions in placeholder text.
- Don't use div contenteditable as a text field.
