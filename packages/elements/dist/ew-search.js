/* ew-search.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-search> — search field with a clear button. No imports.
 * Clear hides while the field is empty, then clears, refocuses, and fires input.
 */
(() => {
  const TAG = 'ew-search';
  if (customElements.get(TAG)) return;

  class EwSearch extends HTMLElement {
    #input = null;
    #clear = null;

    connectedCallback() {
      this.classList.add('ew-search');
      if (!this.getAttribute('role')) this.setAttribute('role', 'search');
      this.#input = this.querySelector('input');
      this.#clear = this.querySelector('.ew-search__clear, [data-clear]');
      if (!this.#input || !this.#clear) return;
      this.#input.addEventListener('input', this.#sync);
      this.#input.addEventListener('keydown', this.#onKey);
      this.#clear.addEventListener('click', this.#onClear);
      this.#sync();
    }

    disconnectedCallback() {
      this.#input?.removeEventListener('input', this.#sync);
      this.#input?.removeEventListener('keydown', this.#onKey);
      this.#clear?.removeEventListener('click', this.#onClear);
    }

    #sync = () => {
      if (!this.#clear || !this.#input) return;
      this.#clear.hidden = this.#input.value.length === 0;
    };

    #onClear = () => {
      if (!this.#input) return;
      this.#input.value = '';
      this.#input.dispatchEvent(new Event('input', { bubbles: true }));
      this.#input.focus();
      this.#sync();
    };

    #onKey = (event) => {
      if (event.key === 'Escape' && this.#input?.value) {
        event.preventDefault();
        this.#onClear();
      }
    };
  }

  customElements.define(TAG, EwSearch);
})();
