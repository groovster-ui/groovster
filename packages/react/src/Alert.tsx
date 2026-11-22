import * as React from 'react';

export type AlertProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'size' | 'title'> & {
  title?: React.ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
};

/** Inline alert for page-level feedback. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant, size, title, children, role, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const cls = ["ew-alert", className].filter(Boolean).join(' ');
  return React.createElement(
    'div',
    { ref, className: cls, role: role ?? 'status', ...dataProps, ...rest },
    title != null ? React.createElement('strong', { className: "ew-alert__title" }, title) : null,
    React.createElement('p', { className: "ew-alert__body" }, children)
  );
});
Alert.displayName = "Alert";
