/**
 * <ew-segmented> — radiogroup with arrow-key roving. No imports.
 */
(() => {
  const TAG = 'ew-segmented';
  if (customElements.get(TAG)) return;

  class EwSegmented extends HTMLElement {
    connectedCallback() {
      this.classList.add('ew-segmented');
      if (!this.getAttribute('role')) this.setAttribute('role', 'radiogroup');
      this.addEventListener('keydown', this.#onKey);
      this.addEventListener('click', this.#onClick);
      this.#sync();
    }

    disconnectedCallback() {
      this.removeEventListener('keydown', this.#onKey);
      this.removeEventListener('click', this.#onClick);
    }

    #items() {
      return [...this.querySelectorAll('.ew-segmented__item, [role="radio"]')];
    }

    #sync() {
      const items = this.#items();
      if (!items.some((item) => item.getAttribute('aria-checked') === 'true') && items[0]) {
        items[0].setAttribute('aria-checked', 'true');
      }
      for (const item of items) {
        const on = item.getAttribute('aria-checked') === 'true';
        item.setAttribute('role', 'radio');
        item.tabIndex = on ? 0 : -1;
      }
    }

    #select(next) {
      for (const item of this.#items()) item.setAttribute('aria-checked', item === next ? 'true' : 'false');
      this.#sync();
      next.focus();
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }

    #onClick = (event) => {
      const item = event.target.closest?.('.ew-segmented__item, [role="radio"]');
      if (item && this.contains(item)) this.#select(item);
    };

    #onKey = (event) => {
      const items = this.#items();
      const index = items.findIndex((item) => item.getAttribute('aria-checked') === 'true');
      if (index < 0) return;
      const dir = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!dir && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
        : (index + dir + items.length) % items.length;
      this.#select(items[next]);
    };
  }

  customElements.define(TAG, EwSegmented);
})();
