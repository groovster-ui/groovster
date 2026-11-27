# Search

> Generated from `spec/components/search.json`. Do not hand-edit.

Search field with a leading icon, clear button, and optional scope.

## Canonical HTML

```html
<search class="ew-search" role="search"><input class="ew-text-field__control ew-search__control" type="search" aria-label="Search mail"><button type="button" class="ew-icon-button ew-search__clear" aria-label="Clear search">×</button></search>
```

## Imports

- `@groovster/css/search.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: search
- The input needs an accessible name. The clear button is a separate control.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
