# Meter

> Generated from `spec/components/meter.json`. Do not hand-edit.

Labeled linear meter or progress, plus a small radial.

## Canonical HTML

```html
<div class="ew-meter"><span class="ew-meter__label" id="m1">Storage</span><meter class="ew-meter__bar" min="0" max="100" value="18" aria-labelledby="m1">18%</meter></div>
```

## Imports

- `@groovster/css/meter.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): linear | radial (default: linear)

## ARIA

- Role: meter
- Use meter for a known range and progress for a task. The radial sets --ew-meter-value from 0 to 100.

## Do

- Keep markup era-neutral and set data-era on an ancestor.

## Don't

- Do not restyle this with a display face or uppercase tracking.
