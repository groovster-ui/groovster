/**
 * <ew-code> — copy button writes the code text. No imports.
 */
(() => {
  const TAG = 'ew-code';
  if (customElements.get(TAG)) return;

  class EwCode extends HTMLElement {
    connectedCallback() {
      this.classList.add('ew-code');
      this.addEventListener('click', this.#onClick);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.#onClick);
    }

    #onClick = async (event) => {
      const button = event.target.closest?.('.ew-code__copy, [data-copy]');
      if (!button || !this.contains(button)) return;
      const text = (this.querySelector('code') || this).innerText.replace(/\s*Copy\s*$/, '').trim();
      try {
        await navigator.clipboard.writeText(text);
        button.dataset.copied = 'true';
      } catch {
        button.dataset.copied = 'false';
      }
    };
  }

  customElements.define(TAG, EwCode);
})();
