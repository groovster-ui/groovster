/**
 * Demo behavior for recipe sites: era switch, filters, fictional cart and forms.
 * Visual eras stay in CSS. This file imports nothing.
 */
(() => {
  const ERA_IDS = ["art-nouveau","bauhaus","deco","folklore","futurist","groovy","mcm-atomic","memphis","neon","neutral","nordic","swiss"];
  const ERAS = [["art-nouveau","Art Nouveau"],["bauhaus","Bauhaus"],["deco","Deco"],["folklore","Folklore"],["futurist","Futurist"],["groovy","Groovy"],["mcm-atomic","Atomic"],["memphis","Memphis"],["neon","Neon"],["neutral","Neutral"],["nordic","Nordic"],["swiss","Swiss International"]];
  const MODES = [['light', 'Light'], ['dark', 'Dark']];
  const BANDS = [['whisper', 'Whisper'], ['standard', 'Standard'], ['costume', 'Costume']];
  const root = document.querySelector('[data-groovster-root]');
  if (!root) return;
  const cart = [];
  const pick = (list, value, fallback) => (list.includes(value) ? value : fallback);
  const current = () => ({ era: root.dataset.era || 'neutral', mode: root.dataset.mode || 'light', band: root.dataset.fidelityBand || 'costume' });
  const storageKey = () => `groovster-skin:${root.dataset.recipe || 'site'}`;
  function apply(state, persist) {
    root.dataset.era = state.era;
    root.dataset.mode = state.mode;
    root.dataset.fidelityBand = state.band;
    if (persist && document.documentElement.dataset.embed !== '1') localStorage.setItem(storageKey(), JSON.stringify(state));
    for (const button of root.querySelectorAll('[data-skin-era]')) button.setAttribute('aria-pressed', button.dataset.skinEra === state.era ? 'true' : 'false');
    for (const button of root.querySelectorAll('[data-skin-mode]')) button.setAttribute('aria-pressed', button.dataset.skinMode === state.mode ? 'true' : 'false');
    for (const button of root.querySelectorAll('[data-skin-band]')) button.setAttribute('aria-pressed', button.dataset.skinBand === state.band ? 'true' : 'false');
  }
  function bootState() {
    const params = new URLSearchParams(location.search);
    const embed = params.get('embed') === '1';
    if (embed) document.documentElement.dataset.embed = '1';
    const authored = current();
    const fromQuery = params.has('era') || params.has('mode') || params.has('band') || params.has('fidelity');
    if (fromQuery) {
      return {
        era: pick(ERA_IDS, params.get('era'), authored.era),
        mode: pick(['light', 'dark'], params.get('mode'), authored.mode),
        band: pick(['whisper', 'standard', 'costume'], params.get('band') || params.get('fidelity'), authored.band),
      };
    }
    if (!embed) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey()) || 'null');
        if (saved && typeof saved === 'object') {
          return {
            era: pick(ERA_IDS, saved.era, authored.era),
            mode: pick(['light', 'dark'], saved.mode, authored.mode),
            band: pick(['whisper', 'standard', 'costume'], saved.band, authored.band),
          };
        }
      } catch { /* ignore */ }
    }
    return authored;
  }
  function makeButton(label, attrs) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ew-button';
    button.dataset.variant = 'ghost';
    button.dataset.size = 'sm';
    button.textContent = label;
    Object.assign(button.dataset, attrs);
    return button;
  }
  function addGroup(parent, label, buttons) {
    const group = document.createElement('div');
    group.className = 'site-switcher';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', label);
    const title = document.createElement('p');
    title.textContent = label;
    group.append(title, ...buttons);
    parent.append(group);
  }
  function mountSwitcher() {
    const mount = document.querySelector('[data-skin-mount]');
    if (!mount || document.documentElement.dataset.embed === '1') { mount?.remove(); return; }
    const details = document.createElement('details');
    details.className = 'site-skin';
    if (mount.dataset.skinOpen !== 'false') details.open = true;
    const summary = document.createElement('summary');
    summary.textContent = 'Appearance — era, mode, and fidelity';
    details.append(summary);
    addGroup(details, 'Era', ERAS.map(([id, label]) => makeButton(label, { skinEra: id })));
    addGroup(details, 'Mode', MODES.map(([id, label]) => makeButton(label, { skinMode: id })));
    addGroup(details, 'Fidelity', BANDS.map(([id, label]) => makeButton(label, { skinBand: id })));
    mount.replaceWith(details);
  }
  function toast(title, body) {
    const region = document.querySelector('ew-toast-region');
    if (region && typeof region.show === 'function') region.show({ title, body, variant: 'success' });
  }
  function showStatus(form, message) {
    const status = form.querySelector('[data-demo-status]');
    if (!status) return;
    status.hidden = false;
    const body = status.querySelector('.ew-alert__body');
    if (body) body.textContent = message;
  }
  function ticketSummary() {
    const tier = document.querySelector('input[name="tier"]:checked');
    const label = tier?.closest('label')?.querySelector('.ew-radio__label')?.textContent?.trim() || 'No tier';
    const qty = document.querySelector('#ticket-qty')?.value || '1';
    return `${qty} × ${label}. Fictional hold — no payment is taken.`;
  }
  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const countNode = document.querySelector('[data-cart-count]');
    if (countNode) countNode.textContent = String(count);
    const lines = document.querySelector('[data-cart-lines]');
    const total = document.querySelector('[data-cart-total]');
    if (!lines) return;
    lines.replaceChildren();
    if (!cart.length) {
      const empty = document.createElement('li');
      empty.textContent = 'Cart is empty.';
      lines.append(empty);
    }
    let cents = 0;
    for (const item of cart) {
      const li = document.createElement('li');
      li.textContent = `${item.qty} × ${item.name} — $${item.price * item.qty}`;
      lines.append(li);
      cents += item.price * item.qty;
    }
    if (total) total.textContent = cart.length ? `Sample total $${cents}. Nothing is charged.` : '';
  }
  function applyItems() {
    const category = document.querySelector('[data-item-filter]')?.value || 'all';
    const onlyStock = Boolean(document.querySelector('[data-stock-filter]')?.checked);
    for (const item of document.querySelectorAll('[data-item]')) {
      const okCategory = category === 'all' || item.dataset.category === category;
      const okStock = !onlyStock || item.dataset.stock === 'in';
      item.hidden = !(okCategory && okStock);
    }
  }
  function applyRows() {
    const query = (document.querySelector('[data-row-filter]')?.value || '').trim().toLowerCase();
    const status = document.querySelector('[data-status-filter]')?.value || 'all';
    let visible = 0;
    for (const row of document.querySelectorAll('[data-row]')) {
      const hay = (row.dataset.row || row.textContent || '').toLowerCase();
      const okQuery = !query || hay.includes(query);
      const okStatus = status === 'all' || row.dataset.status === status;
      row.hidden = !(okQuery && okStatus);
      if (!row.hidden) visible += 1;
    }
    const live = document.querySelector('[data-row-count]');
    if (live) live.textContent = `${visible} matching rows`;
  }
  document.addEventListener('click', (event) => {
    const skinEra = event.target.closest('[data-skin-era]');
    const skinMode = event.target.closest('[data-skin-mode]');
    const skinBand = event.target.closest('[data-skin-band]');
    if (skinEra || skinMode || skinBand) {
      const state = current();
      if (skinEra) state.era = skinEra.dataset.skinEra;
      if (skinMode) state.mode = skinMode.dataset.skinMode;
      if (skinBand) state.band = skinBand.dataset.skinBand;
      apply(state, true);
      return;
    }
    const opener = event.target.closest('[data-open-dialog]');
    if (opener) {
      const dialog = document.getElementById(opener.dataset.openDialog);
      if (!dialog || typeof dialog.showModal !== 'function') return;
      if (opener.dataset.summarize === 'tickets') {
        const slot = dialog.querySelector('[data-summary]');
        if (slot) slot.textContent = ticketSummary();
      }
      if (!dialog.open) dialog.showModal();
      return;
    }
    const closer = event.target.closest('[data-close-dialog]');
    if (closer) { closer.closest('dialog')?.close(); return; }
    const sample = event.target.closest('[data-sample-export]');
    if (sample) { toast('Export', 'No file was created. This board is fictional.'); return; }
    const add = event.target.closest('[data-cart-add]');
    if (add) {
      const sku = add.dataset.sku;
      const found = cart.find((item) => item.sku === sku);
      if (found) found.qty += 1;
      else cart.push({ sku, name: add.dataset.name, price: Number(add.dataset.price), qty: 1 });
      renderCart();
      toast('Added', `${add.dataset.name} is in the fictional cart.`);
    }
  });
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('[data-demo-form]')) return;
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const kind = form.dataset.demoForm;
    const message = kind === 'reservation'
      ? 'Request noted. Fictional — no room is held and no message is sent.'
      : kind === 'checkout'
        ? 'Order recorded locally. Fictional — no payment is taken.'
        : 'Saved on this page only. No list is contacted.';
    showStatus(form, message);
    toast('Recorded', message);
    const dialogId = form.dataset.openOnSuccess;
    if (dialogId) {
      const dialog = document.getElementById(dialogId);
      if (dialog && !dialog.open) dialog.showModal();
    }
  });
  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('ew-switch__control')) target.setAttribute('aria-checked', target.checked ? 'true' : 'false');
    if (target.matches('[data-freeze]')) {
      const note = document.querySelector('[data-freeze-note]');
      if (note) note.hidden = !target.checked;
    }
    if (target.matches('[data-item-filter], [data-stock-filter]')) applyItems();
    if (target.matches('[data-status-filter]')) applyRows();
  });
  document.addEventListener('input', (event) => {
    if (event.target instanceof HTMLElement && event.target.matches('[data-row-filter]')) applyRows();
  });
  window.addEventListener('message', (event) => {
    const trusted = location.origin === 'null' ? event.origin === 'null' || event.origin === '' : event.origin === location.origin;
    if (!trusted) return;
    const data = event.data;
    if (!data || data.type !== 'groovster-skin') return;
    const state = current();
    apply({
      era: data.era ? pick(ERA_IDS, data.era, state.era) : state.era,
      mode: data.mode ? pick(['light', 'dark'], data.mode, state.mode) : state.mode,
      band: data.band ? pick(['whisper', 'standard', 'costume'], data.band, state.band) : state.band,
    }, false);
  });
  apply(bootState(), false);
  mountSwitcher();
  renderCart();
  applyItems();
  applyRows();
})();
