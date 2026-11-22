## Slider (`ew-slider`)

Native range input with era track/thumb chrome.

HTML:
```html
<div class="ew-slider">
  <label class="ew-slider__label" for="vol">Volume</label>
  <input id="vol" class="ew-slider__control" type="range" min="0" max="100" value="40" />
</div>
```

CSS: @era-widgets/css/slider.css + @era-widgets/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md|lg (default md)
ARIA: slider (native range)
Do: Provide min/max/value.
Don't: Don't rely on track color alone for value.
