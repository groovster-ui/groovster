## Popover (`ew-popover`)

Non-modal popover surface via Popover API.

HTML:
```html
<button type="button" class="ew-button ew-popover__trigger" popovertarget="pop-1">Details</button>
<div id="pop-1" class="ew-popover__panel" popover>
  <p>Popover content</p>
</div>
```

CSS: @era-widgets/css/popover.css + @era-widgets/css/eras/<era>.css
Variants: variant=default|rich(default:default)
Sizes: sm|md|lg (default md)
ARIA: dialog or group (context)
Do: Prefer popover attribute.
Don't: Don't use as the only way to show critical errors.
