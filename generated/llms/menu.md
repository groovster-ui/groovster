## Menu (`ew-menu`)

Action menu using Popover API + menu roles. Full APG WC may deepen later.

HTML:
```html
<div class="ew-menu">
  <button type="button" class="ew-button ew-menu__trigger" popovertarget="menu-1" aria-haspopup="menu">Actions</button>
  <div id="menu-1" class="ew-menu__panel" popover role="menu">
    <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
    <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
  </div>
</div>
```

CSS: @era-widgets/css/menu.css + @era-widgets/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md|lg (default md)
ARIA: menu / menuitem
Do: Use a button trigger.
Don't: Don't open menus on hover-only.
