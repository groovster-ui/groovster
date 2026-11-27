# Skeleton

> Generated from `spec/components/skeleton.json`. Do not hand-edit.

Placeholder while content loads. Still when motion is reduced.

## Canonical HTML

```html
<div class="ew-skeleton" data-variant="block" aria-hidden="true"></div>
```

## Imports

- `@groovster/css/skeleton.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): line | block (default: line)

## ARIA

- Role: none
- Hide skeletons from assistive tech with aria-hidden and set aria-busy on the region that is loading.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
