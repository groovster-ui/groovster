/* ew-menu.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-menu> — light-DOM Menu Button (WAI-ARIA APG).
 * Public classes: ew-menu*. No dependencies. No imports. Zag.js: not used.
 */
(() => {
  const TAG = 'ew-menu';
  if (customElements.get(TAG)) return;

  class EwMenu extends HTMLElement {
    #open = false;
    #ready = false;
    #mo = null;
    #onDoc = (e) => {
      if (!this.#open) return;
      if (!this.contains(e.target)) this.#setOpen(false);
    };

    connectedCallback() {
      this.classList.add('ew-menu');
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      if (!this.#ready) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true, subtree: true });
      }
    }
    disconnectedCallback() {
      this.#mo?.disconnect();
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
      document.removeEventListener('pointerdown', this.#onDoc, true);
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
      if (this.#ready || !this.#trigger || !this.#panel) return;
      this.#ready = true;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensure();
    }

    #ensure() {
      const trigger = this.#trigger;
      const panel = this.#panel;
      if (!trigger || !panel) return;
      if (!panel.id) panel.id = `${TAG}-${Math.random().toString(36).slice(2, 8)}`;
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('popovertarget', panel.id);
      panel.setAttribute('role', 'menu');
      panel.setAttribute('popover', 'manual');
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
        this.#setOpen(!this.#open);
      }
    };

    #onKey = (e) => {
      const trigger = this.#trigger;
      const items = this.#items;
      if (e.target === trigger || trigger?.contains(e.target)) {
        if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          this.#setOpen(true);
          items[0]?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.#setOpen(true);
          items[items.length - 1]?.focus();
        } else if (e.key === 'Escape' && this.#open) {
          e.preventDefault();
          this.#setOpen(false);
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
        this.#setOpen(false);
        trigger?.focus();
      } else if (e.key === 'Tab') {
        this.#setOpen(false);
      }
    };

    #setOpen(open) {
      this.#open = open;
      const trigger = this.#trigger;
      const panel = this.#panel;
      if (!trigger || !panel) return;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        panel.showPopover();
        document.addEventListener('pointerdown', this.#onDoc, true);
      } else {
        if (panel.matches(':popover-open')) panel.hidePopover();
        document.removeEventListener('pointerdown', this.#onDoc, true);
        if (document.activeElement && panel.contains(document.activeElement)) {
          trigger.focus();
        }
      }
    }

    #activate(item) {
      this.dispatchEvent(
        new CustomEvent('ew-menu-select', {
          bubbles: true,
          detail: { id: item.id, label: item.textContent?.trim() },
        })
      );
      this.#setOpen(false);
    }
  }

  customElements.define(TAG, EwMenu);
})();
