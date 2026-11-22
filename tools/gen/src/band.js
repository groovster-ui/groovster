/**
 * Fidelity-band selectors: costume is the default when data-fidelity-band is absent.
 * Band may be set on the era element or any ancestor (html/body/.ew-root).
 */

/** Opt-out bands that mute costume ornament (default = former signature). */
export const MUTE_BANDS = ['whisper', 'default', 'signature'];

/**
 * Selectors matching an era when a mute band is active on self or an ancestor.
 * @param {string} era
 * @param {string} [rest] selector after the era root (e.g. " .ew-card::before")
 */
export function muteBandSel(era, rest = '') {
  const parts = [];
  for (const band of MUTE_BANDS) {
    parts.push(`[data-era="${era}"][data-fidelity-band="${band}"]${rest}`);
    parts.push(`[data-fidelity-band="${band}"] [data-era="${era}"]${rest}`);
  }
  return parts.join(',\n  ');
}

/**
 * Costume / full-look selectors: era with no mute band on self, and not under a mute ancestor.
 * Prefer using muteBandSel to hide ornament (costume-on-by-default) rather than this for ::before rules.
 * @param {string} era
 * @param {string} [rest]
 */
export function costumeSel(era, rest = '') {
  const notMuteSelf = MUTE_BANDS.map((b) => `:not([data-fidelity-band="${b}"])`).join('');
  const notMuteAnc = MUTE_BANDS.map((b) => `:not([data-fidelity-band="${b}"] *)`).join('');
  return [
    `[data-era="${era}"]${notMuteSelf}${notMuteAnc}${rest}`,
    `[data-fidelity-band="costume"] [data-era="${era}"]${rest}`,
  ].join(',\n  ');
}

/** CSS that resolves --ew-band from data-fidelity-band (inherits from ancestors). */
export function bandTokenCss() {
  return `  /* Bands only: whisper | default | costume (signature aliases default). Costume is the default. */
  :root, .ew-root, [data-era] {
    --ew-band: costume;
  }
  [data-fidelity-band="whisper"] { --ew-band: whisper; }
  [data-fidelity-band="default"],
  [data-fidelity-band="signature"] { --ew-band: default; }
  [data-fidelity-band="costume"] { --ew-band: costume; }
`;
}
