/**
 * <ew-popover> — light-DOM non-modal popover (APG Disclosure / Popover pattern).
 * Uses Popover API when available; falls back to hidden toggle. No imports. Zag.js: not used.
 */
(() => {
  const TAG = 'ew-popover';
  if (customElements.get(TAG)) return;

  class EwPopover extends HTMLElement {
    #ready = false;
    #mo = null;
    #onDoc = (e) => {
      if (!this.#isOpen()) return;
      if (!this.contains(e.target)) this.#close();
    };

    connectedCallback() {
      this.classList.add('ew-popover');
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
      return this.querySelector('.ew-popover__trigger, [popovertarget], [aria-expanded]');
    }
    get #panel() {
      return this.querySelector('.ew-popover__panel, [popover]');
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
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', 'false');
      if (!panel.hasAttribute('popover')) {
        panel.hidden = true;
      }
    }

    #isOpen() {
      const panel = this.#panel;
      if (!panel) return false;
      if (typeof panel.matches === 'function' && panel.matches(':popover-open')) return true;
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
      trigger.setAttribute('aria-expanded', 'true');
      document.addEventListener('pointerdown', this.#onDoc, true);
      this.dispatchEvent(new CustomEvent('ew-popover-open', { bubbles: true }));
    }

    #close() {
      const panel = this.#panel;
      const trigger = this.#trigger;
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
      trigger?.setAttribute('aria-expanded', 'false');
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
