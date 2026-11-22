# Menu

> Generated from `spec/components/menu.json`. Do not hand-edit.

Action menu using Popover API + menu roles. Full APG WC may deepen later.

## Canonical HTML

```html
<ew-menu class="ew-menu">
  <button type="button" class="ew-button ew-menu__trigger" aria-haspopup="menu">Actions</button>
  <div class="ew-menu__panel" role="menu">
    <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
    <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
  </div>
</ew-menu>
```

## Imports

- `@groovster/css/menu.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: menu / menuitem
- Wrap with <ew-menu> for APG keyboard.
- Zag.js not used.

## Do

- Use a button trigger.
- Mark items as menuitem.

## Don't

- Don't open menus on hover-only.
- Don't trap focus incorrectly.
