import * as React from 'react';

export type ToastProps = Omit<React.HTMLAttributes<HTMLElement>, 'size'> & {
  variant?: "info" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
};

/** Transient notification region. CSS chrome; live region polite by default. */
export const Toast = React.forwardRef<HTMLElement, ToastProps>(function Toast(
  { className, variant, size, children, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-toast", "ew-toast-region", className].filter(Boolean).join(' ');
  return React.createElement(
    "ew-toast-region",
    { ref, ...rest, className: cls, ...dataProps },
    children
  );
});
Toast.displayName = "Toast";
