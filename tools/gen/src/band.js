/**
 * Fidelity-band selectors: costume is the default when data-fidelity-band is absent.
 * Band may be set on the era element or any ancestor (html/body/.ew-root).
 */

/** Opt-out bands that mute costume ornament. `default`/`signature` are deprecated aliases of `standard`. */
export const MUTE_BANDS = ['whisper', 'standard', 'default', 'signature'];

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
 * Selectors for one or more exact bands on the era root or an ancestor.
 * @param {string} era
 * @param {string|string[]} bands
 * @param {string} [rest]
 */
export function bandSel(era, bands, rest = '') {
  const list = Array.isArray(bands) ? bands : [bands];
  const parts = [];
  for (const band of list) {
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
  return `  /* Bands: whisper | standard | costume. default/signature alias standard. Costume when absent.
     Do not set --ew-band on bare [data-era] — that would block ancestor-band inheritance. */
  :root {
    --ew-band: costume;
  }
  [data-fidelity-band="whisper"] { --ew-band: whisper; }
  [data-fidelity-band="standard"],
  [data-fidelity-band="default"],
  [data-fidelity-band="signature"] { --ew-band: standard; }
  [data-fidelity-band="costume"] { --ew-band: costume; }
`;
}
