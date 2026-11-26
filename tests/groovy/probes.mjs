/** Shared browser assertions: used by the Chromium test and the local review harness. */
export async function inspectGroovyPage() {
  await document.fonts.ready;
  const errors = [];
  const root = document.querySelector('[data-era="groovy"]');
  const width = document.documentElement.clientWidth;
  const visible = el => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== 'hidden';
  if (!document.fonts.check('24px "Spicy Rice"')) errors.push('Display font did not load');
  if (!document.fonts.check('16px Mulish')) errors.push('Body font did not load');
  if (document.documentElement.scrollWidth > width + 1) errors.push('Page overflow');
  for (const el of document.querySelectorAll('h1,h2,h3,.ew-button,.ew-icon-button,.ew-select__control,.ew-text-field__control,.ew-textarea__control,.ew-switch,.ew-checkbox,.ew-radio,[role="tab"]')) {
    if (!visible(el) || el.closest('.review-scroll,[popover],dialog:not([open])')) continue;
    const r = el.getBoundingClientRect();
    if (r.left < -1 || r.right > width + 1) errors.push(`Clipped ${el.className || el.tagName}: ${r.left},${r.right}`);
    if (el.matches('.ew-button,.ew-icon-button,.ew-select__control,.ew-text-field__control,.ew-switch,.ew-checkbox,.ew-radio,[role="tab"]') && r.height < 43.9) errors.push(`Short target ${el.className || el.tagName}: ${r.height}`);
  }
  const card = document.querySelector('.ew-card');
  const header = document.querySelector('.ew-card__header');
  return {
    width, mode: root.dataset.mode, band: root.dataset.fidelityBand, errors,
    components: [...document.querySelectorAll('[data-component]')].map(el => el.dataset.component),
    style: { border: getComputedStyle(card).borderTopWidth, radius: getComputedStyle(card).borderRadius, frame: getComputedStyle(card,'::after').backgroundImage !== 'none', header: getComputedStyle(header).backgroundColor, buttonFont: getComputedStyle(document.querySelector('.ew-button')).fontFamily },
  };
}
