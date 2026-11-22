/**
 * <ew-select> — light-DOM Select-Only Combobox (WAI-ARIA APG).
 * Progressive enhancement. Public classes: ew-select*. No dependencies. No imports.
 * Zag.js: not used.
 *
 * Focus stays on the combobox; options use aria-activedescendant.
 * Outside click closes without restoring focus. Escape/selection restore focus.
 * Tab closes and commits the active option.
 */
(() => {
  const TAG = 'ew-select';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwSelect extends HTMLElement {
    #open = false;
    #ready = false;
    #mo = null;
    #activeId = null;
    #typeahead = '';
    #typeaheadTimer = null;
    #onDocPointer = (e) => {
      if (!this.#open) return;
      if (!this.contains(e.target)) this.#setOpen(false, { restoreFocus: false });
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
      clearTimeout(this.#typeaheadTimer);
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
      if (!native.id) native.id = `${TAG}-${++uid}`;

      let trigger = this.#trigger;
      if (!trigger) {
        trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'ew-select__trigger';
        native.insertAdjacentElement('afterend', trigger);
      }
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-autocomplete', 'none');
      if (!trigger.id) trigger.id = `${native.id}-trigger`;

      const label = this.querySelector('label.ew-select__label, label');
      if (label) {
        if (!label.id) label.id = `${native.id}-label`;
        if (label.htmlFor === native.id) label.removeAttribute('for');
      }
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
        li.tabIndex = -1;
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
        this.#choose(opt, { restoreFocus: true });
        return;
      }
      if (e.target.closest('.ew-select__trigger')) {
        this.#setOpen(!this.#open, { restoreFocus: true });
      }
    };

    #onKeyDown = (e) => {
      const trigger = this.#trigger;
      const options = this.#options.filter((o) => o.getAttribute('aria-disabled') !== 'true');
      if (!trigger) return;
      const onTrigger = e.target === trigger || trigger.contains(e.target);

      if (onTrigger || this.#open) {
        if (e.key === 'Tab') {
          if (this.#open) {
            const active = this.#activeOption() || options[0];
            if (active) this.#choose(active, { restoreFocus: false, keepOpen: false });
            else this.#setOpen(false, { restoreFocus: false });
          }
          return;
        }
        if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
          e.preventDefault();
          if (!this.#open) {
            this.#setOpen(true, { restoreFocus: true });
            return;
          }
          const cur = this.#activeOption() || options.find((o) => o.getAttribute('aria-selected') === 'true') || options[0];
          const i = options.indexOf(cur);
          const next =
            e.key === 'ArrowDown'
              ? options[Math.min(Math.max(i, 0) + 1, options.length - 1)]
              : options[Math.max(i <= 0 ? 0 : i - 1, 0)];
          this.#setActive(next);
          return;
        }
        if (e.key === 'Home' && this.#open) {
          e.preventDefault();
          this.#setActive(options[0]);
          return;
        }
        if (e.key === 'End' && this.#open) {
          e.preventDefault();
          this.#setActive(options[options.length - 1]);
          return;
        }
        if ((e.key === 'Enter' || e.key === ' ') && onTrigger) {
          e.preventDefault();
          if (!this.#open) this.#setOpen(true, { restoreFocus: true });
          else {
            const active = this.#activeOption();
            if (active) this.#choose(active, { restoreFocus: true });
          }
          return;
        }
        if (e.key === 'Escape' && this.#open) {
          e.preventDefault();
          this.#setOpen(false, { restoreFocus: true });
          return;
        }
        // Typeahead
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          if (!this.#open) this.#setOpen(true, { restoreFocus: true });
          this.#typeahead += e.key.toLowerCase();
          clearTimeout(this.#typeaheadTimer);
          this.#typeaheadTimer = setTimeout(() => {
            this.#typeahead = '';
          }, 500);
          const match = options.find((o) =>
            (o.textContent || '').trim().toLowerCase().startsWith(this.#typeahead)
          );
          if (match) this.#setActive(match);
        }
      }
    };

    #activeOption() {
      return this.#activeId ? this.#options.find((o) => o.id === this.#activeId) : null;
    }

    #setActive(opt) {
      if (!opt) return;
      this.#activeId = opt.id;
      const trigger = this.#trigger;
      trigger?.setAttribute('aria-activedescendant', opt.id);
      this.#options.forEach((o) => {
        o.classList.toggle('is-active', o === opt);
      });
      opt.scrollIntoView?.({ block: 'nearest' });
    }

    #setOpen(open, { restoreFocus = false } = {}) {
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
        this.#setActive(selected);
        trigger.focus();
      } else {
        document.removeEventListener('pointerdown', this.#onDocPointer, true);
        trigger.removeAttribute('aria-activedescendant');
        this.#activeId = null;
        this.#options.forEach((o) => o.classList.remove('is-active'));
        if (restoreFocus) trigger.focus();
      }
    }

    #choose(opt, { restoreFocus = true } = {}) {
      const native = this.#native;
      this.#options.forEach((o) => {
        o.setAttribute('aria-selected', o === opt ? 'true' : 'false');
      });
      if (native) {
        native.value = opt.dataset.value;
        native.dispatchEvent(new Event('change', { bubbles: true }));
      }
      this.#updateTriggerLabel();
      this.#setOpen(false, { restoreFocus });
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
