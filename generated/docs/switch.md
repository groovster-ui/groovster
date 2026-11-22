# Switch

> Generated from `spec/components/switch.json`. Do not hand-edit.

Binary on/off control. Prefer checkbox with switch role styling, or input type=checkbox with appearance skinning.

## Canonical HTML

```html
<label class="ew-switch">
  <input class="ew-switch__control" type="checkbox" role="switch" aria-checked="false" />
  <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
  <span class="ew-switch__label">Notifications</span>
</label>
```

## Imports

- `@groovster/css/switch.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default | success (default: default)

## ARIA

- Role: switch (via role=switch on checkbox) or checkbox
- If using role=switch, keep aria-checked in sync with checked.
- Visible label required.
- Space toggles; do not require Enter-only activation.

## Do

- Keep a visible text label.
- Sync aria-checked when role=switch is used.
- Make hit target at least 24×24px.

## Don't

- Don't animate the thumb in a way that ignores prefers-reduced-motion.
- Don't use a switch for ternary or multi-select states.
- Don't rely on track color alone without a clear thumb position.
