# Stat

> Generated from `spec/components/stat.json`. Do not hand-edit.

A value, a label, and an up or down delta that is not color alone.

## Canonical HTML

```html
<div class="ew-stat"><p class="ew-stat__label">Watched</p><p class="ew-stat__value">128</p><p class="ew-stat__delta" data-dir="up">12%</p></div>
```

## Imports

- `@groovster/css/stat.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: group
- data-dir=up or down adds a triangle so the delta is not color alone. Sparkline goes in .ew-stat__spark.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
