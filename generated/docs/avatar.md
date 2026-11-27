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
- Presence is a separate cue from colour: online is a disc, away a ring, busy a square, offline a hollow circle.

## Do

- Provide alt/name when meaningful.
- Use initials fallback.
- Set data-presence to online, away, busy, or offline on .ew-avatar__presence.

## Don't

- Don't rely on image alone without fallback.
- Don't make tiny avatars the only identity cue in dense UI without text.
