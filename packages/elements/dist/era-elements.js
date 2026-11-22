/* era-elements.js — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */
/* Bundle of Tabs, Select, Menu, Popover, Tooltip, Toast, Slider. Zag.js not used. */

/* ---- ew-tabs.js ---- */
/**
 * <ew-tabs> — light-DOM Tabs web component (WAI-ARIA APG pattern).
 * Progressive enhancement over role=tablist/tab/tabpanel markup.
 * No dependencies. This published file must import nothing.
 *
 * Keyboard: Left/Right (horizontal), Up/Down (vertical), Home/End, Enter/Space.
 * Activation: automatic on arrow by default; data-activation="manual" for Enter/Space only.
 */
(() => {
  const TAG = 'ew-tabs';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwTabs extends HTMLElement {
    #mo = null;

    static get observedAttributes() {
      return ['data-orientation', 'data-activation'];
    }

    connectedCallback() {
      this.setAttribute('class', `${this.className} ew-tabs`.trim());
      if (!this.hasAttribute('data-orientation')) {
        this.dataset.orientation = 'horizontal';
      }
      this.#bind();
      this.#upgrade();
      if (!this.#list) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true, subtree: true });
      }
    }

    disconnectedCallback() {
      this.#mo?.disconnect();
      this.#mo = null;
      this.#unbind();
    }

    #upgrade() {
      if (!this.#list) return;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensureIds();
      this.#syncFromDom();
      const list = this.#list;
      if (list) list.setAttribute('aria-orientation', this.#orientation);
    }

    get #list() {
      return this.querySelector('[role="tablist"]');
    }

    get #tabs() {
      return [...this.querySelectorAll('[role="tab"]')];
    }

    get #panels() {
      return [...this.querySelectorAll('[role="tabpanel"]')];
    }

    get #orientation() {
      return this.dataset.orientation === 'vertical' ? 'vertical' : 'horizontal';
    }

    get #manual() {
      return this.dataset.activation === 'manual';
    }

    #onClick = (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (!tab || !this.contains(tab) || tab.getAttribute('aria-disabled') === 'true') return;
      this.#select(tab, { focus: true });
    };

    #onKeyDown = (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (!tab || !this.contains(tab)) return;
      const tabs = this.#tabs.filter((t) => t.getAttribute('aria-disabled') !== 'true');
      const i = tabs.indexOf(tab);
      if (i < 0) return;

      const vertical = this.#orientation === 'vertical';
      const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
      let next = null;

      switch (e.key) {
        case prevKey:
          next = tabs[(i - 1 + tabs.length) % tabs.length];
          break;
        case nextKey:
          next = tabs[(i + 1) % tabs.length];
          break;
        case 'Home':
          next = tabs[0];
          break;
        case 'End':
          next = tabs[tabs.length - 1];
          break;
        case 'Enter':
        case ' ':
          if (this.#manual) {
            e.preventDefault();
            this.#select(tab, { focus: true });
          }
          return;
        default:
          return;
      }

      if (next) {
        e.preventDefault();
        if (this.#manual) {
          next.focus();
        } else {
          this.#select(next, { focus: true });
        }
      }
    };

    #bind() {
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKeyDown);
      const list = this.#list;
      if (list) {
        list.setAttribute('aria-orientation', this.#orientation);
      }
    }

    #unbind() {
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKeyDown);
    }

    #ensureIds() {
      for (const tab of this.#tabs) {
        if (!tab.id) tab.id = `${TAG}-tab-${++uid}`;
        const panelId = tab.getAttribute('aria-controls');
        let panel = panelId ? this.querySelector(`#${CSS.escape(panelId)}`) : null;
        if (!panel) {
          // pair by index
          panel = this.#panels[this.#tabs.indexOf(tab)];
        }
        if (panel) {
          if (!panel.id) panel.id = `${tab.id}-panel`;
          tab.setAttribute('aria-controls', panel.id);
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', tab.id);
        }
      }
    }

    #syncFromDom() {
      const selected =
        this.#tabs.find((t) => t.getAttribute('aria-selected') === 'true') || this.#tabs[0];
      if (selected) this.#select(selected, { focus: false });
    }

    #select(tab, { focus }) {
      for (const t of this.#tabs) {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const panel = this.querySelector(`#${CSS.escape(t.getAttribute('aria-controls') || '')}`);
        if (panel) {
          if (on) panel.removeAttribute('hidden');
          else panel.setAttribute('hidden', '');
        }
      }
      if (focus) tab.focus();
      this.dispatchEvent(
        new CustomEvent('ew-tabs-change', {
          bubbles: true,
          detail: { tabId: tab.id, panelId: tab.getAttribute('aria-controls') },
        })
      );
    }
  }

  customElements.define(TAG, EwTabs);
})();


