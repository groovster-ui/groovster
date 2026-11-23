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
function bandIs(bands) {
  return `:is(${bands.map((band) => `[data-fidelity-band="${band}"]`).join(',')})`;
}

export function muteBandSel(era, rest = '') {
  const bands = bandIs(MUTE_BANDS);
  return `[data-era="${era}"]${bands}${rest}, ${bands} [data-era="${era}"]${rest}`;
}

/**
 * Selectors for one or more exact bands on the era root or an ancestor.
 * @param {string} era
 * @param {string|string[]} bands
 * @param {string} [rest]
 */
export function bandSel(era, bands, rest = '') {
  const list = bandIs(Array.isArray(bands) ? bands : [bands]);
  return `[data-era="${era}"]${list}${rest}, ${list} [data-era="${era}"]${rest}`;
}

/**
 * Costume / full-look selectors: era with no mute band on self, and not under a mute ancestor.
 * Prefer using muteBandSel to hide ornament (costume-on-by-default) rather than this for ::before rules.
 * @param {string} era
 * @param {string} [rest]
 */
export function costumeSel(era, rest = '') {
  const bands = bandIs(MUTE_BANDS);
  return [
    `[data-era="${era}"]:not(${bands}):not(${bands} *)${rest}`,
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
