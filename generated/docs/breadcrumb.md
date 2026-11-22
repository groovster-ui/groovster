# Breadcrumb

> Generated from `spec/components/breadcrumb.json`. Do not hand-edit.

Navigation breadcrumb trail.

## Canonical HTML

```html
<nav class="ew-breadcrumb" aria-label="Breadcrumb">
  <ol class="ew-breadcrumb__list">
    <li class="ew-breadcrumb__item"><a class="ew-link" href="/">Home</a></li>
    <li class="ew-breadcrumb__item"><a class="ew-link" href="/docs">Docs</a></li>
    <li class="ew-breadcrumb__item" aria-current="page">Button</li>
  </ol>
</nav>
```

## Imports

- `@groovster/css/breadcrumb.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: navigation
- aria-label=Breadcrumb on nav.
- Mark current page with aria-current=page.

## Do

- Use nav + ol.
- Mark the current page.

## Don't

- Don't use breadcrumbs as the only nav for complex apps.
- Don't skip landmark labeling.
