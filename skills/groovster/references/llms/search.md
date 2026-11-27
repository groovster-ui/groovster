## Search (`ew-search`)

Search field with a leading icon, clear button, and optional scope.

HTML:
```html
<search class="ew-search" role="search"><input class="ew-text-field__control ew-search__control" type="search" aria-label="Search mail"><button type="button" class="ew-icon-button ew-search__clear" aria-label="Clear search">×</button></search>
```

CSS: @groovster/css/search.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: search
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
