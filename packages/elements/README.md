# @groovster/elements

Dependency-free **light-DOM** web components (WAI-ARIA APG).

**Published files import nothing** (CI-enforced). Zag.js was **not** used.

| Tag | Pattern |
|---|---|
| `ew-tabs` | Tabs |
| `ew-select` | Select-only listbox |
| `ew-menu` | Menu button |
| `ew-popover` | Non-modal popover |
| `ew-tooltip` | Tooltip |
| `ew-toast-region` | Live-region toasts |
| `ew-slider` | Range slider enhancer |

```html
<script src="node_modules/@groovster/elements/era-elements.js"></script>
```

Build: `pnpm --filter @groovster/elements build` (or `node scripts/bundle-elements.mjs`).
