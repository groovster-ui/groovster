import * as React from 'react';

export type SelectProps = Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> & {
  label?: React.ReactNode;
  variant?: "outline" | "filled";
  size?: "sm" | "md" | "lg";
};

/** Native select with era chrome. Rich combobox WC deferred. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, variant, size, label, children, id, ...rest },
  ref
) {
  const autoId = React.useId();
  const controlId = id ?? autoId;
  const dataProps: Record<string, string> = {};
  if (variant != null) dataProps["data-variant"] = variant;
  if (size != null) dataProps["data-size"] = size;
  const rootExtra: Record<string, unknown> = {};
  const controlProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (key.startsWith('data-') || key === 'style') rootExtra[key] = value;
    else controlProps[key] = value;
  }
  const cls = ["ew-select", className].filter(Boolean).join(' ');
  return React.createElement(
    'ew-select',
    { className: cls, ...dataProps, ...(rootExtra as React.HTMLAttributes<HTMLElement>) },
    React.createElement('label', { className: "ew-select__label", htmlFor: controlId }, label),
    React.createElement(
      'select',
      {
        ...(controlProps as React.SelectHTMLAttributes<HTMLSelectElement>),
        ref,
        id: controlId,
        className: "ew-select__control",
      },
      children
    )
  );
});
Select.displayName = "Select";
