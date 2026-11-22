# Era Widgets registry

shadcn-compatible registry items for the six hero widgets.

```bash
# After hosting registry/ (or using a local static server):
npx shadcn@latest add ./registry/r/button.json
npx shadcn@latest add ./registry/r/card.json
# …
```

Items include generated CSS (and `ew-tabs.js` for Tabs) plus an HTML example.
Era look comes from `data-era` + `@era-widgets/css/eras/<era>.css` — not per-item React.
