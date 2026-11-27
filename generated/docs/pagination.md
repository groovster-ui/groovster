# Pagination

> Generated from `spec/components/pagination.json`. Do not hand-edit.

Previous, next, and page links. The current page uses aria-current.

## Canonical HTML

```html
<nav class="ew-pagination" aria-label="Pages"><a class="ew-pagination__prev" href="#p1">Prev</a><a class="ew-pagination__page" href="#p2" aria-current="page">2</a><a class="ew-pagination__next" href="#p3">Next</a></nav>
```

## Imports

- `@groovster/css/pagination.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: navigation
- aria-current=page on the current page. data-compact=true shows only the current page plus prev and next.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
