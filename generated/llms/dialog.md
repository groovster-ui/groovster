## Dialog (`ew-dialog`)

Modal dialog using native <dialog>. Open with showModal(); eras skin backdrop and frame.

HTML:
```html
<dialog class="ew-dialog" aria-labelledby="dlg-title">
  <header class="ew-dialog__header"><h2 id="dlg-title">Sign up</h2></header>
  <div class="ew-dialog__body"><!-- fields --></div>
  <footer class="ew-dialog__footer"><button type="button" class="ew-button" data-variant="ghost" onclick="this.closest('dialog').close()">Cancel</button><button type="submit" class="ew-button">Continue</button></footer>
</dialog>
```

CSS: @era-widgets/css/dialog.css + @era-widgets/css/eras/<era>.css
Variants: variant=modal|sheet(default:modal)
Sizes: sm|md|lg (default md)
ARIA: dialog (native <dialog> provides)
Do: Call showModal() for modal dialogs.
Don't: Don't fake modals with only z-index divs when <dialog> works.
