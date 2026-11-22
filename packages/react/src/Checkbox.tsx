import * as React from 'react';

export type CheckboxProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "card";
  size?: "sm" | "md" | "lg";
  [dataAttr: `data-${string}`]: string | undefined;
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Labeled checkbox. Native input; eras skin the box. */
export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-checkbox', className].filter(Boolean).join(' ');
  return React.createElement(
    'input[type=checkbox]',
    { ref, className: cls, ...dataProps, ...rest },
    children
  );
});
Checkbox.displayName = 'Checkbox';
