import * as React from 'react';

export type TooltipProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default";
  size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: CSS tooltip for non-essential hints. Never the only accessible name. */
export const Tooltip = React.forwardRef<HTMLElement, TooltipProps>(function Tooltip(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-tooltip', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-tooltip',
    { ref, class: cls, ...dataProps, ...rest },
    children
  );
});
Tooltip.displayName = 'Tooltip';