/* ---- ew-select.js ---- */
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


/* ---- ew-menu.js ---- */
/**
 * <ew-menu> — light-DOM Menu Button (WAI-ARIA APG).
 * Public classes: ew-menu*. No dependencies. No imports. Zag.js: not used.
 * Outside click closes without restoring focus. Escape/selection restore focus.
 * Typeahead jumps to matching menuitems.
 */
(() => {
  const TAG = 'ew-menu';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwMenu extends HTMLElement {
    #open = false;
    #ready = false;
    #mo = null;
    #typeahead = '';
    #typeaheadTimer = null;
    #onDoc = (e) => {
      if (!this.#open) return;
      if (!this.contains(e.target)) this.#setOpen(false, { restoreFocus: false });
    };

    connectedCallback() {
      this.classList.add('ew-menu');
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      if (!this.#ready) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true, subtree: true });
      }
    }
    disconnectedCallback() {
      this.#mo?.disconnect();
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
      document.removeEventListener('pointerdown', this.#onDoc, true);
      clearTimeout(this.#typeaheadTimer);
    }

    get #trigger() {
      return this.querySelector('.ew-menu__trigger, [aria-haspopup="menu"]');
    }
    get #panel() {
      return this.querySelector('.ew-menu__panel, [role="menu"]');
    }
    get #items() {
      return [...(this.#panel?.querySelectorAll('[role="menuitem"]') || [])].filter(
        (i) => i.getAttribute('aria-disabled') !== 'true'
      );
    }

    #upgrade() {
      if (this.#ready || !this.#trigger || !this.#panel) return;
      this.#ready = true;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensure();
    }

    #ensure() {
      const trigger = this.#trigger;
      const panel = this.#panel;
      if (!trigger || !panel) return;
      if (!panel.id) panel.id = `${TAG}-${++uid}`;
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', 'false');
      panel.setAttribute('role', 'menu');
      panel.hidden = true;
      this.#items.forEach((item, i) => {
        item.tabIndex = -1;
        if (!item.id) item.id = `${panel.id}-item-${i}`;
      });
    }

    #onClick = (e) => {
      const item = e.target.closest('[role="menuitem"]');
      if (item && this.contains(item)) {
        this.#activate(item);
        return;
      }
      if (e.target.closest('.ew-menu__trigger, [aria-haspopup="menu"]')) {
        e.preventDefault();
        this.#setOpen(!this.#open, { restoreFocus: true });
      }
    };

    #onKey = (e) => {
      const trigger = this.#trigger;
      const items = this.#items;
      if (e.target === trigger || trigger?.contains(e.target)) {
        if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          this.#setOpen(true, { restoreFocus: true });
          items[0]?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.#setOpen(true, { restoreFocus: true });
          items[items.length - 1]?.focus();
        } else if (e.key === 'Escape' && this.#open) {
          e.preventDefault();
          this.#setOpen(false, { restoreFocus: true });
        }
        return;
      }
      const item = e.target.closest('[role="menuitem"]');
      if (!item) return;
      const i = items.indexOf(item);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(i + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.#activate(item);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.#setOpen(false, { restoreFocus: true });
      } else if (e.key === 'Tab') {
        this.#setOpen(false, { restoreFocus: false });
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        this.#typeahead += e.key.toLowerCase();
        clearTimeout(this.#typeaheadTimer);
        this.#typeaheadTimer = setTimeout(() => {
          this.#typeahead = '';
        }, 500);
        const match = items.find((it) =>
          (it.textContent || '').trim().toLowerCase().startsWith(this.#typeahead)
        );
        match?.focus();
      }
    };

    #setOpen(open, { restoreFocus = false } = {}) {
      this.#open = open;
      const trigger = this.#trigger;
      const panel = this.#panel;
      if (!trigger || !panel) return;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
      if (open) document.addEventListener('pointerdown', this.#onDoc, true);
      else {
        document.removeEventListener('pointerdown', this.#onDoc, true);
        if (restoreFocus) trigger.focus();
      }
    }

    #activate(item) {
      this.dispatchEvent(
        new CustomEvent('ew-menu-select', {
          bubbles: true,
          detail: { id: item.id, label: item.textContent?.trim() },
        })
      );
      this.#setOpen(false, { restoreFocus: true });
    }
  }

  customElements.define(TAG, EwMenu);
})();


