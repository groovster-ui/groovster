/**
 * <ew-tooltip> — light-DOM Tooltip (WAI-ARIA APG).
 * Shows on focus/hover; Escape hides; not the only accessible name. No imports. Zag.js: not used.
 */
(() => {
  const TAG = 'ew-tooltip';
  if (customElements.get(TAG)) return;

  class EwTooltip extends HTMLElement {
    #ready = false;
    #mo = null;
    #showTimer = 0;
    #hideTimer = 0;

    connectedCallback() {
      this.classList.add('ew-tooltip');
      this.addEventListener('pointerenter', this.#onEnter);
      this.addEventListener('pointerleave', this.#onLeave);
      this.addEventListener('focusin', this.#onEnter);
      this.addEventListener('focusout', this.#onLeave);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      if (!this.#ready) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true, subtree: true });
      }
    }
    disconnectedCallback() {
      this.#mo?.disconnect();
      this.removeEventListener('pointerenter', this.#onEnter);
      this.removeEventListener('pointerleave', this.#onLeave);
      this.removeEventListener('focusin', this.#onEnter);
      this.removeEventListener('focusout', this.#onLeave);
      this.removeEventListener('keydown', this.#onKey);
      clearTimeout(this.#showTimer);
      clearTimeout(this.#hideTimer);
    }

    get #trigger() {
      return this.querySelector('button, a, [tabindex], .ew-button, .ew-icon-button');
    }
    get #tip() {
      return this.querySelector('.ew-tooltip__tip, [role="tooltip"]');
    }

    #upgrade() {
      if (this.#ready || !this.#tip || !this.#trigger) return;
      this.#ready = true;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensure();
    }

    #ensure() {
      const tip = this.#tip;
      const trigger = this.#trigger;
      if (!tip || !trigger) return;
      if (!tip.id) tip.id = `${TAG}-${Math.random().toString(36).slice(2, 8)}`;
      tip.setAttribute('role', 'tooltip');
      tip.setAttribute('popover', 'manual');
      tip.dataset.ewOpen = 'false';
      if (!trigger.getAttribute('aria-describedby')?.includes(tip.id)) {
        const prev = trigger.getAttribute('aria-describedby') || '';
        trigger.setAttribute('aria-describedby', `${prev} ${tip.id}`.trim());
      }
    }

    #onEnter = () => {
      clearTimeout(this.#hideTimer);
      this.#showTimer = window.setTimeout(() => this.#show(), 300);
    };
    #onLeave = () => {
      clearTimeout(this.#showTimer);
      this.#hideTimer = window.setTimeout(() => this.#hide(), 100);
    };
    #onKey = (e) => {
      if (e.key === 'Escape') this.#hide();
    };

    #show() {
      const tip = this.#tip;
      if (!tip) return;
      tip.showPopover();
      tip.dataset.ewOpen = 'true';
      tip.style.opacity = '1';
    }
    #hide() {
      const tip = this.#tip;
      if (!tip || !tip.matches(':popover-open')) return;
      tip.hidePopover();
      tip.dataset.ewOpen = 'false';
      tip.style.opacity = '';
    }
  }

  customElements.define(TAG, EwTooltip);
})();
