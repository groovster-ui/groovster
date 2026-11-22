import * as React from 'react';

export type SelectProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "outline" | "filled";
  size?: "sm" | "md" | "lg";
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: Native select with era chrome. Rich combobox WC deferred. */
export const Select = React.forwardRef<HTMLElement, SelectProps>(function Select(
  { className, children, variant, size, ...rest },
  ref
) {
  const dataProps: Record<string, string> = {};
    if (variant != null) dataProps["data-variant"] = variant;
    if (size != null) dataProps["data-size"] = size;
  const cls = ['ew-select', className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-select',
    { ref, class: cls, ...dataProps, ...rest },
    children
  );
});
Select.displayName = 'Select';
