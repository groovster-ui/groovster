# Menu

> Generated from `spec/components/menu.json`. Do not hand-edit.

Action menu using Popover API + menu roles. Full APG WC may deepen later.

## Canonical HTML

```html
<div class="ew-menu">
  <button type="button" class="ew-button ew-menu__trigger" popovertarget="menu-1" aria-haspopup="menu">Actions</button>
  <div id="menu-1" class="ew-menu__panel" popover role="menu">
    <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
    <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
  </div>
</div>
```

## Imports

- `@era-widgets/css/menu.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: menu / menuitem
- Use button trigger with aria-haspopup=menu.
- Phase 3 ships CSS + popover markup pattern; dedicated WC optional later.

## Do

- Use a button trigger.
- Mark items as menuitem.

## Don't

- Don't open menus on hover-only.
- Don't trap focus incorrectly.
