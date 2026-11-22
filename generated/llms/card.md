## Card (`ew-card`)

Surface container for grouped content. Cards are interaction containers — eras rewrite edge, elevation, and ornament.

HTML:
```html
<article class="ew-card">
  <header class="ew-card__header"><h3>Plan</h3></header>
  <div class="ew-card__body"><p>Everything you need to ship.</p></div>
  <footer class="ew-card__footer"><button type="button" class="ew-button">Choose</button></footer>
</article>
```

CSS: @groovster/css/card.css + @groovster/css/eras/<era>.css
Variants: variant=raised|inset|outline|flat(default:raised)
Sizes: sm|md|lg (default md)
ARIA: group / region / article (context-dependent)
Do: Use semantic root (article/section) when content warrants it.
Don't: Don't nest interactive cards inside interactive cards.
