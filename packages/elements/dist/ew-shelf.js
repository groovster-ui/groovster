/* ew-shelf.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-shelf> — horizontal row, arrow keys, and prev/next buttons. No imports.
 */
(() => {
  const TAG = 'ew-shelf';
  if (customElements.get(TAG)) return;

  class EwShelf extends HTMLElement {
    connectedCallback() {
      this.classList.add('ew-shelf');
      this.addEventListener('keydown', this.#onKey);
      this.addEventListener('click', this.#onClick);
    }

    disconnectedCallback() {
      this.removeEventListener('keydown', this.#onKey);
      this.removeEventListener('click', this.#onClick);
    }

    #row() {
      return this.querySelector('.ew-shelf__row');
    }

    #step(dir) {
      const row = this.#row();
      if (!row) return;
      const card = row.querySelector(':scope > *');
      const amount = (card?.getBoundingClientRect().width || 180) + 12;
      const motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      row.scrollBy({ left: dir * amount, behavior: motion });
    }

    #onClick = (event) => {
      if (event.target.closest?.('[data-shelf="prev"]')) this.#step(-1);
      if (event.target.closest?.('[data-shelf="next"]')) this.#step(1);
    };

    #onKey = (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); this.#step(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); this.#step(-1); }
    };
  }

  customElements.define(TAG, EwShelf);
})();
