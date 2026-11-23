document.querySelectorAll('[data-local-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = document.querySelector('[data-note]');
    if (note) note.textContent = form.dataset.localForm;
    const dialog = document.getElementById(form.dataset.dialog || '');
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  });
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});

const catalog = document.querySelector('[data-catalog]');
if (catalog) {
  const cards = [...catalog.querySelectorAll('[data-product]')];
  const count = document.querySelector('[data-count]');
  const apply = () => {
    const term = (document.querySelector('[data-filter]')?.value || 'all').toLowerCase();
    const stocked = document.querySelector('[data-stock]')?.checked;
    let shown = 0;
    cards.forEach((card) => {
      const okKind = term === 'all' || card.dataset.product === term;
      const okStock = !stocked || card.dataset.stock === 'in';
      const hide = !(okKind && okStock);
      card.hidden = hide;
      if (!hide) shown += 1;
    });
    if (count) count.textContent = `${shown} objects`;
  };
  document.querySelector('[data-filter]')?.addEventListener('change', apply);
  document.querySelector('[data-stock]')?.addEventListener('change', apply);
  let cart = 0;
  catalog.addEventListener('click', (event) => {
    const button = event.target.closest('[data-buy]');
    if (!button) return;
    cart += Number(button.dataset.buy);
    const total = document.querySelector('[data-cart]');
    if (total) total.textContent = cart.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  });
}

const queue = document.querySelector('[data-queue]');
if (queue) {
  const rows = [...queue.querySelectorAll('tbody tr')];
  const live = document.querySelector('[data-live]');
  const apply = () => {
    const term = (document.querySelector('[data-search]')?.value || '').toLowerCase();
    const status = document.querySelector('[data-status]')?.value || 'all';
    let shown = 0;
    rows.forEach((row) => {
      const hide = !(row.textContent.toLowerCase().includes(term) && (status === 'all' || row.dataset.status === status));
      row.hidden = hide;
      if (!hide) shown += 1;
    });
    if (live) live.textContent = `${shown} rows`;
  };
  document.querySelector('[data-search]')?.addEventListener('input', apply);
  document.querySelector('[data-status]')?.addEventListener('change', apply);
}

const clock = document.querySelector('[data-clock]');
if (clock) {
  clock.addEventListener('change', () => {
    clock.setAttribute('aria-checked', clock.checked ? 'true' : 'false');
    const note = document.querySelector('[data-clock-note]');
    if (note) note.textContent = clock.checked ? 'Sample clock is running.' : 'Sample clock is frozen.';
  });
}
