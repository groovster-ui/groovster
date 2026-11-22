/* ew-slider.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/**
 * <ew-slider> — light-DOM Slider enhancing native <input type="range"> (APG).
 * Syncs aria-valuenow / optional output. Keyboard via native range. No imports. Zag.js: not used.
 */
(() => {
  const TAG = 'ew-slider';
  if (customElements.get(TAG)) return;

  class EwSlider extends HTMLElement {
    #ready = false;
    #mo = null;

    connectedCallback() {
      this.classList.add('ew-slider');
      this.#upgrade();
      if (!this.#ready) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true, subtree: true });
      }
    }
    disconnectedCallback() {
      this.#mo?.disconnect();
      this.#native?.removeEventListener('input', this.#onInput);
      this.#native?.removeEventListener('change', this.#onInput);
    }

    get #native() {
      return this.querySelector('input.ew-slider__control, input[type="range"]');
    }
    get #output() {
      return this.querySelector('.ew-slider__value, output');
    }

    #upgrade() {
      if (this.#ready || !this.#native) return;
      this.#ready = true;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensure();
      this.#native.addEventListener('input', this.#onInput);
      this.#native.addEventListener('change', this.#onInput);
      this.#sync();
    }

    #ensure() {
      const input = this.#native;
      if (!input) return;
      if (!input.id) input.id = `${TAG}-${Math.random().toString(36).slice(2, 8)}`;
      // Native range already exposes the slider role + APG keyboard; only mirror value attrs.
      if (!input.hasAttribute('min')) input.min = '0';
      if (!input.hasAttribute('max')) input.max = '100';
      this.#sync();
    }

    #onInput = () => {
      this.#sync();
      this.dispatchEvent(
        new CustomEvent('ew-slider-change', {
          bubbles: true,
          detail: { value: this.#native?.value },
        })
      );
    };

    #sync() {
      const input = this.#native;
      if (!input) return;
      input.setAttribute('aria-valuemin', input.min);
      input.setAttribute('aria-valuemax', input.max);
      input.setAttribute('aria-valuenow', input.value);
      const out = this.#output;
      if (out) out.textContent = input.value;
    }
  }

  customElements.define(TAG, EwSlider);
})();
