# Code

> Generated from `spec/components/code.json`. Do not hand-edit.

Inline or block code in the era monospace, with a copy slot.

## Canonical HTML

```html
<pre class="ew-code"><code>npm test</code><button type="button" class="ew-button ew-code__copy">Copy</button></pre>
```

## Imports

- `@groovster/css/code.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: none
- Use code for inline and pre.ew-code for a block. The copy control is a real button.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
