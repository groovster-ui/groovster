/* ew-menu.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-menu> — light-DOM Menu Button (WAI-ARIA APG).
 * Public classes: ew-menu*. No dependencies. No imports. Zag.js: not used.
 * Outside click closes without restoring focus. Escape/selection restore focus.
 * Typeahead jumps to matching menuitems.
 */
(() => {
  const TAG = 'ew-menu';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwMenu extends HTMLElement {
    #open = false;
    #ready = false;
    #mo = null;
    #typeahead = '';
    #typeaheadTimer = null;
    #onDoc = (e) => {
      if (!this.#open) return;
      if (!this.contains(e.target)) this.#setOpen(false, { restoreFocus: false });
    };

    connectedCallback() {
      this.classList.add('ew-menu');
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      this.#mo?.disconnect();
      this.#mo = new MutationObserver(() => this.#upgrade());
      this.#mo.observe(this, { childList: true, subtree: true, characterData: true });
    }
    disconnectedCallback() {
      if (this.#open) this.#setOpen(false, { restoreFocus: false });
      this.#mo?.disconnect();
      this.#mo = null;
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
      document.removeEventListener('pointerdown', this.#onDoc, true);
      clearTimeout(this.#typeaheadTimer);
      this.#ready = false;
      this.#open = false;
    }

    get #trigger() {
      return this.querySelector('.ew-menu__trigger, [aria-haspopup="menu"]');
    }
    get #panel() {
      return this.querySelector('.ew-menu__panel, [role="menu"]');
    }
    get #items() {
      return [...(this.#panel?.querySelectorAll('[role="menuitem"]') || [])].filter(
        (i) => i.getAttribute('aria-disabled') !== 'true'
      );
    }

    #upgrade() {
      if (!this.#trigger || !this.#panel) return;
      this.#ensure();
      this.#ready = true;
    }

    #ensure() {
      const trigger = this.#trigger;
      const panel = this.#panel;
      if (!trigger || !panel) return;
      if (!panel.id) panel.id = `${TAG}-${++uid}`;
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', this.#open ? 'true' : 'false');
      panel.setAttribute('role', 'menu');
      panel.hidden = !this.#open;
      this.#items.forEach((item, i) => {
        item.tabIndex = -1;
        if (!item.id) item.id = `${panel.id}-item-${i}`;
      });
    }

    #onClick = (e) => {
      const item = e.target.closest('[role="menuitem"]');
      if (item && this.contains(item)) {
        this.#activate(item);
        return;
      }
      if (e.target.closest('.ew-menu__trigger, [aria-haspopup="menu"]')) {
        e.preventDefault();
        this.#setOpen(!this.#open, { restoreFocus: true });
      }
    };

    #onKey = (e) => {
      const trigger = this.#trigger;
      const items = this.#items;
      if (e.target === trigger || trigger?.contains(e.target)) {
        if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          this.#setOpen(true, { restoreFocus: true });
          items[0]?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.#setOpen(true, { restoreFocus: true });
          items[items.length - 1]?.focus();
        } else if (e.key === 'Escape' && this.#open) {
          e.preventDefault();
          this.#setOpen(false, { restoreFocus: true });
        }
        return;
      }
      const item = e.target.closest('[role="menuitem"]');
      if (!item) return;
      const i = items.indexOf(item);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(i + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.#activate(item);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.#setOpen(false, { restoreFocus: true });
      } else if (e.key === 'Tab') {
        this.#setOpen(false, { restoreFocus: false });
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        this.#typeahead += e.key.toLowerCase();
        clearTimeout(this.#typeaheadTimer);
        this.#typeaheadTimer = setTimeout(() => {
          this.#typeahead = '';
        }, 500);
        const match = items.find((it) =>
          (it.textContent || '').trim().toLowerCase().startsWith(this.#typeahead)
        );
        match?.focus();
      }
    };

    #setOpen(open, { restoreFocus = false } = {}) {
      this.#open = open;
      const trigger = this.#trigger;
      const panel = this.#panel;
      if (!trigger || !panel) return;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
      if (open) document.addEventListener('pointerdown', this.#onDoc, true);
      else {
        document.removeEventListener('pointerdown', this.#onDoc, true);
        if (restoreFocus) trigger.focus();
      }
    }

    #activate(item) {
      this.dispatchEvent(
        new CustomEvent('ew-menu-select', {
          bubbles: true,
          detail: { id: item.id, label: item.textContent?.trim() },
        })
      );
      this.#setOpen(false, { restoreFocus: true });
    }
  }

  customElements.define(TAG, EwMenu);
})();
