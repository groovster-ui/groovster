import * as React from 'react';

export type ToastProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Transient notification region. CSS chrome; live region polite by default. */
export const Toast = React.forwardRef<HTMLElement, ToastProps>(function Toast(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-toast', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-toast-region',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Toast.displayName = 'Toast';
