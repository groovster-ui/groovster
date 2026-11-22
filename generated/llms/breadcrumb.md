## Breadcrumb (`ew-breadcrumb`)

Navigation breadcrumb trail.

HTML:
```html
<nav class="ew-breadcrumb" aria-label="Breadcrumb">
  <ol class="ew-breadcrumb__list">
    <li class="ew-breadcrumb__item"><a class="ew-link" href="/">Home</a></li>
    <li class="ew-breadcrumb__item"><a class="ew-link" href="/docs">Docs</a></li>
    <li class="ew-breadcrumb__item" aria-current="page">Button</li>
  </ol>
</nav>
```

CSS: @era-widgets/css/breadcrumb.css + @era-widgets/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md|lg (default md)
ARIA: navigation
Do: Use nav + ol.
Don't: Don't use breadcrumbs as the only nav for complex apps.
