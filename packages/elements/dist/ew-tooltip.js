/* ew-tooltip.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-tooltip> — light-DOM Tooltip (WAI-ARIA APG).
 * Shows on focus/hover; Escape hides; not the only accessible name. No imports. Zag.js: not used.
 */
(() => {
  const TAG = 'ew-tooltip';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwTooltip extends HTMLElement {
    #ready = false;
    #mo = null;
    #showTimer = 0;
    #hideTimer = 0;

    connectedCallback() {
      this.classList.add('ew-tooltip');
      this.#unbind();
      this.addEventListener('pointerenter', this.#onEnter);
      this.addEventListener('pointerleave', this.#onLeave);
      this.addEventListener('focusin', this.#onEnter);
      this.addEventListener('focusout', this.#onLeave);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      this.#mo?.disconnect();
      this.#mo = new MutationObserver(() => this.#upgrade());
      this.#mo.observe(this, { childList: true, subtree: true });
    }
    disconnectedCallback() {
      this.#hide();
      this.#mo?.disconnect();
      this.#mo = null;
      this.#unbind();
      clearTimeout(this.#showTimer);
      clearTimeout(this.#hideTimer);
      this.#ready = false;
    }
    #unbind() {
      this.removeEventListener('pointerenter', this.#onEnter);
      this.removeEventListener('pointerleave', this.#onLeave);
      this.removeEventListener('focusin', this.#onEnter);
      this.removeEventListener('focusout', this.#onLeave);
      this.removeEventListener('keydown', this.#onKey);
    }

    get #trigger() {
      return this.querySelector('button, a, [tabindex], .ew-button, .ew-icon-button');
    }
    get #tip() {
      return this.querySelector('.ew-tooltip__tip, [role="tooltip"]');
    }

    #upgrade() {
      if (!this.#tip || !this.#trigger) return;
      this.#ensure();
      this.#ready = true;
    }

    #ensure() {
      const tip = this.#tip;
      const trigger = this.#trigger;
      if (!tip || !trigger) return;
      if (!tip.id) tip.id = `${TAG}-${++uid}`;
      const anchorName = `--ew-tooltip-${tip.id}`;
      tip.setAttribute('role', 'tooltip');
      tip.setAttribute('popover', 'manual');
      tip.dataset.ewOpen = 'false';
      trigger.style.setProperty('anchor-name', anchorName);
      tip.style.setProperty('position-anchor', anchorName);
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
      if (typeof tip.showPopover === 'function') {
        try {
          tip.showPopover();
        } catch {
          /* already open */
        }
      }
      tip.dataset.ewOpen = 'true';
      tip.style.opacity = '1';
    }
    #hide() {
      const tip = this.#tip;
      if (!tip) return;
      let open = tip.dataset.ewOpen === 'true';
      try {
        open = open || tip.matches(':popover-open');
      } catch {
        /* selector unsupported */
      }
      if (!open) return;
      if (typeof tip.hidePopover === 'function') {
        try {
          tip.hidePopover();
        } catch {
          /* already closed */
        }
      }
      tip.dataset.ewOpen = 'false';
      tip.style.opacity = '';
    }
  }

  customElements.define(TAG, EwTooltip);
})();
