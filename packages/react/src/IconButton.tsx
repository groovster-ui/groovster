import * as React from 'react';

export type IconButtonProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Icon-only button with required accessible name. */
export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-icon-button', className].filter(Boolean).join(' ');
  return React.createElement(
    'button',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
IconButton.displayName = 'IconButton';
