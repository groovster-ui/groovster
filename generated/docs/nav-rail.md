# Nav rail

> Generated from `spec/components/nav-rail.json`. Do not hand-edit.

Sidebar items with an icon, label, and count. Collapses to icons.

## Canonical HTML

```html
<nav class="ew-nav-rail" aria-label="Mail"><a class="ew-nav-rail__item" href="#inbox" aria-current="page"><span class="ew-nav-rail__label">Inbox</span><span class="ew-badge">8</span></a></nav>
```

## Imports

- `@groovster/css/nav-rail.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: navigation
- aria-current=page marks the current item with weight and a bar.
- data-collapsed=true hides labels. Groups are details/summary.

## Do

- Keep markup era-neutral and set data-era on an ancestor.
- Put the icon in .ew-nav-rail__icon. In data-collapsed=true, set data-label so the hover and focus tooltip names the item.

## Don't

- Do not restyle this with a display face or uppercase tracking.
