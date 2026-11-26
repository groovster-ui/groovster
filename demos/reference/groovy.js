/* Local fixture behavior only; no network, decoration or library runtime changes. */
const root = document.querySelector('[data-era="groovy"]');
const params = new URLSearchParams(location.search);
for (const key of ['mode','band']) {
  const control = document.querySelector(`[data-${key}-switch]`);
  const attribute = key === 'band' ? 'fidelityBand' : 'mode';
  if ([...control.options].some(o => o.value === params.get(key))) control.value = params.get(key);
  const apply = () => { root.dataset[attribute] = control.value; };
  control.addEventListener('change', apply); apply();
}
document.querySelectorAll('input[role="switch"]').forEach(input => input.addEventListener('change', () => input.setAttribute('aria-checked', String(input.checked))));
document.querySelectorAll('[data-open-dialog]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.openDialog).showModal()));
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('[data-live]').textContent = `${button.textContent.trim()} scene selected. Demonstration only.`;
}));
document.querySelector('[data-toast]')?.addEventListener('click', () => document.querySelector('ew-toast-region').show({ title: 'Saved locally', body: 'Your demonstration preferences are ready.', variant: 'success' }));
