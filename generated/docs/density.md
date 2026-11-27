# Density

> Generated from `spec/components/density.json`. Do not hand-edit.

App heading scale and compact or comfortable density. Quiet cards and body type on controls.

## Canonical HTML

```html
<div class="ew-density" data-density="compact"><h1 class="ew-title ew-title--page">Inbox</h1></div>
```

## Imports

- `@groovster/css/density.css`
- `@groovster/css/eras/<era>.css`

## Variants

- **density** (`data-density`): comfortable | compact (default: comfortable)

## ARIA

- Role: none
- data-density=comfortable|compact tightens padding. Inside compact or whisper, cards are quiet unless they have .ew-feature.
- Headings: .ew-title--page, --section, --panel. .ew-caps opts into uppercase.

## Do

- Put data-density on any container. Use .ew-title--page for the screen title, --section for groups, --panel inside cards and dialogs.
- Mark a card .ew-feature when it should keep the full era frame inside compact or whisper.

## Don't

- Do not use the Swiss section clamp on dialog, card, or shelf titles.
