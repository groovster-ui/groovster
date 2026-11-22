# Avatar

> Generated from `spec/components/avatar.json`. Do not hand-edit.

User/image avatar with initials fallback.

## Canonical HTML

```html
<span class="ew-avatar" data-variant="circle" aria-label="Ada Lovelace">
  <span class="ew-avatar__fallback">AL</span>
</span>
```

## Imports

- `@groovster/css/avatar.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): circle | square (default: circle)

## ARIA

- Role: img when meaningful
- Decorative avatars can be aria-hidden.
- Meaningful avatars need a name.

## Do

- Provide alt/name when meaningful.
- Use initials fallback.

## Don't

- Don't rely on image alone without fallback.
- Don't make tiny avatars the only identity cue in dense UI without text.
