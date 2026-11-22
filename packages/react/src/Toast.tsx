import * as React from 'react';

export type ToastProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Transient notification region. CSS chrome; live region polite by default. */
export const Toast = React.forwardRef<HTMLElement, ToastProps>(function Toast(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-toast-region', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-toast-region',
    { ref, class: cls, ...dataProps, ...rest },
    children
  );
});
Toast.displayName = 'Toast';
