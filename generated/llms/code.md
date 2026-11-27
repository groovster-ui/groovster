## Code (`ew-code`)

Inline or block code in the era monospace, with a copy slot.

HTML:
```html
<pre class="ew-code"><code>npm test</code><button type="button" class="ew-button ew-code__copy">Copy</button></pre>
```

CSS: @groovster/css/code.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md (default md)
ARIA: none
Do: Keep markup era-neutral and set data-era on an ancestor.
Don't: Do not restyle this with a display face or uppercase tracking.
