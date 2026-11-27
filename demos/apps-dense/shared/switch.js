const ERAS = [
  ['neutral', 'Neutral'],
  ['deco', 'Deco'],
  ['groovy', 'Groovy'],
  ['mcm-atomic', 'Atomic'],
  ['memphis', 'Memphis'],
  ['neon', 'Neon'],
  ['swiss', 'Swiss'],
  ['bauhaus', 'Bauhaus'],
  ['art-nouveau', 'Art Nouveau'],
];

const root = document.querySelector('[data-groovster-root]');
const bar = document.querySelector('[data-era-switch]');
if (root && bar) {
  const eraBox = document.createElement('div');
  eraBox.className = 'dense-switch';
  for (const [id, name] of ERAS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ew-button';
    button.dataset.variant = 'ghost';
    button.dataset.size = 'sm';
    button.dataset.setEra = id;
    button.textContent = name;
    eraBox.append(button);
  }
  for (const mode of ['light', 'dark']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ew-button';
    button.dataset.variant = 'ghost';
    button.dataset.size = 'sm';
    button.dataset.setMode = mode;
    button.textContent = mode;
    eraBox.append(button);
  }
  root.prepend(eraBox);
  bar.remove();
  eraBox.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.setEra) root.dataset.era = button.dataset.setEra;
    if (button.dataset.setMode) root.dataset.mode = button.dataset.setMode;
  });
}

document.querySelectorAll('[role="listbox"]').forEach((box) => {
  const items = () => [...box.querySelectorAll('[role="option"]')];
  items().forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
  });
  box.addEventListener('keydown', (event) => {
    const list = items();
    const index = list.indexOf(document.activeElement);
    const move = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!move || index < 0) return;
    event.preventDefault();
    const next = list[Math.min(list.length - 1, Math.max(0, index + move))];
    list.forEach((item) => {
      item.tabIndex = item === next ? 0 : -1;
    });
    next.focus();
  });
});
