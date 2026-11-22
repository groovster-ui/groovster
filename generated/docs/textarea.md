# Textarea

> Generated from `spec/components/textarea.json`. Do not hand-edit.

Multi-line text field with label. Native textarea.

## Canonical HTML

```html
<div class="ew-textarea">
  <label class="ew-textarea__label" for="bio">Bio</label>
  <textarea id="bio" class="ew-textarea__control" rows="4"></textarea>
</div>
```

## Imports

- `@era-widgets/css/textarea.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): outline | filled (default: outline)

## ARIA

- Role: textbox (native textarea)
- Wire label via for/id.
- Respect resize preferences; eras may constrain resize.

## Do

- Always label.
- Use rows for initial height.

## Don't

- Don't use placeholder as the only label.
- Don't disable resize without a reason.
