# Card

> Generated from `spec/components/card.json`. Do not hand-edit.

Surface container for grouped content. Cards are interaction containers — eras rewrite edge, elevation, and ornament.

## Canonical HTML

```html
<article class="ew-card">
  <header class="ew-card__header"><h3>Plan</h3></header>
  <div class="ew-card__body"><p>Everything you need to ship.</p></div>
  <footer class="ew-card__footer"><button type="button" class="ew-button">Choose</button></footer>
</article>
```

## Imports

- `@era-widgets/css/card.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): raised | inset | outline | flat (default: raised)

## ARIA

- Role: group / region / article (context-dependent)
- If the card is a single link/button, put the interactive element on the root or use a stretched link — do not nest buttons/links.
- Name the card when it is a landmark-like region (aria-labelledby pointing at the title).

## Do

- Use semantic root (article/section) when content warrants it.
- Let eras own elevation — avoid ad-hoc box-shadows on top.
- Keep one primary action in the footer when actions exist.

## Don't

- Don't nest interactive cards inside interactive cards.
- Don't put stats/schedules/promo stickers as floating overlays on card media (hero rules apply at page level).
- Don't use glow as the only separation from the background.
