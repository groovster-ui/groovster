/* ew-chip.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-chip> — selectable and removable chips. No imports.
 */
(() => {
  const TAG = 'ew-chip';
  if (customElements.get(TAG)) return;

  class EwChip extends HTMLElement {
    connectedCallback() {
      this.classList.add('ew-chip');
      if (this.hasAttribute('aria-pressed') && !this.getAttribute('role')) this.setAttribute('role', 'button');
      if (this.getAttribute('role') === 'button' && !this.hasAttribute('tabindex')) this.tabIndex = 0;
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKey);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
    }

    #onKey = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target !== this) return;
      event.preventDefault();
      this.click();
    };

    #onClick = (event) => {
      const remove = event.target.closest?.('.ew-chip__remove, [data-remove]');
      if (remove && this.contains(remove)) {
        this.dispatchEvent(new Event('ew-chip-remove', { bubbles: true }));
        this.remove();
        return;
      }
      if (this.hasAttribute('aria-pressed')) {
        const next = this.getAttribute('aria-pressed') !== 'true';
        this.setAttribute('aria-pressed', next ? 'true' : 'false');
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
  }

  customElements.define(TAG, EwChip);
})();
