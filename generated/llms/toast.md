## Toast (`ew-toast`)

Transient notification region. CSS chrome; live region polite by default.

HTML:
```html
<div class="ew-toast-region" aria-live="polite" aria-relevant="additions">
  <div class="ew-toast" data-variant="success">
    <strong class="ew-toast__title">Saved</strong>
    <p class="ew-toast__body">Your changes are live.</p>
  </div>
</div>
```

CSS: @era-widgets/css/toast.css + @era-widgets/css/eras/<era>.css
Variants: variant=info|success|warning|danger(default:info)
Sizes: sm|md|lg (default md)
ARIA: status (polite) or alert
Do: Use a live region.
Don't: Don't stack critical errors only as toasts.
