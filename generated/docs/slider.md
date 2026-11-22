# Slider

> Generated from `spec/components/slider.json`. Do not hand-edit.

Native range input with era track/thumb chrome.

## Canonical HTML

```html
<div class="ew-slider">
  <label class="ew-slider__label" for="vol">Volume</label>
  <input id="vol" class="ew-slider__control" type="range" min="0" max="100" value="40" />
</div>
```

## Imports

- `@era-widgets/css/slider.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default (default: default)

## ARIA

- Role: slider (native range)
- Native range provides keyboard.
- Expose visible value when helpful.

## Do

- Provide min/max/value.
- Keep thumb large enough to grab.

## Don't

- Don't rely on track color alone for value.
- Don't ignore prefers-reduced-motion on decorative fills.
