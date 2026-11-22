import * as React from 'react';

export type OrnamentDividerProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "line" | "ornament";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Structural divider; eras supply ornament via decorators. */
export const OrnamentDivider = React.forwardRef<HTMLElement, OrnamentDividerProps>(function OrnamentDivider(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-ornament-divider', className].filter(Boolean).join(' ');
  return React.createElement(
    'hr|div',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
OrnamentDivider.displayName = 'OrnamentDivider';
