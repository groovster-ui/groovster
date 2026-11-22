# Popover

> Generated from `spec/components/popover.json`. Do not hand-edit.

Non-modal popover surface via Popover API.

## Canonical HTML

```html
<ew-popover class="ew-popover">
  <button type="button" class="ew-button ew-popover__trigger" popovertarget="pop-1">Details</button>
  <div id="pop-1" class="ew-popover__panel" popover>
    <p>Popover content</p>
  </div>
</ew-popover>
```

## Imports

- `@groovster/css/popover.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default | rich (default: default)

## ARIA

- Role: dialog or group
- <ew-popover> syncs aria and Escape/outside dismiss.
- Zag.js not used.

## Do

- Prefer popover attribute.
- Keep content short.

## Don't

- Don't use as the only way to show critical errors.
- Don't autoplay motion in the panel.
