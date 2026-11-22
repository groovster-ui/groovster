## Alert (`ew-alert`)

Inline alert for page-level feedback.

HTML:
```html
<div class="ew-alert" data-variant="warning" role="status">
  <strong class="ew-alert__title">Check your email</strong>
  <p class="ew-alert__body">We sent a confirmation link.</p>
</div>
```

CSS: @era-widgets/css/alert.css + @era-widgets/css/eras/<era>.css
Variants: variant=info|success|warning|danger(default:info)
Sizes: sm|md|lg (default md)
ARIA: status or alert
Do: Choose variant by severity.
Don't: Don't use danger for ordinary tips.
