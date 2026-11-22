## Toast (`ew-toast`)

Transient notification region. CSS chrome; live region polite by default.

HTML:
```html
<ew-toast-region class="ew-toast-region" aria-live="polite"></ew-toast-region>
<!-- region.show({ title, body, variant }) -->
```

CSS: @era-widgets/css/toast.css + @era-widgets/css/eras/<era>.css
Variants: variant=info|success|warning|danger(default:info)
Sizes: sm|md|lg (default md)
ARIA: status / alert
Do: Use a live region.
Don't: Don't stack critical errors only as toasts.
