import * as React from 'react';

export type AlertProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Inline alert for page-level feedback. */
export const Alert = React.forwardRef<HTMLElement, AlertProps>(function Alert(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-alert', className].filter(Boolean).join(' ');
  return React.createElement(
    'div',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Alert.displayName = 'Alert';
