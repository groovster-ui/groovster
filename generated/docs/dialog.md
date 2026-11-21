# Dialog

> Generated from `spec/components/dialog.json`. Do not hand-edit.

Modal dialog using native <dialog>. Open with showModal(); eras skin backdrop and frame.

## Canonical HTML

```html
<dialog class="ew-dialog" aria-labelledby="dlg-title">
  <header class="ew-dialog__header"><h2 id="dlg-title">Sign up</h2></header>
  <div class="ew-dialog__body"><!-- fields --></div>
  <footer class="ew-dialog__footer"><button type="button" class="ew-button" data-variant="ghost" onclick="this.closest('dialog').close()">Cancel</button><button type="submit" class="ew-button">Continue</button></footer>
</dialog>
```

## Imports

- `@era-widgets/css/dialog.css`
- `@era-widgets/css/eras/<era>.css`

## Variants

- **variant** (`data-variant`): modal | sheet (default: modal)

## ARIA

- Role: dialog (native <dialog> provides)
- Use <dialog> and showModal() for true modal behavior and focus trap.
- Label via aria-labelledby pointing at the visible title.
- Escape closes native modal dialogs; keep a visible close control too.

## Do

- Call showModal() for modal dialogs.
- Provide a clear title and primary action.
- Honor prefers-reduced-motion on open/close.

## Don't

- Don't fake modals with only z-index divs when <dialog> works.
- Don't trap focus incorrectly or leave focus in the background.
- Don't obscure the title with ornaments.
