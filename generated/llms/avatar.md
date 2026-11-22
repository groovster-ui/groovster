## Avatar (`ew-avatar`)

User/image avatar with initials fallback.

HTML:
```html
<span class="ew-avatar" data-variant="circle" aria-label="Ada Lovelace">
  <span class="ew-avatar__fallback">AL</span>
</span>
```

CSS: @era-widgets/css/avatar.css + @era-widgets/css/eras/<era>.css
Variants: variant=circle|square(default:circle)
Sizes: sm|md|lg (default md)
ARIA: img when meaningful
Do: Provide alt/name when meaningful.
Don't: Don't rely on image alone without fallback.
