# Radio

> Generated from `spec/components/radio.json`. Do not hand-edit.

Radio option in a named group. Native radios; eras skin the disc.

## Canonical HTML

```html
<fieldset class="ew-radio-group">
  <legend>Plan</legend>
  <label class="ew-radio"><input class="ew-radio__control" type="radio" name="plan" value="basic" /><span class="ew-radio__disc" aria-hidden="true"></span><span class="ew-radio__label">Basic</span></label>
  <label class="ew-radio"><input class="ew-radio__control" type="radio" name="plan" value="pro" /><span class="ew-radio__disc" aria-hidden="true"></span><span class="ew-radio__label">Pro</span></label>
</fieldset>
```

## Imports

- `@groovster/css/radio.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): default | card (default: default)

## ARIA

- Role: radio (native)
- Same name groups options.
- Provide a fieldset/legend for the group when practical.

## Do

- Group with name + fieldset.
- Keep labels visible.

## Don't

- Don't use radios for multi-select.
- Don't omit a group name.
