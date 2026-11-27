# Media card

> Generated from `spec/components/media-card.json`. Do not hand-edit.

Poster or widescreen card with an overlay title and a watched bar.

## Canonical HTML

```html
<a class="ew-media-card" data-ratio="poster" href="#title"><span class="ew-media-card__title">Night Market</span><span class="ew-media-card__progress" style="width:40%"></span></a>
```

## Imports

- `@groovster/css/media-card.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **ratio** (`data-ratio`): poster | wide (default: poster)

## ARIA

- Role: link
- data-ratio=poster is 2:3. data-ratio=wide is 16:9. Hover and focus lift, and reduced motion keeps them still.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
