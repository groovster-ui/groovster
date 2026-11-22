## Menu (`ew-menu`)

Action menu using Popover API + menu roles. Full APG WC may deepen later.

HTML:
```html
<ew-menu class="ew-menu">
  <button type="button" class="ew-button ew-menu__trigger" aria-haspopup="menu">Actions</button>
  <div class="ew-menu__panel" role="menu">
    <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
    <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
  </div>
</ew-menu>
```

CSS: @era-widgets/css/menu.css + @era-widgets/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md|lg (default md)
ARIA: menu / menuitem
Do: Use a button trigger.
Don't: Don't open menus on hover-only.
