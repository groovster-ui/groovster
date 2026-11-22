/* ew-toast.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-toast-region> — light-DOM toast host with polite live region (APG live regions).
 * Method: region.show({ title, body, variant, timeout }). No imports. Zag.js: not used.
 * Timer pauses on hover/focus. Uses role=status only (region is already live — no nested alert).
 */
(() => {
  const TAG = 'ew-toast-region';
  if (customElements.get(TAG)) return;

  class EwToastRegion extends HTMLElement {
    connectedCallback() {
      this.classList.add('ew-toast-region');
      if (!this.hasAttribute('aria-live')) this.setAttribute('aria-live', 'polite');
      if (!this.hasAttribute('aria-relevant')) this.setAttribute('aria-relevant', 'additions');
      this.setAttribute('aria-atomic', 'false');
    }

    /** @param {{title?: string, body: string, variant?: string, timeout?: number}} opts */
    show(opts = {}) {
      const toast = document.createElement('div');
      toast.className = 'ew-toast';
      toast.dataset.variant = opts.variant || 'info';
      // Region already has aria-live; keep a single status role (never nest role=alert).
      toast.setAttribute('role', 'status');
      if (opts.title) {
        const t = document.createElement('strong');
        t.className = 'ew-toast__title';
        t.textContent = opts.title;
        toast.appendChild(t);
      }
      const body = document.createElement('p');
      body.className = 'ew-toast__body';
      body.textContent = opts.body || '';
      toast.appendChild(body);

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'ew-icon-button';
      close.dataset.variant = 'ghost';
      close.setAttribute('aria-label', 'Dismiss');
      close.innerHTML = '<span class="ew-icon-button__icon" aria-hidden="true">×</span>';
      close.addEventListener('click', () => this.#dismiss(toast));
      toast.appendChild(close);

      const timeout = opts.timeout ?? 5000;
      toast._ewRemaining = timeout;
      toast._ewDeadline = 0;
      toast._ewTimer = 0;

      const pause = () => this.#pause(toast);
      const resume = () => this.#resume(toast);
      toast.addEventListener('pointerenter', pause);
      toast.addEventListener('pointerleave', resume);
      toast.addEventListener('focusin', pause);
      toast.addEventListener('focusout', resume);

      this.appendChild(toast);
      if (timeout > 0) this.#resume(toast);
      this.dispatchEvent(new CustomEvent('ew-toast-show', { bubbles: true, detail: opts }));
      return toast;
    }

    #pause(toast) {
      if (!toast._ewTimer) return;
      clearTimeout(toast._ewTimer);
      toast._ewTimer = 0;
      toast._ewRemaining = Math.max(0, toast._ewDeadline - Date.now());
    }

    #resume(toast) {
      if (toast._ewRemaining <= 0 || toast._ewTimer) return;
      toast._ewDeadline = Date.now() + toast._ewRemaining;
      toast._ewTimer = window.setTimeout(() => this.#dismiss(toast), toast._ewRemaining);
    }

    #dismiss(toast) {
      if (!toast.isConnected) return;
      if (toast._ewTimer) clearTimeout(toast._ewTimer);
      toast.remove();
      this.dispatchEvent(new CustomEvent('ew-toast-dismiss', { bubbles: true }));
    }
  }

  customElements.define(TAG, EwToastRegion);
})();
