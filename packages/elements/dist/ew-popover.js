/* ew-popover.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-popover> — light-DOM non-modal popover (APG Disclosure / Popover pattern).
 * Uses Popover API when available; falls back to hidden toggle. No imports. Zag.js: not used.
 * Listens for the native `toggle` event so aria-expanded never goes stale.
 */
(() => {
  const TAG = 'ew-popover';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwPopover extends HTMLElement {
    #ready = false;
    #mo = null;
    #onDoc = (e) => {
      if (!this.#isOpen()) return;
      if (!this.contains(e.target)) this.#close();
    };
    #onToggle = () => {
      this.#syncAria();
    };

    connectedCallback() {
      this.classList.add('ew-popover');
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      this.#mo?.disconnect();
      this.#mo = new MutationObserver(() => this.#upgrade());
      this.#mo.observe(this, { childList: true, subtree: true });
    }
    disconnectedCallback() {
      this.#mo?.disconnect();
      this.#mo = null;
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
      this.#panel?.removeEventListener('toggle', this.#onToggle);
      document.removeEventListener('pointerdown', this.#onDoc, true);
      this.#ready = false;
    }

    get #trigger() {
      return this.querySelector('.ew-popover__trigger, [popovertarget], [aria-expanded]');
    }
    get #panel() {
      return this.querySelector('.ew-popover__panel, [popover]');
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
      trigger.setAttribute('aria-controls', panel.id);
      if (!trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
      if (!panel.hasAttribute('popover') && trigger.getAttribute('aria-expanded') !== 'true') {
        panel.hidden = true;
      }
      panel.removeEventListener('toggle', this.#onToggle);
      panel.addEventListener('toggle', this.#onToggle);
    }

    #isOpen() {
      const panel = this.#panel;
      if (!panel) return false;
      try {
        if (typeof panel.matches === 'function' && panel.matches(':popover-open')) return true;
      } catch {
        /* :popover-open is unsupported */
      }
      return panel.hidden === false && !panel.hasAttribute('popover');
    }

    #onClick = (e) => {
      if (e.target.closest('.ew-popover__trigger, [popovertarget]')) {
        queueMicrotask(() => this.#syncAria());
        if (!this.#panel?.hasAttribute('popover')) {
          e.preventDefault();
          this.#isOpen() ? this.#close() : this.#open();
        } else {
          document.addEventListener('pointerdown', this.#onDoc, true);
        }
      }
    };

    #onKey = (e) => {
      if (e.key === 'Escape' && this.#isOpen()) {
        e.preventDefault();
        this.#close();
        this.#trigger?.focus();
      }
    };

    #open() {
      const panel = this.#panel;
      const trigger = this.#trigger;
      if (!panel || !trigger) return;
      if (typeof panel.showPopover === 'function' && panel.hasAttribute('popover')) {
        try {
          panel.showPopover();
        } catch {
          panel.hidden = false;
        }
      } else {
        panel.hidden = false;
      }
      this.#syncAria();
      document.addEventListener('pointerdown', this.#onDoc, true);
      this.dispatchEvent(new CustomEvent('ew-popover-open', { bubbles: true }));
    }

    #close() {
      const panel = this.#panel;
      if (!panel) return;
      if (typeof panel.hidePopover === 'function' && panel.hasAttribute('popover')) {
        try {
          panel.hidePopover();
        } catch {
          panel.hidden = true;
        }
      } else {
        panel.hidden = true;
      }
      this.#syncAria();
      document.removeEventListener('pointerdown', this.#onDoc, true);
      this.dispatchEvent(new CustomEvent('ew-popover-close', { bubbles: true }));
    }

    #syncAria() {
      const open = this.#isOpen();
      this.#trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) document.addEventListener('pointerdown', this.#onDoc, true);
      else document.removeEventListener('pointerdown', this.#onDoc, true);
    }
  }

  customElements.define(TAG, EwPopover);
})();
