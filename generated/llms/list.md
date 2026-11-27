## List (`ew-list`)

Dense row with a lead, truncated text, and trailing meta. Selected and unread states.

HTML:
```html
<ul class="ew-list" role="listbox" aria-label="Messages"><li><button type="button" class="ew-list-item is-unread" role="option" aria-selected="false" tabindex="0"><span class="ew-list-item__main"><span class="ew-list-item__primary">Maya Okafor</span><span class="ew-list-item__secondary">The kiln fired clean</span></span><span class="ew-list-item__meta">9:40</span></button></li></ul>
```

CSS: @groovster/css/list.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: listbox
Do: Use a button or link as the row so it is in the tab order.
Don't: Do not put the display face on the row label.
