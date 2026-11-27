/* ew-pagination.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-pagination> — moves aria-current when a page is chosen. No imports.
 */
(() => {
  const TAG = 'ew-pagination';
  if (customElements.get(TAG)) return;

  class EwPagination extends HTMLElement {
    connectedCallback() {
      this.classList.add('ew-pagination');
      if (!this.getAttribute('role')) this.setAttribute('role', 'navigation');
      this.addEventListener('click', this.#onClick);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.#onClick);
    }

    #pages() {
      return [...this.querySelectorAll('.ew-pagination__page')];
    }

    #onClick = (event) => {
      const page = event.target.closest?.('.ew-pagination__page');
      if (!page || !this.contains(page) || page.hasAttribute('aria-disabled')) return;
      if (page.classList.contains('ew-pagination__prev') || page.classList.contains('ew-pagination__next')) return;
      for (const item of this.#pages()) {
        if (item === page) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      }
      this.dispatchEvent(new Event('change', { bubbles: true }));
    };
  }

  customElements.define(TAG, EwPagination);
})();
