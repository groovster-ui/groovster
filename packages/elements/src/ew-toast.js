/**
 * <ew-toast-region> — light-DOM toast host with polite live region (APG live regions).
 * Method: region.show({ title, body, variant, timeout }). No imports. Zag.js: not used.
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
      toast.setAttribute('role', opts.variant === 'danger' ? 'alert' : 'status');
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

      this.appendChild(toast);
      const timeout = opts.timeout ?? 5000;
      if (timeout > 0) {
        const id = window.setTimeout(() => this.#dismiss(toast), timeout);
        toast.dataset.timeoutId = String(id);
      }
      this.dispatchEvent(new CustomEvent('ew-toast-show', { bubbles: true, detail: opts }));
      return toast;
    }

    #dismiss(toast) {
      if (!toast.isConnected) return;
      if (toast.dataset.timeoutId) clearTimeout(Number(toast.dataset.timeoutId));
      toast.remove();
      this.dispatchEvent(new CustomEvent('ew-toast-dismiss', { bubbles: true }));
    }
  }

  customElements.define(TAG, EwToastRegion);
})();
