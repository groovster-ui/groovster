## Tabs (`ew-tabs`)

Tablist + tabpanels. Phase 0 specifies the contract; Phase 1 ships a light-DOM web component for keyboard behavior.

HTML:
```html
<div class="ew-tabs">
  <div role="tablist" aria-label="Plans">
    <button type="button" role="tab" id="t-basic" aria-selected="true" aria-controls="p-basic">Basic</button>
    <button type="button" role="tab" id="t-pro" aria-selected="false" aria-controls="p-pro" tabindex="-1">Pro</button>
  </div>
  <div role="tabpanel" id="p-basic" aria-labelledby="t-basic">Basic plan</div>
  <div role="tabpanel" id="p-pro" aria-labelledby="t-pro" hidden>Pro plan</div>
</div>
```

CSS: @era-widgets/css/tabs.css + @era-widgets/css/eras/<era>.css
Variants: variant=line|enclosed|pills(default:line); orientation=horizontal|vertical(default:horizontal)
Sizes: sm|md|lg (default md)
ARIA: tablist / tab / tabpanel
Do: Use roles tablist/tab/tabpanel with correct aria wiring.
Don't: Don't use only color to show selection — include structure/indicator.
