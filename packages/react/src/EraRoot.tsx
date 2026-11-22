import * as React from 'react';

export type EraRootProps = {
  era: string;
  mode?: 'light' | 'dark';
  fidelity?: number;
  fidelityBand?: 'whisper' | 'signature' | 'costume';
  dialect?: string;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function EraRoot({
  era,
  mode = 'light',
  fidelity,
  fidelityBand,
  dialect,
  className,
  children,
  ...rest
}: EraRootProps) {
  const cls = ['ew-root', className].filter(Boolean).join(' ');
  const data: Record<string, string> = { 'data-era': era, 'data-mode': mode };
  if (fidelity != null) data['data-fidelity'] = String(fidelity);
  if (fidelityBand) data['data-fidelity-band'] = fidelityBand;
  if (dialect) data['data-dialect'] = dialect;
  return React.createElement('div', { className: cls, ...data, ...rest }, children);
}