/* ---- ew-popover.js ---- */
/**
 * <ew-popover> — light-DOM non-modal popover (APG Disclosure / Popover pattern).
 * Uses Popover API when available; falls back to hidden toggle. No imports. Zag.js: not used.
 * Listens for the native `toggle` event so aria-expanded never goes stale.
 */
(() => {
  const TAG = 'ew-popover';
  if (customElements.get(TAG)) return;
  let uid = 0;

  class EwPopover extends HTMLElement {
    #ready = false;
    #mo = null;
    #onDoc = (e) => {
      if (!this.#isOpen()) return;
      if (!this.contains(e.target)) this.#close();
    };
    #onToggle = () => {
      this.#syncAria();
    };

    connectedCallback() {
      this.classList.add('ew-popover');
      this.addEventListener('click', this.#onClick);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      if (!this.#ready) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true, subtree: true });
      }
    }
    disconnectedCallback() {
      this.#mo?.disconnect();
      this.removeEventListener('click', this.#onClick);
      this.removeEventListener('keydown', this.#onKey);
      this.#panel?.removeEventListener('toggle', this.#onToggle);
      document.removeEventListener('pointerdown', this.#onDoc, true);
    }

    get #trigger() {
      return this.querySelector('.ew-popover__trigger, [popovertarget], [aria-expanded]');
    }
    get #panel() {
      return this.querySelector('.ew-popover__panel, [popover]');
    }

    #upgrade() {
      if (this.#ready || !this.#trigger || !this.#panel) return;
      this.#ready = true;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensure();
    }

    #ensure() {
      const trigger = this.#trigger;
      const panel = this.#panel;
      if (!trigger || !panel) return;
      if (!panel.id) panel.id = `${TAG}-${++uid}`;
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', 'false');
      if (!panel.hasAttribute('popover')) {
        panel.hidden = true;
      }
      panel.removeEventListener('toggle', this.#onToggle);
      panel.addEventListener('toggle', this.#onToggle);
    }

    #isOpen() {
      const panel = this.#panel;
      if (!panel) return false;
      if (typeof panel.matches === 'function' && panel.matches(':popover-open')) return true;
      return panel.hidden === false && !panel.hasAttribute('popover');
    }

    #onClick = (e) => {
      if (e.target.closest('.ew-popover__trigger, [popovertarget]')) {
        queueMicrotask(() => this.#syncAria());
        if (!this.#panel?.hasAttribute('popover')) {
          e.preventDefault();
          this.#isOpen() ? this.#close() : this.#open();
        } else {
          document.addEventListener('pointerdown', this.#onDoc, true);
        }
      }
    };

    #onKey = (e) => {
      if (e.key === 'Escape' && this.#isOpen()) {
        e.preventDefault();
        this.#close();
        this.#trigger?.focus();
      }
    };

    #open() {
      const panel = this.#panel;
      const trigger = this.#trigger;
      if (!panel || !trigger) return;
      if (typeof panel.showPopover === 'function' && panel.hasAttribute('popover')) {
        try {
          panel.showPopover();
        } catch {
          panel.hidden = false;
        }
      } else {
        panel.hidden = false;
      }
      this.#syncAria();
      document.addEventListener('pointerdown', this.#onDoc, true);
      this.dispatchEvent(new CustomEvent('ew-popover-open', { bubbles: true }));
    }

    #close() {
      const panel = this.#panel;
      if (!panel) return;
      if (typeof panel.hidePopover === 'function' && panel.hasAttribute('popover')) {
        try {
          panel.hidePopover();
        } catch {
          panel.hidden = true;
        }
      } else {
        panel.hidden = true;
      }
      this.#syncAria();
      document.removeEventListener('pointerdown', this.#onDoc, true);
      this.dispatchEvent(new CustomEvent('ew-popover-close', { bubbles: true }));
    }

    #syncAria() {
      const open = this.#isOpen();
      this.#trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) document.addEventListener('pointerdown', this.#onDoc, true);
      else document.removeEventListener('pointerdown', this.#onDoc, true);
    }
  }

  customElements.define(TAG, EwPopover);
})();


