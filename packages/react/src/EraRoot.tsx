import * as React from 'react';

/** Public fidelity API. `default` and `signature` are deprecated aliases of `standard`. */
export type FidelityBand = 'whisper' | 'standard' | 'costume' | 'default' | 'signature';

export type EraRootProps = {
  era: string;
  mode?: 'light' | 'dark';
  /** whisper | standard | costume. Costume is the default when omitted. */
  fidelityBand?: FidelityBand;
  dialect?: string;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

const BAND_ALIAS: Record<string, string> = { default: 'standard', signature: 'standard' };

export const EraRoot = React.forwardRef<HTMLDivElement, EraRootProps>(function EraRoot(
  { era, mode = 'light', fidelityBand, dialect, className, children, ...rest },
  ref
) {
  const cls = ['ew-root', className].filter(Boolean).join(' ');
  const data: Record<string, string> = { 'data-era': era, 'data-mode': mode };
  if (fidelityBand) data['data-fidelity-band'] = BAND_ALIAS[fidelityBand] || fidelityBand;
  if (dialect) data['data-dialect'] = dialect;
  return React.createElement('div', { ref, className: cls, ...data, ...rest }, children);
});
EraRoot.displayName = 'EraRoot';
