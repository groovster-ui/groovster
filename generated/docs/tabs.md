# Tabs

> Generated from `spec/components/tabs.json`. Do not hand-edit.

Tablist + tabpanels. Phase 0 specifies the contract; Phase 1 ships a light-DOM web component for keyboard behavior.

## Canonical HTML

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

## Imports

- `@era-widgets/css/tabs.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): line | enclosed | pills (default: line)
- **orientation** (`data-orientation`): horizontal | vertical (default: horizontal)

## ARIA

- Role: tablist / tab / tabpanel
- Follow WAI-ARIA APG Tabs pattern.
- Only one tab selected; associated panel visible.
- tablist gets aria-orientation when vertical.

## Do

- Use roles tablist/tab/tabpanel with correct aria wiring.
- Keep selected tab in the tab order; others tabindex=-1.
- Let the indicator slot express era personality.

## Don't

- Don't use only color to show selection — include structure/indicator.
- Don't put interactive content in the tablist outside tabs.
- Don't skip keyboard arrow navigation in the web component.
