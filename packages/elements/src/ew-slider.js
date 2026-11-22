/**
 * <ew-slider> — light-DOM Slider enhancing native <input type="range"> (APG).
 * Syncs optional output. Keyboard via native range. No imports. Zag.js: not used.
 *
 * Sync contract: input/change, form reset, and assignments to value/min/max/step/disabled
 * update aria-valuenow and the output. Attribute changes for those names do the same.
 */
(() => {
  const TAG = 'ew-slider';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwSlider extends HTMLElement {
    #mo = null;
    #form = null;
    #wrapped = null;
    #listening = null;

    connectedCallback() {
      this.classList.add('ew-slider');
      this.#upgrade();
    }

    disconnectedCallback() {
      this.#teardown();
    }

    get value() {
      return this.#native?.value ?? '';
    }
    set value(next) {
      const input = this.#native;
      if (!input) return;
      input.value = next;
      this.#sync();
    }

    get #native() {
      return this.querySelector('input.ew-slider__control, input[type="range"]');
    }
    get #output() {
      return this.querySelector('.ew-slider__value, output');
    }

    #teardown() {
      this.#mo?.disconnect();
      this.#mo = null;
      this.#detachInput();
      this.#form?.removeEventListener('reset', this.#onReset);
      this.#form = null;
      this.#unwrap();
    }

    #detachInput() {
      if (!this.#listening) return;
      this.#listening.removeEventListener('input', this.#onInput);
      this.#listening.removeEventListener('change', this.#onInput);
      this.#listening = null;
    }

    #upgrade() {
      const input = this.#native;
      if (!input) {
        if (!this.#mo) {
          this.#mo = new MutationObserver(() => this.#upgrade());
          this.#mo.observe(this, { childList: true, subtree: true });
        }
        return;
      }
      this.#detachInput();
      this.#ensure(input);
      input.addEventListener('input', this.#onInput);
      input.addEventListener('change', this.#onInput);
      this.#listening = input;
      this.#wrap(input);
      this.#form?.removeEventListener('reset', this.#onReset);
      this.#form = input.form || null;
      this.#form?.addEventListener('reset', this.#onReset);
      this.#observe(input);
      this.#sync();
    }

    #ensure(input) {
      if (!input.id) input.id = `${TAG}-${++uid}`;
      if (!input.hasAttribute('min')) input.min = '0';
      if (!input.hasAttribute('max')) input.max = '100';
      const label = this.querySelector('label');
      if (label && !label.htmlFor) label.htmlFor = input.id;
    }

    #observe(input) {
      this.#mo?.disconnect();
      this.#mo = new MutationObserver(() => this.#sync());
      this.#mo.observe(input, {
        attributes: true,
        attributeFilter: ['min', 'max', 'step', 'value', 'disabled'],
      });
    }

    #wrap(input) {
      this.#unwrap();
      const host = this;
      const proto = HTMLInputElement.prototype;
      this.#wrapped = input;
      for (const key of ['value', 'min', 'max', 'step', 'disabled']) {
        const desc = Object.getOwnPropertyDescriptor(proto, key);
        if (!desc?.get || !desc?.set) continue;
        Object.defineProperty(input, key, {
          configurable: true,
          enumerable: desc.enumerable,
          get() {
            return desc.get.call(this);
          },
          set(next) {
            desc.set.call(this, next);
            host.#sync();
          },
        });
      }
    }

    #unwrap() {
      const input = this.#wrapped;
      if (!input) return;
      for (const key of ['value', 'min', 'max', 'step', 'disabled']) delete input[key];
      this.#wrapped = null;
    }

    #onInput = () => {
      this.#sync();
    };

    #onReset = () => {
      queueMicrotask(() => this.#sync());
    };

    #sync() {
      const input = this.#native;
      if (!input) return;
      input.setAttribute('aria-valuemin', input.min);
      input.setAttribute('aria-valuemax', input.max);
      input.setAttribute('aria-valuenow', input.value);
      if (input.disabled) input.setAttribute('aria-disabled', 'true');
      else input.removeAttribute('aria-disabled');
      const out = this.#output;
      if (out) out.textContent = input.value;
    }
  }

  customElements.define(TAG, EwSlider);
})();
