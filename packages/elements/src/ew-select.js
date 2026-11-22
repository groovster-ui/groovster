/**
 * <ew-select> — light-DOM Select (APG Select-Only Combobox / listbox).
 * Progressive enhancement. Public classes: ew-select*. No dependencies. No imports.
 * Zag.js: not used.
 */
(() => {
  const TAG = 'ew-select';
  if (customElements.get(TAG)) return;

  class EwSelect extends HTMLElement {
    #open = false;
    #ready = false;
    #mo = null;
    #onDocPointer = (e) => {
      if (!this.#open) return;
      if (!this.contains(e.target)) this.#setOpen(false);
    };

    connectedCallback() {
      this.classList.add('ew-select');
      this.#upgrade();
      if (!this.#ready) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true });
      }
    }

    disconnectedCallback() {
      this.#mo?.disconnect();
      this.#mo = null;
      this.#unbind();
      document.removeEventListener('pointerdown', this.#onDocPointer, true);
    }

    get #native() {
      return this.querySelector('select.ew-select__control, select');
    }
    get #trigger() {
      return this.querySelector('.ew-select__trigger');
    }
    get #list() {
      return this.querySelector('[role="listbox"]');
    }
    get #options() {
      return [...(this.#list?.querySelectorAll('[role="option"]') || [])];
    }

    #upgrade() {
      if (this.#ready || !this.#native) return;
      this.#ready = true;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensureStructure();
      this.#unbind();
      this.#bind();
      this.#syncFromNative();
    }

    #ensureStructure() {
      const native = this.#native;
      if (!native) return;
      native.hidden = true;
      native.tabIndex = -1;
      if (!native.id) native.id = `${TAG}-${Math.random().toString(36).slice(2, 8)}`;

      let trigger = this.#trigger;
      if (!trigger) {
        trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'ew-select__trigger';
        native.insertAdjacentElement('afterend', trigger);
      }
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (!trigger.id) trigger.id = `${native.id}-trigger`;

      const label = this.querySelector('label.ew-select__label, label');
      if (label) {
        if (!label.id) label.id = `${native.id}-label`;
        if (label.htmlFor === native.id) label.removeAttribute('for');
      }
      // Value span so aria-labelledby name includes visible trigger text (axe label-content-name).
      let valueSpan = trigger.querySelector('.ew-select__value');
      if (!valueSpan) {
        valueSpan = document.createElement('span');
        valueSpan.className = 'ew-select__value';
        trigger.replaceChildren(valueSpan);
      }
      if (!valueSpan.id) valueSpan.id = `${native.id}-value`;
      if (label) trigger.setAttribute('aria-labelledby', `${label.id} ${valueSpan.id}`);
      else trigger.removeAttribute('aria-labelledby');

      let list = this.#list;
      if (!list) {
        list = document.createElement('ul');
        list.className = 'ew-select__list';
        list.hidden = true;
        trigger.insertAdjacentElement('afterend', list);
      }
      list.setAttribute('role', 'listbox');
      list.id = list.id || `${native.id}-list`;
      trigger.setAttribute('aria-controls', list.id);

      list.replaceChildren();
      [...native.options].forEach((opt, i) => {
        const li = document.createElement('li');
        li.className = 'ew-select__option';
        li.setAttribute('role', 'option');
        li.id = `${list.id}-opt-${i}`;
        li.dataset.value = opt.value;
        li.textContent = opt.textContent;
        if (opt.disabled) li.setAttribute('aria-disabled', 'true');
        li.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
        list.appendChild(li);
      });
      this.#updateTriggerLabel();
    }

    #bind() {
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKeyDown);
    }
    #unbind() {
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKeyDown);
    }

    #onClick = (e) => {
      const opt = e.target.closest('[role="option"]');
      if (opt && this.contains(opt)) {
        if (opt.getAttribute('aria-disabled') === 'true') return;
        this.#choose(opt);
        return;
      }
      if (e.target.closest('.ew-select__trigger')) {
        this.#setOpen(!this.#open);
      }
    };

    #onKeyDown = (e) => {
      const trigger = this.#trigger;
      const options = this.#options.filter((o) => o.getAttribute('aria-disabled') !== 'true');
      if (!trigger) return;

      if (e.target === trigger) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          if (!this.#open) this.#setOpen(true);
          else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const sel = options.find((o) => o.getAttribute('aria-selected') === 'true') || options[0];
            const i = options.indexOf(sel);
            const next =
              e.key === 'ArrowDown'
                ? options[Math.min(i + 1, options.length - 1)]
                : options[Math.max(i - 1, 0)];
            next?.focus();
          }
        }
        if (e.key === 'Escape' && this.#open) {
          e.preventDefault();
          this.#setOpen(false);
        }
        return;
      }

      const opt = e.target.closest('[role="option"]');
      if (!opt) return;
      const i = options.indexOf(opt);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        options[Math.min(i + 1, options.length - 1)]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        options[Math.max(i - 1, 0)]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        options[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        options[options.length - 1]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.#choose(opt);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.#setOpen(false);
        trigger.focus();
      }
    };

    #setOpen(open) {
      this.#open = open;
      const list = this.#list;
      const trigger = this.#trigger;
      if (!list || !trigger) return;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      list.hidden = !open;
      if (open) {
        document.addEventListener('pointerdown', this.#onDocPointer, true);
        const selected =
          this.#options.find((o) => o.getAttribute('aria-selected') === 'true') || this.#options[0];
        this.#options.forEach((o) => {
          o.tabIndex = o === selected ? 0 : -1;
        });
        selected?.focus();
      } else {
        document.removeEventListener('pointerdown', this.#onDocPointer, true);
        trigger.focus();
      }
    }

    #choose(opt) {
      const native = this.#native;
      this.#options.forEach((o) => {
        const on = o === opt;
        o.setAttribute('aria-selected', on ? 'true' : 'false');
        o.tabIndex = on ? 0 : -1;
      });
      if (native) {
        native.value = opt.dataset.value;
        native.dispatchEvent(new Event('change', { bubbles: true }));
      }
      this.#updateTriggerLabel();
      this.#setOpen(false);
      this.dispatchEvent(
        new CustomEvent('ew-select-change', { bubbles: true, detail: { value: opt.dataset.value } })
      );
    }

    #updateTriggerLabel() {
      const native = this.#native;
      const trigger = this.#trigger;
      if (!native || !trigger) return;
      const opt = native.selectedOptions[0];
      const valueSpan = trigger.querySelector('.ew-select__value');
      const text = opt ? opt.textContent : 'Select';
      if (valueSpan) valueSpan.textContent = text;
      else trigger.textContent = text;
    }

    #syncFromNative() {
      const native = this.#native;
      if (!native) return;
      const val = native.value;
      this.#options.forEach((o) => {
        o.setAttribute('aria-selected', o.dataset.value === val ? 'true' : 'false');
      });
      this.#updateTriggerLabel();
    }
  }

  customElements.define(TAG, EwSelect);
})();