/* ---- ew-tooltip.js ---- */
/**
 * <ew-tooltip> — light-DOM Tooltip (WAI-ARIA APG).
 * Shows on focus/hover; Escape hides; not the only accessible name. No imports. Zag.js: not used.
 */
(() => {
  const TAG = 'ew-tooltip';
  if (customElements.get(TAG)) return;

  class EwTooltip extends HTMLElement {
    #ready = false;
    #mo = null;
    #showTimer = 0;
    #hideTimer = 0;

    connectedCallback() {
      this.classList.add('ew-tooltip');
      this.addEventListener('pointerenter', this.#onEnter);
      this.addEventListener('pointerleave', this.#onLeave);
      this.addEventListener('focusin', this.#onEnter);
      this.addEventListener('focusout', this.#onLeave);
      this.addEventListener('keydown', this.#onKey);
      this.#upgrade();
      if (!this.#ready) {
        this.#mo = new MutationObserver(() => this.#upgrade());
        this.#mo.observe(this, { childList: true, subtree: true });
      }
    }
    disconnectedCallback() {
      this.#mo?.disconnect();
      this.removeEventListener('pointerenter', this.#onEnter);
      this.removeEventListener('pointerleave', this.#onLeave);
      this.removeEventListener('focusin', this.#onEnter);
      this.removeEventListener('focusout', this.#onLeave);
      this.removeEventListener('keydown', this.#onKey);
      clearTimeout(this.#showTimer);
      clearTimeout(this.#hideTimer);
    }

    get #trigger() {
      return this.querySelector('button, a, [tabindex], .ew-button, .ew-icon-button');
    }
    get #tip() {
      return this.querySelector('.ew-tooltip__tip, [role="tooltip"]');
    }

    #upgrade() {
      if (this.#ready || !this.#tip || !this.#trigger) return;
      this.#ready = true;
      this.#mo?.disconnect();
      this.#mo = null;
      this.#ensure();
    }

    #ensure() {
      const tip = this.#tip;
      const trigger = this.#trigger;
      if (!tip || !trigger) return;
      if (!tip.id) tip.id = `${TAG}-${Math.random().toString(36).slice(2, 8)}`;
      tip.setAttribute('role', 'tooltip');
      tip.setAttribute('popover', 'manual');
      tip.dataset.ewOpen = 'false';
      if (!trigger.getAttribute('aria-describedby')?.includes(tip.id)) {
        const prev = trigger.getAttribute('aria-describedby') || '';
        trigger.setAttribute('aria-describedby', `${prev} ${tip.id}`.trim());
      }
    }

    #onEnter = () => {
      clearTimeout(this.#hideTimer);
      this.#showTimer = window.setTimeout(() => this.#show(), 300);
    };
    #onLeave = () => {
      clearTimeout(this.#showTimer);
      this.#hideTimer = window.setTimeout(() => this.#hide(), 100);
    };
    #onKey = (e) => {
      if (e.key === 'Escape') this.#hide();
    };

    #show() {
      const tip = this.#tip;
      if (!tip) return;
      tip.showPopover();
      tip.dataset.ewOpen = 'true';
      tip.style.opacity = '1';
    }
    #hide() {
      const tip = this.#tip;
      if (!tip || !tip.matches(':popover-open')) return;
      tip.hidePopover();
      tip.dataset.ewOpen = 'false';
      tip.style.opacity = '';
    }
  }

  customElements.define(TAG, EwTooltip);
})();


/* ---- ew-toast.js ---- */
/**
 * <ew-toast-region> — light-DOM toast host with polite live region (APG live regions).
 * Method: region.show({ title, body, variant, timeout }). No imports. Zag.js: not used.
 * Timer pauses on hover/focus. Uses role=status only (region is already live — no nested alert).
 */
(() => {
  const TAG = 'ew-toast-region';
  if (customElements.get(TAG)) return;

  class EwToastRegion extends HTMLElement {
    connectedCallback() {
      this.classList.add('ew-toast-region');
      if (!this.hasAttribute('aria-live')) this.setAttribute('aria-live', 'polite');
      if (!this.hasAttribute('aria-relevant')) this.setAttribute('aria-relevant', 'additions');
      this.setAttribute('aria-atomic', 'false');
    }

    /** @param {{title?: string, body: string, variant?: string, timeout?: number}} opts */
    show(opts = {}) {
      const toast = document.createElement('div');
      toast.className = 'ew-toast';
      toast.dataset.variant = opts.variant || 'info';
      // Region already has aria-live; keep a single status role (never nest role=alert).
      toast.setAttribute('role', 'status');
      if (opts.title) {
        const t = document.createElement('strong');
        t.className = 'ew-toast__title';
        t.textContent = opts.title;
        toast.appendChild(t);
      }
      const body = document.createElement('p');
      body.className = 'ew-toast__body';
      body.textContent = opts.body || '';
      toast.appendChild(body);

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'ew-icon-button';
      close.dataset.variant = 'ghost';
      close.setAttribute('aria-label', 'Dismiss');
      close.innerHTML = '<span class="ew-icon-button__icon" aria-hidden="true">×</span>';
      close.addEventListener('click', () => this.#dismiss(toast));
      toast.appendChild(close);

      const timeout = opts.timeout ?? 5000;
      toast._ewRemaining = timeout;
      toast._ewDeadline = 0;
      toast._ewTimer = 0;

      const pause = () => this.#pause(toast);
      const resume = () => this.#resume(toast);
      toast.addEventListener('pointerenter', pause);
      toast.addEventListener('pointerleave', resume);
      toast.addEventListener('focusin', pause);
      toast.addEventListener('focusout', resume);

      this.appendChild(toast);
      if (timeout > 0) this.#resume(toast);
      this.dispatchEvent(new CustomEvent('ew-toast-show', { bubbles: true, detail: opts }));
      return toast;
    }

    #pause(toast) {
      if (!toast._ewTimer) return;
      clearTimeout(toast._ewTimer);
      toast._ewTimer = 0;
      toast._ewRemaining = Math.max(0, toast._ewDeadline - Date.now());
    }

    #resume(toast) {
      if (toast._ewRemaining <= 0 || toast._ewTimer) return;
      toast._ewDeadline = Date.now() + toast._ewRemaining;
      toast._ewTimer = window.setTimeout(() => this.#dismiss(toast), toast._ewRemaining);
    }

    #dismiss(toast) {
      if (!toast.isConnected) return;
      if (toast._ewTimer) clearTimeout(toast._ewTimer);
      toast.remove();
      this.dispatchEvent(new CustomEvent('ew-toast-dismiss', { bubbles: true }));
    }
  }

  customElements.define(TAG, EwToastRegion);
})();


/* ---- ew-slider.js ---- */
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
