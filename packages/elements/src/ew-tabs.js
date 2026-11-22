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
  
  let idCounter = 0;

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
      let n = 0;
      for (const tab of this.#tabs) {
        if (!tab.id) tab.id = `${TAG}-tab-${++n}`;
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
