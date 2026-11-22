## Slider (`ew-slider`)

Native range input with era track/thumb chrome.

HTML:
```html
<ew-slider class="ew-slider">
  <label class="ew-slider__label" for="vol">Volume</label>
  <input id="vol" class="ew-slider__control" type="range" min="0" max="100" value="40" />
  <output class="ew-slider__value">40</output>
</ew-slider>
```

CSS: @groovster/css/slider.css + @groovster/css/eras/<era>.css
Variants: variant=default(default:default)
Sizes: sm|md|lg (default md)
ARIA: slider
Do: Provide min/max/value.
Don't: Don't rely on track color alone for value.
