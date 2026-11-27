## Typing indicator (`ew-typing-indicator`)

Three dots while someone is typing. Static when motion is reduced.

HTML:
```html
<span class="ew-typing-indicator" role="status" aria-label="Maya is typing"><i></i><i></i><i></i></span>
```

CSS: @groovster/css/typing-indicator.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: status
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
