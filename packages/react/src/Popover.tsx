import * as React from 'react';

export type PopoverProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "rich";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Non-modal popover surface via Popover API. */
export const Popover = React.forwardRef<HTMLElement, PopoverProps>(function Popover(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-popover', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-popover',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Popover.displayName = 'Popover';
